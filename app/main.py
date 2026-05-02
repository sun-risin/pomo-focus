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

# - 특정 Todo 업데이트하기
# 특정 Todo의 시간만 업데이트하고 싶을 때를 위한 간소화된 엔드포인트
@app.put("/todo-update/time/{todo_id}")
def update_todo_time(todo_id: int, totalTime: int):
    todos = read_db()
    for todo in todos:
        if todo["id"] == todo_id:
            todo["totalTime"] = totalTime
            break
    write_db(todos)
    return {"message": "Time updated"}

# 특정 Todo의 완료 여부 업데이트
@app.put("/todo-update/completed/{todo_id}")
def update_todo_completed(todo_id: int, completed: bool):
    todos = read_db()
    for todo in todos:
        if todo["id"] == todo_id:
            todo["completed"] = completed
            break
    write_db(todos)
    return {"message": "Completed updated"}

# - JSON 파일 데이터에서 읽기        
@app.get("/todos", response_model=List[Todo])
def get_todos():
    return read_db()

# 로컬 서버 실행: uvicorn app.main:app --reload