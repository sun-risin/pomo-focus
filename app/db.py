from typing import List
import json
import os
from app.config import DB_FILE # config에서 가져옴

# --- write
def write_db(data: List[dict]):    
    # 만약 폴더가 없으면 생성
    dir_path = os.path.dirname(DB_FILE)
    if dir_path:
        os.makedirs(dir_path, exist_ok=True)
    
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