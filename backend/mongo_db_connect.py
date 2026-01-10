from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load variables from .env file into the environment
load_dotenv()

uri = os.getenv('MONGO_DB_URI')

client = MongoClient(uri)
db = client.get_database("Documents")

def write_to_db(collection_name, data):
    collection = db.get_collection(collection_name)
    result = collection.insert_one(data)
    return result.inserted_id

def read_from_db(collection_name, query):
    collection = db.get_collection(collection_name)
    try:
        document = collection.find_one(query)
        return document
    except Exception as e:
        raise Exception("Unable to read from the database due to the following error: ", e)
    
def find_document(collection_name, query):
    collection = db.get_collection(collection_name)
    try:
        document = collection.find_one(query)
        return document 
    except Exception as e:
        raise Exception("Unable to find the document due to the following error: ", e)
    
def find_documents(collection_name, query):
    collection = db.get_collection(collection_name)
    try:
        documents = collection.find(query)
        return list(documents)
    except Exception as e:
        raise Exception("Unable to find the documents due to the following error: ", e)

# Close the client connection when done
client.close()