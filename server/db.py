from pymongo import MongoClient

def init_db(db_uri):
  client = MongoClient(db_uri)
  db = client.dev_database
  return db
