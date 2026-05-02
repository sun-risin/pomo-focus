from typing import List
import json
import os

# 파일 경로 지정
DB_FILE = ".DB/todos.json"

# --- write
def write_db(data: List[dict]):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
        
# --- read
def read_db() -> List[dict]:
    if not os.path.exists(DB_FILE):
        return []
    with open(DB_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []