import os

# 환경 변수 'ENV'가 'test'면 CI용 테스트 파일, 아니면 실제 파일을 사용
ENV = os.getenv("ENV", "run")

if ENV == "test":
    DB_FILE = ".DB/test_todos.json"
else:
    DB_FILE = ".DB/todos.json"