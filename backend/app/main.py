from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
import uvicorn
from .color_extraction import extract_palette

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

requests_total = Counter("requests_total", "Total analysis requests")
processing_time = Histogram("processing_time_seconds", "Processing time")

@app.post("/analyze")
async def analyze(image: UploadFile = File(...), consent: bool = True):
    requests_total.inc()
    with processing_time.time():
        data = await image.read()
        swatches = extract_palette(data)
        return {"swatches": swatches, "consent": consent}

@app.get("/metrics")
def metrics():
    return generate_latest()

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
