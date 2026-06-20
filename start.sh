#!/bin/bash
set -e
cd /home/runner/workspace/python-app
exec gunicorn --bind "0.0.0.0:${PORT:-5000}" --workers 2 --timeout 120 app:app
