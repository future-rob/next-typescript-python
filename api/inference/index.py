from http.server import BaseHTTPRequestHandler
import json
import jwt
import os
import requests

JWT_AUTH_SECRET = os.getenv('JWT_AUTH_SECRET')

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            auth_header = self.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                self.send_error(401, 'Unauthorized')
                return

            token = auth_header.split(' ')[1]
            jwt.decode(token, JWT_AUTH_SECRET, algorithms=['HS256'])

            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data)

            modelID = request_data.get('modelID')
            text = request_data.get('text')

            response = self.call_hugging_face_api(modelID, text)

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
        except jwt.ExpiredSignatureError:
            self.send_error(403, 'Token expired')
        except jwt.InvalidTokenError:
            self.send_error(403, 'Invalid token')
        except Exception as e:
            self.send_error(500, 'Internal Server Error: {}'.format(str(e)))

    def call_hugging_face_api(self, modelID, text):
        headers = {
            "Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_TOKEN')}",
            "Content-Type": "application/json"
        }
        data = {"inputs": text}
        response = requests.post(f"https://api-inference.huggingface.co/models/{modelID}", json=data, headers=headers)
        if response.status_code != 200:
            raise Exception("Failed to communicate with the Hugging Face API")
        return response.json()