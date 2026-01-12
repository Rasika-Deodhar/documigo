from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello, Vercel - In backend!"

@app.route("/api")
def api():
    return "Hello, API!"

if __name__ == "__main__":
    app.run()