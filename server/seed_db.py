if __name__ == "__main__":
  import os
  import sys

  from dotenv import load_dotenv
  from db import init_db

  load_dotenv()
  db_uri = os.getenv("DB_URI")

  db = init_db(db_uri)

  spreadsheet = {
    "columns": [chr(i+ord('A')) for i in range(10)],
    "rows": [{ "ID": f"Row#{i}"} for i in range(10)],
    "listeners": {}
  }

  if db.spreadsheets.count_documents({}) < 1:
    db.spreadsheets.insert_one(spreadsheet)
