from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import io
import os
from backend import hf, mongo_db_connect

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

@app.route('/')
def home():
    return "Hello, World!"


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
            print("Warning: failed to extract text from a PDF page, skipping.", Exception)
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

    return jsonify({"filename": filename, "content": text})

@app.route('/api/generate-summary', methods=['POST'])
def generate_summary():
    if not request.json:
        return jsonify({"error": "Invalid input, JSON expected"}), 400
    data = request.json
    text = data.get('text', '')
    try:
        if not text:
            return jsonify({"error": "No text provided"}), 400
        summary = hf.generate_response(text, "Provide a concise summary of the document.")
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        return jsonify({"error": f"Failed to generate summary: {str(e)}"}), 500
    return jsonify({"summary": summary})

@app.route('/api/data')
def get_data():
    return jsonify({"message": "Hello from the Python backend!"})


@app.route('/api/store-text', methods=['POST'])
def store_text():
    data = request.json
    # Implement your logic to store the text data here
    id = mongo_db_connect.write_to_db("document_text", data)
    return jsonify({"status": "success", "data": data, "id": str(id)})

@app.route('/api/store-text-summary', methods=['POST'])
def store_text_summary():
    data = request.json
    # Implement your logic to store the text data here
    id = mongo_db_connect.write_to_db("document_summary", data)
    return jsonify({"status": "success", "data": data, "id": str(id)})

if __name__ == '__main__':
    # app.run()
    app.run(port=5000)