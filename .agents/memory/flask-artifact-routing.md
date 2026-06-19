---
name: Flask artifact routing in pnpm monorepo
description: How to expose a Python Flask app via the Replit proxy and artifact.toml
---

When adding a Python Flask service to the workspace:

1. Run Flask via a workflow (configureWorkflow with `python python-app/app.py`, port 8000)
2. Update the artifact's artifact.toml using verifyAndReplaceArtifactToml
3. The TOML must use a **single** `[[services]]` block with nested `[services.development]`, `[services.production]`, etc.

**Why:** The schema validator rejects TOML files with multiple `[[services]]` array entries. Each artifact only supports one service definition with its associated dev/prod configs.

**How to apply:** Write artifact.edit.toml as a sibling file, then call verifyAndReplaceArtifactToml with absolute paths. A minimal working example:

```toml
kind = "api"
previewPath = "/"
title = "My Flask App"
version = "1.0.0"
id = "<artifact-id>"

[[services]]
localPort = 8000
name = "My Flask App"
paths = ["/"]

[services.development]
run = "python python-app/app.py"

[services.production]

[services.production.build]
args = ["echo", "no-build"]

[services.production.run]
args = ["python", "python-app/app.py"]

[services.production.run.env]
PORT = "8000"
NODE_ENV = "production"

[services.production.health.startup]
path = "/"
```
