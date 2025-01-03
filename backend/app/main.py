from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()


@app.get("/hello")
def read_root():
    return {"message": "Hello World"}


handler = Mangum(app)
