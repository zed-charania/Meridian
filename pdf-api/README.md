# Meridian PDF API

Python Flask API for generating filled N-400 PDFs. Hosted on Render.

## Endpoints

- `GET /health` - Health check
- `POST /generate` - Generate filled PDF from JSON data
- `GET /fields` - List available PDF fields (debugging)

## Local Development

```bash
cd pdf-api
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python app.py
```

API runs at http://localhost:5000

## Deploy to Render

1. Push to GitHub
2. Create new Web Service on Render
3. Connect to your repo, select `pdf-api` directory
4. Render will auto-detect Python and use the Procfile

## Environment Variables

Set in Render dashboard:
- `PDF_API_SECRET` - (optional) API key for authentication

## API Usage

```bash
curl -X POST http://localhost:5000/generate \
  -H "Content-Type: application/json" \
  -d '{"first_name": "Maria", "last_name": "Rodriguez", ...}' \
  --output filled-n400.pdf
```
