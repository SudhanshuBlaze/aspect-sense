import time
import os
import re
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from urllib.parse import quote_plus


class ReviewsScraper:
    """
    Robust Google Maps review scraper using Selenium WebDriver in headless mode.
    Handles search URLs, direct place URLs, consent popups, lazy loading, and card-by-card extraction.
    """

    def __init__(self, url: str):
        if not url.startswith("http://") and not url.startswith("https://"):
            clean_term = url.strip()
            self.url = f"https://www.google.com/maps/search/{quote_plus(clean_term)}"
        else:
            self.url = url

        options = webdriver.ChromeOptions()
        options.add_argument('--headless=new')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-blink-features=AutomationControlled')
        options.add_argument('--disable-gpu')
        options.add_argument('--window-size=1920,1080')
        options.add_argument(
            '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        )

        self.browser = webdriver.Chrome(options=options)

        # Bypass webdriver bot-detection
        self.browser.execute_cdp_cmd(
            'Page.addScriptToEvaluateOnNewDocument',
            {'source': 'Object.defineProperty(navigator, "webdriver", {get: () => undefined})'}
        )

        # Pre-set Google consent cookie
        try:
            self.browser.get("https://www.google.com/maps")
            time.sleep(1)
            self.browser.add_cookie({
                'name': 'SOCS',
                'value': 'CAESEwgDEgk2MTQyNjYzNzUaAmVuIAEaBgiA_L2yBg',
                'domain': '.google.com'
            })
        except Exception:
            pass

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.quit()

    def quit(self):
        if hasattr(self, 'browser') and self.browser:
            try:
                self.browser.quit()
            except Exception:
                pass

    def _handle_cookie_consent(self):
        """Clicks cookie consent popup buttons if present."""
        try:
            consent_btns = self.browser.find_elements(
                By.XPATH,
                '//form//button | //button[contains(., "Accept all") or contains(., "Reject all") or contains(., "Agree") or contains(., "Alle akzeptieren")]'
            )
            if consent_btns:
                self.browser.execute_script("arguments[0].click();", consent_btns[0])
                time.sleep(1.5)
        except Exception:
            pass

    def _open_reviews_tab(self):
        """Navigates to place details and opens the Reviews tab."""
        self._handle_cookie_consent()

        def format_reviews_url(raw_url: str) -> str:
            if "!9m1!1b1" in raw_url:
                return raw_url
            if "?" in raw_url:
                base, q = raw_url.split("?", 1)
                return f"{base}!9m1!1b1?{q}" if "/data=" in base else f"{base}/data=!9m1!1b1?{q}"
            return f"{raw_url}!9m1!1b1" if "/data=" in raw_url else f"{raw_url}/data=!9m1!1b1"

        # 1. If on a search page with list results, wait for place links and click/navigate to top result
        start_wait = time.time()
        while time.time() - start_wait < 6:
            current = self.browser.current_url
            if "/place/" in current:
                break
            
            try:
                place_links = self.browser.find_elements(
                    By.XPATH,
                    '//a[contains(@href, "/place/")] | //div[contains(@class, "Nv2PK")]//a | //div[@role="article"]//a | //a[contains(@class, "hfE2Z")]'
                )
                if place_links:
                    place_url = place_links[0].get_attribute("href")
                    if place_url and "/place/" in place_url:
                        target_url = format_reviews_url(place_url)
                        print(f"[Scraper] Extracted direct place URL from search results: {target_url}")
                        self.browser.get(target_url)
                        time.sleep(3)
                        self._handle_cookie_consent()
                        break
                    else:
                        # Try clicking the place card directly
                        self.browser.execute_script("arguments[0].click();", place_links[0])
                        time.sleep(3)
                        break
            except Exception as e:
                print(f"[Scraper] Search navigation notice: {e}")
            time.sleep(1)

        # 2. Direct place URL handling
        current = self.browser.current_url
        if "/place/" in current and "!9m1!1b1" not in current:
            reviews_url = format_reviews_url(current)
            print(f"[Scraper] Direct redirect to place page detected. Navigating to reviews feed: {reviews_url}")
            self.browser.get(reviews_url)
            time.sleep(3)
            self._handle_cookie_consent()

        # 3. Explicitly click Reviews tab if present and not on reviews view
        if "!9m1!1b1" not in self.browser.current_url:
            try:
                review_tabs = self.browser.find_elements(
                    By.XPATH,
                    '//button[contains(@aria-label, "Reviews") or contains(@aria-label, "Rezensionen") or contains(@data-tab-index, "1") or contains(., "Reviews")] | //div[contains(@class, "Gv6qbx")]//button'
                )
                for tab in review_tabs:
                    if tab.is_displayed():
                        print("[Scraper] Clicking Reviews tab button...")
                        self.browser.execute_script("arguments[0].click();", tab)
                        time.sleep(3)
                        break
            except Exception:
                pass

    def _sort_by_newest(self):
        """Attempts to click Sort button and switch to 'Newest' reviews."""
        try:
            sort_btns = self.browser.find_elements(
                By.XPATH,
                '//button[contains(@aria-label, "Sort reviews") or contains(@aria-label, "Sortieren") or contains(@data-value, "Sort") or contains(., "Sort")] | //button[contains(@class, "g2jHe")]'
            )
            if sort_btns:
                print("[Scraper] Opening Sort options menu...")
                self.browser.execute_script("arguments[0].click();", sort_btns[0])
                time.sleep(1.5)

                newest_option = self.browser.find_elements(
                    By.XPATH,
                    '//div[@role="menuitemradio" and (contains(., "Newest") or contains(., "Neueste"))] | //button[contains(., "Newest")]'
                )
                if newest_option:
                    print("[Scraper] Selected 'Newest' sort order.")
                    self.browser.execute_script("arguments[0].click();", newest_option[0])
                    time.sleep(2.5)
        except Exception as e:
            print(f"[Scraper] Notice sorting by newest: {e}")

    def _expand_more_buttons(self):
        """Clicks all 'More' buttons in loaded review cards to expand truncated text."""
        try:
            more_buttons = self.browser.find_elements(
                By.XPATH,
                '//button[contains(@class, "w8tfae") or contains(@aria-label, "More") or contains(@aria-label, "Mehr") or text()="More"]'
            )
            for btn in more_buttons[:30]:
                try:
                    if btn.is_displayed():
                        self.browser.execute_script("arguments[0].click();", btn)
                except Exception:
                    pass
        except Exception:
            pass

    def _get_scroll_container(self):
        """Dynamically identifies the exact scrollable container holding review cards."""
        # Method A: Find parent container of active review cards
        cards = self.browser.find_elements(By.XPATH, '//div[@data-review-id] | //div[contains(@class, "jfti7e")]')
        if cards:
            for card in cards[:3]:
                try:
                    ancestor = card.find_element(
                        By.XPATH,
                        './ancestor::div[contains(@class, "m6QErb") and (contains(@class, "Dshb1e") or contains(@class, "XiKGzc"))] | ./ancestor::div[contains(@class, "dS8AEf")] | ./ancestor::div[@role="main"]'
                    )
                    if ancestor:
                        return ancestor
                except Exception:
                    pass

        # Method B: Fallback selectors
        selectors = [
            '//div[contains(@class, "dS8AEf")]',
            '//div[contains(@class, "m6QErb") and contains(@class, "Dshb1e")]',
            '//div[@role="main"]'
        ]
        for sel in selectors:
            divs = self.browser.find_elements(By.XPATH, sel)
            if divs:
                return divs[0]

        return None

    def scroll(self, scroll_counts: int = 5, sort_newest: bool = False):
        """Scrolls the reviews pane smoothly to load additional reviews."""
        if sort_newest:
            self._sort_by_newest()

        scrollable_div = self._get_scroll_container()
        print(f"[Scraper] Scrolling reviews pane up to {scroll_counts} times...")

        previous_cards_count = 0
        stagnant_count = 0

        for i in range(scroll_counts):
            # Re-verify container in case DOM mutated
            if not scrollable_div:
                scrollable_div = self._get_scroll_container()

            if scrollable_div:
                self.browser.execute_script('''
                    var el = arguments[0];
                    el.scrollBy({ top: 900, behavior: 'smooth' });
                    el.scrollTop = el.scrollHeight;
                    el.dispatchEvent(new Event('scroll'));
                ''', scrollable_div)
            else:
                self.browser.execute_script('window.scrollBy(0, 900); window.scrollTo(0, document.body.scrollHeight);')

            time.sleep(1.5)

            # Check if review cards are growing
            current_cards = len(self.browser.find_elements(By.XPATH, '//div[@data-review-id] | //div[contains(@class, "jfti7e")]'))
            if current_cards > 0 and current_cards == previous_cards_count:
                stagnant_count += 1
                if stagnant_count >= 3:
                    print(f"[Scraper] Review list stagnant at {current_cards} cards after {i+1} scrolls. Ending scroll early.")
                    break
            else:
                stagnant_count = 0
                previous_cards_count = current_cards

        # Expand "More" buttons ONCE after scrolling is complete
        self._expand_more_buttons()

    def scrape_reviews(self, scroll_counts: int = 5, sort_newest: bool = False) -> pd.DataFrame:
        """
        Scrapes review cards, matching text and ratings card-by-card to guarantee alignment.
        """
        print(f"[Scraper] Navigating to {self.url} ...")
        self.browser.get(self.url)
        time.sleep(2.5)

        self._open_reviews_tab()

        if scroll_counts > 0:
            self.scroll(scroll_counts, sort_newest=sort_newest)

        print("[Scraper] Extracting review cards...")
        card_selectors = [
            '//div[@data-review-id]',
            '//div[contains(@class, "jfti7e")]',
            '//div[contains(@class, "gWSYe")]'
        ]
        
        cards = []
        for sel in card_selectors:
            cards = self.browser.find_elements(By.XPATH, sel)
            if cards:
                break

        reviews_arr, ratings_arr = [], []

        if cards:
            for card in cards:
                text = ""
                text_elems = card.find_elements(By.XPATH, './/span[contains(@class, "wiI7pd")] | .//div[contains(@class, "My5W2b")]')
                if text_elems:
                    text = text_elems[0].text.strip()
                elif card.text:
                    lines = [line.strip() for line in card.text.split('\n') if len(line.strip()) > 15]
                    if lines:
                        text = lines[0]

                if not text or len(text) < 10 or text in reviews_arr:
                    continue

                rating = 5.0
                rating_elems = card.find_elements(By.XPATH, './/span[contains(@class, "kvMYJc")] | .//span[contains(@aria-label, "star")]')
                if rating_elems:
                    aria = rating_elems[0].get_attribute('aria-label') or ""
                    match = re.search(r'(\d+(\.\d+)?)', aria)
                    if match:
                        try:
                            rating = float(match.group(1))
                        except ValueError:
                            pass

                reviews_arr.append(text)
                ratings_arr.append(rating)

        # Fallback if card wrappers change
        if not reviews_arr:
            raw_spans = self.browser.find_elements(By.XPATH, '//span[contains(@class, "wiI7pd")]')
            for span in raw_spans:
                txt = span.text.strip()
                if txt and len(txt) >= 10 and txt not in reviews_arr:
                    reviews_arr.append(txt)
                    ratings_arr.append(5.0)

        df = pd.DataFrame({'reviews': reviews_arr, 'rating': ratings_arr})
        print(f"[Scraper] Successfully extracted {len(df)} reviews.")
        return df

    def scrape_reviews_stream(self, scroll_counts: int = 5, sort_newest: bool = False):
        """Yields review dataframes progressively while scrolling."""
        print(f"[Scraper] Stream navigating to {self.url} ...")
        self.browser.get(self.url)
        time.sleep(2.5)

        self._open_reviews_tab()
        if sort_newest:
            self._sort_by_newest()

        seen_reviews = set()
        for i in range(max(1, scroll_counts)):
            self.scroll(1)
            df = self._extract_current_cards(seen_reviews)
            if not df.empty:
                yield df

    def _extract_current_cards(self, seen_reviews: set) -> pd.DataFrame:
        cards = self.browser.find_elements(By.XPATH, '//div[@data-review-id] | //div[contains(@class, "jfti7e")]')
        reviews_arr, ratings_arr = [], []

        for card in cards:
            text = ""
            text_elems = card.find_elements(By.XPATH, './/span[contains(@class, "wiI7pd")] | .//div[contains(@class, "My5W2b")]')
            if text_elems:
                text = text_elems[0].text.strip()

            if text and len(text) >= 10 and text not in seen_reviews:
                seen_reviews.add(text)
                reviews_arr.append(text)
                ratings_arr.append(5.0)

        return pd.DataFrame({'reviews': reviews_arr, 'rating': ratings_arr})
