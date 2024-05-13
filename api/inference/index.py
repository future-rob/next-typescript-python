from http.server import BaseHTTPRequestHandler
import json
import os
import requests
from supabase import create_client, Client

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        print(f"Received POST request: {self.path}")
        print(f"Headers: {self.headers}")
        print(f"supabase: {SUPABASE_URL}, {SUPABASE_KEY}")
        try:
            auth_header = self.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                self.send_error(401, 'Unauthorized')
                return
            print(f"Authorization header: {auth_header}")
            token = auth_header.split(' ')[1]
            user = self.verify_supabase_token(token)
            if not user:
                self.send_error(403, 'Invalid token')
                return

            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data)

            modelID = request_data.get('modelID')
            prompt = request_data.get('prompt')

            response = self.call_hugging_face_api(modelID, prompt)

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
        except Exception as e:
            self.send_error(500, f'Internal Server Error: {str(e)}')

    def verify_supabase_token(self, token):
        try:
            response = supabase.auth.get_user(token)
            return response.user
        except Exception as e:
            print(f"Token verification failed: {str(e)}")
            return None

    def call_hugging_face_api(self, modelID, prompt):
        headers = {
            "Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_TOKEN')}",
            "Content-Type": "application/json"
        }
        data = {"inputs": prompt}
        print(f"Calling Hugging Face API with modelID: {modelID}, prompt: {prompt}")
        response = requests.post(f"https://api-inference.huggingface.co/models/{modelID}", json=data, headers=headers)
        
        if response.status_code != 200:
            print(f"Failed to communicate with the Hugging Face API: {response.text}")
            raise Exception("Failed to communicate with the Hugging Face API")
        return response.json()