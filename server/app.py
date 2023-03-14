from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routers import gpt_absa, absa_pipeline

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
)

app.include_router(gpt_absa, tags=["absa"])
app.include_router(absa_pipeline, tags=["absa_pipeline"])


demo_url="https://www.google.com/maps/place/S+K+Family+restaurant/@19.3578934,84.8719974,17z/data=!4m8!3m7!1s0x3a3d575facaae5f5:0x5f3c6df83908b341!8m2!3d19.3578884!4d84.8741861!9m1!1b1!16s%2Fg%2F11nddfbs86"


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, debug=True)
