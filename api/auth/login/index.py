from http.server import BaseHTTPRequestHandler
import os
import jwt
import json
from urllib.parse import parse_qs
from hashlib import sha256

# Constants and configurations
API_SECRET_KEY = 'API_SECRET_KEY'

USERS_DB = {
    "user1": sha256("password123".encode('utf-8')).hexdigest()  # Example hashed password
}

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path.endswith("/login"):
            self.handle_login()
        else:
            self.send_error(404, "Endpoint not found")

    def handle_login(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            credentials = json.loads(post_data)

            username = credentials.get('username')
            password = credentials.get('password')

            stored_password = USERS_DB.get(username)
            if stored_password and sha256(password.encode('utf-8')).hexdigest() == stored_password:
                token = jwt.encode({'username': username}, API_SECRET_KEY, algorithm='HS256')
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'token': token}).encode('utf-8'))
            else:
                self.send_error(401, 'Unauthorized')
        except Exception as e:
            self.send_error(500, 'Internal Server Error: {}'.format(str(e)))

    def do_GET(self):
        if self.path.endswith("/protected"):
            self.handle_protected()
        else:
            self.send_error(404, "Endpoint not found")

    def handle_protected(self):
        try:
            auth_header = self.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
                jwt.decode(token, API_SECRET_KEY, algorithms=['HS256'])
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write('Access to protected resource granted'.encode('utf-8'))
            else:
                self.send_error(401, 'Unauthorized')
        except jwt.ExpiredSignatureError:
            self.send_error(403, 'Token expired')
        except jwt.InvalidTokenError:
            self.send_error(403, 'Invalid token')
        except Exception as e:
            self.send_error(500, 'Internal Server Error: {}'.format(str(e)))

