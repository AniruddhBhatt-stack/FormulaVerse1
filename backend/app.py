from flask import Flask, redirect, request, jsonify, url_for
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
import os
import jwt
import datetime
from functools import wraps
from flask_cors import CORS

# Load env
load_dotenv()
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
JWT_SECRET = os.getenv("JWT_SECRET", "dev_jwt_secret")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET", "dev_secret")
CORS(app, supports_credentials=True)  # enable if needed for OPTIONS

oauth = OAuth(app)
oauth.register(
    name='google',
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    access_token_url='https://oauth2.googleapis.com/token',
    access_token_params=None,
    authorize_url='https://accounts.google.com/o/oauth2/v2/auth',
    authorize_params=None,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    api_base_url='https://www.googleapis.com/oauth2/v2/',
    userinfo_endpoint='https://www.googleapis.com/oauth2/v2/userinfo',
    client_kwargs={'scope': 'openid email profile'},
)

def create_jwt(payload, expires_minutes=60):
    payload_copy = payload.copy()
    payload_copy['exp'] = datetime.datetime.utcnow() + datetime.timedelta(minutes=expires_minutes)
    token = jwt.encode(payload_copy, JWT_SECRET, algorithm='HS256')
    # PyJWT returns string in modern versions
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return token

def verify_jwt(token):
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return data
    except Exception as e:
        return None

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization', None)
        if not auth:
            return jsonify({'error': 'Missing authorization header'}), 401
        parts = auth.split()
        if parts[0].lower() != 'bearer' or len(parts) != 2:
            return jsonify({'error': 'Invalid authorization header'}), 401
        token = parts[1]
        user = verify_jwt(token)
        if not user:
            return jsonify({'error': 'Invalid or expired token'}), 401
        # attach user info to request context
        request.user = user
        return f(*args, **kwargs)
    return decorated

@app.route('/auth/login')
def auth_login():
    redirect_uri = url_for('auth_callback', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

@app.route('/auth/callback')
def auth_callback():
    token = oauth.google.authorize_access_token()
    if not token:
        return "Authorization failed", 400
    
    # fetch user info
    userinfo = oauth.google.get('userinfo').json()
    
    # create local JWT with necessary info
    user_payload = {
        'sub': userinfo.get('id'),
        'email': userinfo.get('email'),
        'name': userinfo.get('name'),
        'picture': userinfo.get('picture')  # <-- add profile picture here
    }
    jwt_token = create_jwt(user_payload, expires_minutes=60*24)  # 24 hours
    
    # Redirect to frontend with token
    redirect_url = f"{FRONTEND_URL}/auth/success?token={jwt_token}"
    return redirect(redirect_url)


  # this now includes name, email, picture


@app.route('/api/chat', methods=['POST'])
@login_required
def api_chat():
    data = request.get_json() or {}
    query = (data.get('query') or "").strip()

    # Hardcoded responses based on input (expand as you like)
    responses = {
    "what is 2+2?": "Riya had 2 pencils. Her friend gave her 2 more. Now Riya has 4 pencils in total.",
    "what is 3+5?": "A shopkeeper sold 3 apples in the morning and 5 apples in the evening. He sold 8 apples in total that day.",
    "solve 2x+5=15": "Imagine you bought 2 identical notebooks and also paid ₹5 extra. The total bill was ₹15. Each notebook costs ₹5.",
    "example": "Arjun has 3 chocolates. He buys 2 more. Now he has 5 chocolates in total.",
    "what is 12-7?": "A basket had 12 mangoes. Meera ate 7 of them. Now only 5 mangoes are left in the basket.",
    "what is 6*7?": "A classroom has 6 rows of benches, and each row has 7 benches. Altogether, there are 42 benches.",
    "what is 20/4?": "A pizza is cut into 20 slices. If 4 friends share it equally, each friend gets 5 slices.",
    "square of 9": "A garden is 9 meters long and 9 meters wide. Its area is 81 square meters.",
    "cube of 3": "A box is 3 meters long, 3 meters wide, and 3 meters tall. Its volume is 27 cubic meters.",
    "solve x+4=10": "Rohan had some balloons. After getting 4 more, he had 10 in total. That means he originally had 6 balloons."
}



    lower_q = query.lower()
    if lower_q in responses:
        reply = responses[lower_q]
    elif "solve" in lower_q and "+" in lower_q:
        # very small naive parser example
        reply = "This looks like an addition problem. (Stubbed response.)"
    elif query == "":
        reply = "Please type a question or a math expression."
    else:
        reply = "Sorry — I don't have a custom reply for that yet. (Hardcoded stub.)"

    return jsonify({
        "query": query,
        "reply": reply,
        "user": getattr(request, "user", None)
    })

@app.route('/api/me')
@login_required
def api_me():
    return jsonify({
        "name": request.user.get("name"),
        "email": request.user.get("email"),
        "picture": request.user.get("picture")
    })


@app.route('/logout')
def logout():
    # For this simple flow we just redirect to frontend and let client clear token.
    return redirect(FRONTEND_URL + "/")

if __name__ == "__main__":
    # Use 5000 by default
    app.run(host="0.0.0.0", port=5000, debug=True)
