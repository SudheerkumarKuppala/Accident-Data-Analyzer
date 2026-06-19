#!/bin/bash
set -e
cd python-app
exec gunicorn --bind "0.0.0.0:${PORT:-8000}" --workers 2 --timeout 120 app:app
