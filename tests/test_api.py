import pytest
import os
from fastapi.testclient import TestClient
from app.main import app
from app.config import DB_FILE

client = TestClient(app)

# --- 픽스처: 각 테스트 전후로 DB 파일 초기화
@pytest.fixture(autouse=True)
def clean_db():
    # 테스트 전: 혹시 남아있는 파일 제거
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)
    yield
    # 테스트 후: 정리
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)

# --- POST /todos/save
def test_save_todos_creates_file():
    todos = [{
        "id": 1, 
        "title": "운동", 
        "completed": False, 
        "totalTime": 0
    }]
    
    r = client.post("/todos/save", json=todos)
    assert r.status_code == 200
    assert r.json()["message"] == "Saved successfully"
    assert os.path.exists(DB_FILE)

def test_save_todos_multiple():
    todos = [
        {"id": 1, "title": "독서", "completed": False, "totalTime": 0},
        {"id": 2, "title": "코딩", "completed": True, "totalTime": 120},
    ]
    client.post("/todos/save", json=todos)

    r = client.get("/todos")
    assert len(r.json()) == 2

def test_save_todos_overwrites():
    # 처음 저장
    client.post("/todos/save", json=[
        {"id": 1, "title": "처음", "completed": False, "totalTime": 0}
    ])
    # 덮어쓰기
    client.post("/todos/save", json=[
        {"id": 2, "title": "나중", "completed": False, "totalTime": 0}
    ])

    r = client.get("/todos")
    data = r.json()
    assert len(data) == 1
    assert data[0]["title"] == "나중"
    
# --- GET /todos
def test_get_todos_empty():
    r = client.get("/todos")
    assert r.status_code == 200
    assert r.json() == []

def test_get_todos_returns_saved_data():
    # 먼저 저장
    todos = [{"id": 1, "title": "공부", "completed": False, "totalTime": 0}]
    client.post("/todos/save", json=todos)

    r = client.get("/todos")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 1
    assert data[0]["title"] == "공부"
    
# --- PUT /todo-update/time/{todo_id}
def test_update_time_success():
    client.post("/todos/save", json=[
        {"id": 1, "title": "공부", "completed": False, "totalTime": 0}
    ])

    r = client.put("/todo-update/time/1?totalTime=300")
    assert r.status_code == 200
    assert r.json()["message"] == "Time updated"

    updated = client.get("/todos").json()
    assert updated[0]["totalTime"] == 300

def test_update_time_no_matching_id():
    # 존재하지 않는 id — 파일은 그대로, 에러 없이 통과
    client.post("/todos/save", json=[
        {"id": 1, "title": "공부", "completed": False, "totalTime": 0}
    ])

    r = client.put("/todo-update/time/999?totalTime=300")
    assert r.status_code == 200

    data = client.get("/todos").json()
    assert data[0]["totalTime"] == 0  # 변경 없음
    
# --- PUT /todo-update/completed/{todo_id}
def test_update_completed_success():
    client.post("/todos/save", json=[
        {"id": 1, "title": "공부", "completed": False, "totalTime": 0}
    ])

    r = client.put("/todo-update/completed/1?completed=true")
    assert r.status_code == 200
    assert r.json()["message"] == "Completed updated"

    data = client.get("/todos").json()
    assert data[0]["completed"] == True

def test_update_completed_toggle_back():
    client.post("/todos/save", json=[
        {"id": 1, "title": "공부", "completed": True, "totalTime": 0}
    ])

    client.put("/todo-update/completed/1?completed=false")
    data = client.get("/todos").json()
    assert data[0]["completed"] == False

def test_update_completed_no_matching_id():
    client.post("/todos/save", json=[
        {"id": 1, "title": "공부", "completed": False, "totalTime": 0}
    ])

    r = client.put("/todo-update/completed/999?completed=true")
    assert r.status_code == 200

    data = client.get("/todos").json()
    assert data[0]["completed"] == False  # 변경 없음