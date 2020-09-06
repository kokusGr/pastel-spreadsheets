setup_server_dev:
	cd server; \
	virtualenv interview_venv; \
	source interview_venv/bin/activate; \
	pip install -r requirements.txt;

run_server_dev:
	source server/interview_venv/bin/activate; \
	FLASK_DEBUG=1 FLASK_APP=server/server.py flask run;

setup_client_dev:
	cd client; \
	yarn install;

run_client_dev:
	cd client; \
	yarn start;