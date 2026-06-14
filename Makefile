ifeq ($(OS),Windows_NT)
    PYTHON := venv\Scripts\python.exe
    DIST_TARGET := dist:win
else
    UNAME_S := $(shell uname -s)

    ifeq ($(UNAME_S),Linux)
        DIST_TARGET := dist:linux
    endif

    ifeq ($(UNAME_S),Darwin)
        DIST_TARGET := dist:mac
    endif

    PYTHON := venv/bin/python
endif

.PHONY: venv backend frontend run build clean

venv:
ifeq ($(OS),Windows_NT)
	@if not exist venv ( \
		echo Creating virtual environment... && \
		python -m venv venv \
	)
else
	@if [ ! -d "venv" ]; then \
		echo "Creating virtual environment..."; \
		python3 -m venv venv; \
	fi
endif
	$(PYTHON) -m pip install -r requirements.txt

backend: venv
	$(PYTHON) -m uvicorn core:app --reload

frontend:
	cd app && npm run dev

run: venv
ifeq ($(OS),Windows_NT)
	start /B cmd /C "$(PYTHON) -m uvicorn core:app --reload"
	cd app && npm run dev
else
	$(PYTHON) -m uvicorn core:app --reload &
	cd app && npm run dev
endif

build: venv
	cd app && npm run $(DIST_TARGET)

clean:
ifeq ($(OS),Windows_NT)
	@if exist app\dist rmdir /S /Q app\dist
	@if exist app\dist-electron rmdir /S /Q app\dist-electron
	@if exist app\dist-react rmdir /S /Q app\dist-react
else
	rm -rf app/dist
	rm -rf app/dist-electron
	rm -rf app/dist-react
endif

clean-all: clean
ifeq ($(OS),Windows_NT)
	@if exist venv rmdir /S /Q venv
else
	rm -rf venv
endif