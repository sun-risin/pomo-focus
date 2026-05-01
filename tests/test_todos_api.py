import pytest
import os
from fastapi.testclient import TestClient
from app.main import app, DB_FILE

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

    r = client.get("/get-todos")
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

    r = client.get("/get-todos")
    data = r.json()
    assert len(data) == 1
    assert data[0]["title"] == "나중"