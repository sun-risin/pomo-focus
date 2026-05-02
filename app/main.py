from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
from app.db import write_db, read_db

app = FastAPI()

# --- 정적 HTML 서빙
app.mount("/static", StaticFiles(directory="static"), name="static")

# 메인 페이지 (/) 처리 : “/”로 접속 시 처리할 작업
@app.get("/", response_class=HTMLResponse)
def home():
    with open("static/index.html", encoding="utf-8") as f:
        return f.read()
    
# --- JSON 파일 관련 (DB 대신 파일 저장)
# 데이터 모델 정의 - 프론트와 맞춰둠
class Todo(BaseModel):
    id: int
    title: str
    completed: bool
    totalTime: int  # 초 단위
    
# - JSON 파일에 데이터 쓰기
@app.post("/todos/save")
def save_todos(todos: List[Todo]):
    write_db([todo.model_dump() for todo in todos])
    return {"message": "Saved successfully"}

# 로컬 서버 실행: uvicorn app.main:app --reload