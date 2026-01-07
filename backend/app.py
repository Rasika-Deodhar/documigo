from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import io
import os
import hf


# Optional: libraries for document parsing. Make sure they're installed (see requirements.txt)
try:
    from PyPDF2 import PdfReader
except Exception:
    PdfReader = None

try:
    import docx
except Exception:
    docx = None


app = Flask(__name__)
CORS(app)

# Limit uploads to 16 MB
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024


@app.route('/api/health')
def health():
    return jsonify({"status": "ok"})


def extract_text_from_pdf(data: bytes) -> str:
    if PdfReader is None:
        raise RuntimeError("PyPDF2 (pypdf) is not installed")
    reader = PdfReader(io.BytesIO(data))
    texts = []
    for page in reader.pages:
        try:
            texts.append(page.extract_text() or "")
        except Exception:
            # ignore page-level errors
            continue
    return "\n".join(texts)


def extract_text_from_docx(data: bytes) -> str:
    if docx is None:
        raise RuntimeError("python-docx is not installed")
    document = docx.Document(io.BytesIO(data))
    paragraphs = [p.text for p in document.paragraphs]
    return "\n".join(paragraphs)


@app.route('/api/read-document', methods=['POST'])
def read_document():
    """Accepts a multipart/form-data file upload under the field 'file' and returns extracted text."""
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    _, ext = os.path.splitext(filename.lower())
    data = file.read()

    try:
        if ext in ('.txt', '.md'):
            try:
                text = data.decode('utf-8')
            except UnicodeDecodeError:
                text = data.decode('latin-1', errors='replace')
        elif ext == '.pdf':
            text = extract_text_from_pdf(data)
        elif ext in ('.docx',):
            text = extract_text_from_docx(data)
        else:
            return jsonify({"error": f"Unsupported file type: {ext}. Supported: .txt, .md, .pdf, .docx"}), 415
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": f"Failed to extract text: {str(e)}"}), 500

    summary = hf.generate_response(text, "Provide a concise summary of the document.")

    return jsonify({"filename": filename, "content": text, "summary": summary})


@app.route('/api/data')
def get_data():
    return jsonify({"message": "Hello from the Python backend!"})


if __name__ == '__main__':
    # Run the app on port 5000 (standard for Flask development)
    app.run(debug=True, port=5000)
