import os
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from controllers import absa_pipeline_controller, absa_pipeline_stream_controller
from background_scraper import scraper_manager

router = APIRouter()


@router.get('/scrapper_pipeline')
def absa_pipeline(location: str):
    if location and location.strip():
        scraper_manager.add_target(location)
    return absa_pipeline_controller(location)


@router.get('/stream_scrapper_pipeline')
def stream_absa_pipeline(location: str):
    if location and location.strip():
        scraper_manager.add_target(location)
    return StreamingResponse(
        absa_pipeline_stream_controller(location),
        media_type="text/event-stream"
    )


@router.get('/active_locations')
def get_active_locations():
    return scraper_manager.get_status()


@router.post('/add_active_location')
def add_active_location(location: str):
    success = scraper_manager.add_target(location)
    return {"success": success, "status": scraper_manager.get_status()}


@router.post('/remove_active_location')
def remove_active_location(location: str):
    success = scraper_manager.remove_target(location)
    return {"success": success, "status": scraper_manager.get_status()}


@router.post('/start_background_scraper')
def start_background_scraper(locations: str = "Konark Sun Temple,Puri Jagannath Temple,Daringbadi Nature Park,Gopalpur Sea Beach,Tampara Lake"):
    loc_list = [l.strip() for l in locations.split(",") if l.strip()]
    for loc in loc_list:
        scraper_manager.add_target(loc)
    return {"status": "started", "active_locations": scraper_manager.targets}


@router.post('/stop_background_scraper')
def stop_background_scraper():
    scraper_manager.stop()
    return {"status": "stopping"}


@router.get('/background_scraper_status')
def get_background_scraper_status():
    return scraper_manager.get_status()


@router.get('/background_scraper_logs')
def get_background_scraper_logs(lines: int = 50):
    log_file = os.path.join(os.path.dirname(__file__), "..", "background_scraper.log")
    if os.path.exists(log_file):
        try:
            with open(log_file, "r", encoding="utf-8") as f:
                content = f.readlines()
                return {"logs": content[-lines:]}
        except Exception as e:
            return {"error": str(e)}
    return {"logs": ["Log file not initialized yet."]}