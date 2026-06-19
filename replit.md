# SafeRouteX AI

AI-powered US road accident severity prediction web app using a pre-trained XGBoost model, served with Flask.

## Run & Operate

- `python python-app/app.py` — run the Flask app (port 8000, auto-set by `PORT` env var)
- Workflow "Start application" runs the Flask app automatically

## Stack

- Python 3 + Flask
- XGBoost (pre-trained model: `python-app/xgboost_accident_model.pkl`)
- Bootstrap 5 + Leaflet.js + Font Awesome (via CDN)
- No Node.js frontend — Flask serves Jinja2 HTML templates directly

## Where things live

- `python-app/app.py` — Flask backend, model loading, `/predict` and `/history` endpoints
- `python-app/templates/index.html` — Full one-page UI template (Jinja2)
- `python-app/static/style.css` — Dark blue glassmorphism theme
- `python-app/static/script.js` — Prediction form, animations, Leaflet map, history
- `python-app/xgboost_accident_model.pkl` — Pre-trained XGBoost model (joblib format)

## Architecture decisions

- Flask serves HTML templates (not a SPA) for simplicity; no Node.js needed
- Model runs server-side via joblib; prediction history stored in-memory (last 10)
- Categorical features (State, Timezone, Wind Direction, Weather Condition, Source) mapped with alphabetical LabelEncoder-style dictionaries in `app.py`
- Severity: model was trained on Severity−1 (0–3), so predictions get +1 to return 1–4
- Port comes from `PORT` env var, defaults to 8000

## Model Details

- **Algorithm**: XGBoost Classifier (n_estimators=200, max_depth=6, lr=0.1, subsample=0.8, colsample_bytree=0.8)
- **Accuracy**: 87.88% on 4 severity classes
- **Features**: 24 (see `app.py` FEATURES list)
- **Target**: Severity 1–4 (1=Minor, 4=Fatal)

## Product

- Hero section with animated stats and particles
- Project overview with workflow diagram
- 24-feature prediction form (location, weather, date/time) with default test values
- Result panel with animated risk meter, severity label, and recommendations
- Leaflet.js hotspot map with 15 major US accident hotspots
- Model performance dashboard with animated metric bars
- Feature importance section (6 top features)
- Prediction history table (last 10 predictions)
- Report download (text file)
- Footer: BVC Engineering College, Odalarevu, Andhra Pradesh

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `pip` is not available directly; use the `installLanguagePackages` callback with `language: "python"`
- `verifyAndReplaceArtifactToml` fails if TOML has multiple `[[services]]` with nested `[services.development]` configs; use a single service with the dev run command
- Model predicts 0–3; add 1 to convert back to original 1–4 scale

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
