# Description

Build with React simple interactive spreadsheet. Allows to store numbers and cell references using `=A1` syntax.
Support addition and multiplication and can easily support more. Updating a cell automatically updates every
dependant cell recursively. Data is stored in MongoDB hosted on MongoDB Atlas. Backend is running Flask
with Gunicorn hosted on Heroku. Frontend is also hosted on Heroku using Nginx.

# Setup

## Backend

1. Create `.env` file inside `server` folder with `DB_URI` pointing to MongoDB instance
2. Run `make setup_server_dev`
3. Run `make run_server_dev` to start a local server

## Frontend

1. Run `make setup_client_dev`
2. Run `make run_client_dev`
