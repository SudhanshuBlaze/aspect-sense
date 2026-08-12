import sys
import os
import json
import time
import threading
import argparse
import datetime
from typing import List, Dict, Any

sys.path.insert(0, os.path.dirname(__file__))

from utils.reviews_scraper import ReviewsScraper
from utils.pipeline import process_review_batch
from database.queries.save_reviews import save_reviews, get_db_stats
from database.queries.get_reviews import get_existing_captions

DEFAULT_LOCATIONS = ["Konark Sun Temple", "Puri Jagannath Temple", "Daringbadi Nature Park", "Gopalpur Sea Beach", "Tampara Lake"]
CONFIG_FILE = os.path.join(os.path.dirname(__file__), "active_locations.json")
LOG_FILE = os.path.join(os.path.dirname(__file__), "background_scraper.log")


def log_msg(msg: str):
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    formatted = f"[{timestamp}] {msg}"
    print(formatted)
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(formatted + "\n")
    except Exception:
        pass


class BackgroundScraperManager:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._init_manager()
            return cls._instance

    def _init_manager(self):
        self.running = False
        self.worker_thread = None
        self.pass_number = 0
        self.last_run_time = None
        self.scroll_counts = 8
        self.targets = self._load_active_locations()
        log_msg("BackgroundScraperManager initialized with Active Locations: " + str(self.targets))
        self.ensure_running()

    def _load_active_locations(self) -> List[str]:
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list) and data:
                        return data
            except Exception as e:
                log_msg(f"Notice loading active_locations.json: {e}")
        return list(DEFAULT_LOCATIONS)

    def _save_active_locations(self):
        try:
            with open(CONFIG_FILE, "w", encoding="utf-8") as f:
                json.dump(self.targets, f, indent=2)
        except Exception as e:
            log_msg(f"Error saving active_locations.json: {e}")

    def add_target(self, location: str) -> bool:
        loc_clean = location.strip()
        if not loc_clean:
            return False
        with self._lock:
            if loc_clean not in self.targets:
                self.targets.append(loc_clean)
                self._save_active_locations()
                log_msg(f"[Active Locations] Added '{loc_clean}'. Active locations: {self.targets}")
            self.ensure_running()
            return True

    def remove_target(self, location: str) -> bool:
        loc_clean = location.strip()
        with self._lock:
            if loc_clean in self.targets:
                self.targets.remove(loc_clean)
                self._save_active_locations()
                log_msg(f"[Active Locations] Removed '{loc_clean}'. Active locations: {self.targets}")
                return True
        return False

    def get_status(self) -> Dict[str, Any]:
        stats = get_db_stats()
        return {
            "is_running": self.running,
            "pass_number": self.pass_number,
            "last_run": self.last_run_time,
            "active_locations": self.targets,
            "database_totals": stats
        }

    def ensure_running(self):
        if not self.running or self.worker_thread is None or not self.worker_thread.is_alive():
            self.running = True
            self.worker_thread = threading.Thread(target=self._run_loop, daemon=True)
            self.worker_thread.start()
            log_msg("[BackgroundScraperManager] Started continuous background scraper worker thread.")

    def stop(self):
        self.running = False
        log_msg("[BackgroundScraperManager] Stopping background scraper...")

    def _scrape_single_target(self, target: str) -> int:
        log_msg(f"Starting continuous scrape for target: '{target}' (scrolls={self.scroll_counts})...")
        try:
            # Fetch existing saved captions for pre-filtering
            existing_captions = get_existing_captions(target)

            with ReviewsScraper(target) as scraper:
                df_scraped = scraper.scrape_reviews(scroll_counts=self.scroll_counts, sort_newest=True)
                if df_scraped is not None and not df_scraped.empty:
                    raw_reviews = df_scraped['reviews'].tolist()
                    
                    # Pre-filter out duplicate reviews BEFORE running spaCy ABSA
                    new_reviews = [r for r in raw_reviews if r and r.strip() not in existing_captions]
                    
                    if not new_reviews:
                        log_msg(f"Notice: Scraped {len(raw_reviews)} cards for '{target}', but ALL {len(raw_reviews)} reviews are already saved in DB. Skipping ABSA.")
                        return 0

                    log_msg(f"Scraped {len(raw_reviews)} review cards for '{target}'. Found {len(new_reviews)} NEW reviews to process with ABSA...")
                    df_processed = process_review_batch(new_reviews, location=target)
                    added_count = save_reviews(target, df_processed)
                    log_msg(f"SUCCESS: Saved {added_count} new non-duplicate reviews to DB for '{target}'.")
                    return added_count
                else:
                    log_msg(f"Notice: No review cards extracted for '{target}'.")
        except Exception as e:
            log_msg(f"Error background scraping '{target}': {str(e)}")
        return 0

    def _run_loop(self):
        log_msg("--- STARTING CONTINUOUS SCRAPING LOOP ---")
        while self.running:
            self.pass_number += 1
            self.last_run_time = datetime.datetime.now().isoformat()
            log_msg(f"=== CONTINUOUS PASS #{self.pass_number} START === Active Locations: {self.targets}")

            with self._lock:
                current_targets = list(self.targets)

            total_added = 0
            for target in current_targets:
                if not self.running:
                    break
                added = self._scrape_single_target(target)
                total_added += added
                time.sleep(1)

            stats = get_db_stats()
            log_msg(f"=== CONTINUOUS PASS #{self.pass_number} COMPLETE === Added {total_added} new reviews. DB Totals: {stats}")
            log_msg("Immediately proceeding to next continuous pass over Active Locations...")
            time.sleep(1)

        log_msg("[BackgroundScraperManager] Worker thread stopped.")


scraper_manager = BackgroundScraperManager()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Continuous Google Maps Active Locations Scraper Daemon")
    parser.add_argument("--locations", type=str, default="Konark,Puri,Daringbadi,Gopalpur,Tampara", help="Comma-separated location names or Google Maps URLs")
    parser.add_argument("--scrolls", type=int, default=8, help="Number of scroll iterations per target")
    
    args = parser.parse_args()
    scraper_manager.scroll_counts = args.scrolls
    
    loc_list = [l.strip() for l in args.locations.split(",") if l.strip()]
    for loc in loc_list:
        scraper_manager.add_target(loc)

    log_msg("Standalone Active Locations scraper running continuously. Press Ctrl+C to exit.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        scraper_manager.stop()
