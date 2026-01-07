Flask backend for Documigo

Endpoints:

- GET /api/health
  - Returns {"status": "ok"}

- GET /api/data
  - Returns a sample message

- POST /api/read-document
  - Accepts multipart/form-data with field `file`.
  - Supported file types: .txt, .md, .pdf, .docx
  - Returns JSON: {"filename": "...", "content": "extracted text..."}

Quick start (Windows PowerShell):

```powershell
cd "D:\Practice codes\documigo\backend"
python -m pip install -r requirements.txt
python app.py
```

Test with curl (PowerShell):

```powershell
curl -X POST -F "file=@C:\path\to\document.pdf" http://127.0.0.1:5000/api/read-document
```

Notes:
- If you prefer a different PDF parser, replace PyPDF2 usage in `app.py`.
- CORS is enabled to allow calls from a React dev server (port 3000).
