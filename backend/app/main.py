from fastapi import FastAPI

app = FastAPI(title="ReadScope API")

@app.get("/")
def read_root():
    return {"message": "ReadScope backend is running"}
