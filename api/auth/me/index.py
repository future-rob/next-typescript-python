from http.server import BaseHTTPRequestHandler
import os
import jwt

# Secret key used to sign and verify the JWT
JWT_SECRET_KEY = "API_SECRET_KEY"
JWT_ALGORITHM = "HS256"

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Extract the Authorization header
        auth_header = self.headers.get('Authorization')

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]  # Extract the JWT part

            try:
                # Verify the token and decode the payload
                decoded_payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
                username = decoded_payload.get("username", "unknown")

                # Successfully authenticated
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(f'{{"username": "{username}"}}'.encode('utf-8'))
            except jwt.ExpiredSignatureError:
                self.send_response(401)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write('Unauthorized: Token has expired.'.encode('utf-8'))
            except jwt.InvalidTokenError:
                self.send_response(401)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write('Unauthorized: Invalid token.'.encode('utf-8'))
        else:
            # If not authorized, return a 401 Unauthorized status
            self.send_response(401)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write('Unauthorized: No token provided.'.encode('utf-8'))
        return
