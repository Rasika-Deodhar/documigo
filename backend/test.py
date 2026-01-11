from flask import Flask

test = Flask(__name__)

@test.route("/")
def home():
    return "Hello, Vercel!"

@test.route("/api")
def api():
    return "Hello, API!"

if __name__ == "__main__":
    test.run()