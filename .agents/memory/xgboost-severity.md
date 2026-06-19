---
name: XGBoost severity label shift for SafeRouteX AI
description: The model was trained on Severity-1 (0-3), so predictions must have +1 applied
---

The US Accidents dataset has Severity labels 1–4. Before training, the notebook applies:
```python
df['Severity'] = df['Severity'] - 1
```
This shifts to 0–3 (required by XGBoost for multi-class classification starting at 0).

**Why:** XGBoost expects classes starting at 0 for multi-class problems.

**How to apply:** After `model.predict(X)`, add 1 to each prediction to restore the original 1–4 severity scale. Without this, all severity outputs are off by one.

```python
raw_pred = model.predict(input_df)[0]
severity = int(raw_pred) + 1  # convert 0-3 back to 1-4
```
