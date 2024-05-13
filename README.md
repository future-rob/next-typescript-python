# Next Vercel Application with TypeScript and Python

## Overview

This project is a full-stack application utilizing TypeScript for the frontend and Python for the backend. The frontend is built with Next.js and React, and the backend uses FastAPI to handle API requests. The project demonstrates user authentication using JSON Web Tokens (JWT) and performs AI inference using the Hugging Face API.

## Project Structure

- **Frontend**: Located in the root directory, built with Next.js and React.
- **Backend**: Located in the `api` directory, built with FastAPI.

## Prerequisites

- Node.js (v14.0.0 or later)
- Python (v3.12 or later)
- Vercel CLI (for backend development)

## Setup

1. **Clone the repository**:
   ```sh
   git clone <repository-url>
   cd with-typescript
   ```

2. **Install frontend dependencies**:
   ```sh
   npm install
   ```

3. **Set up Python environment**:
   - Ensure you have `pipenv` installed.
   - Install Python dependencies:
     ```sh
     pipenv install --dev
     ```

4. **Environment Variables**:
   - Create a `.env` file in the root directory and add the following variables:
     ```
     JWT_AUTH_SECRET=<your_jwt_secret>
     HUGGINGFACE_API_TOKEN=<your_hugging_face_api_token>
     ```

## Scripts
- **Combined**:
  - `npm run dev`: Runs both frontend and backend development servers concurrently. Open `http://localhost:3001` to access the application.
  - `npm run start`: Runs both frontend and backend production servers concurrently.
  - 
- **Frontend**:
  - `npm run dev-frontend`: Starts the Next.js development server on port 3000.
  - `npm run start-frontend`: Starts the Next.js production server.

- **Backend**:
  - `npm run dev-backend`: Starts the Vercel development server on port 3001.
  - `npm run start-backend`: Starts the Vercel server for backend API.



- **Build**:
  - `npm run build`: Builds the Next.js application.
  - `npm run export`: Exports the Next.js application.
  - `npm run lint`: Runs ESLint to lint the codebase.

## Running the Application

1. **Development Mode**:
   ```sh
   npm run dev
   ```

   - Open `http://localhost:3000` to access the frontend.
   - Backend will be running on `http://localhost:3001`.

2. **Production Mode**:
   ```sh
   npm run build
   npm run start
   ```

## Frontend

The frontend consists of three main components:

1. **Login Component**:
   - Handles user login and sets JWT token in cookies.
   - Located in `index.tsx`.

2. **UserInfo Component**:
   - Fetches and displays user information using the stored JWT token.
   - Located in `index.tsx`.

3. **Inference Component**:
   - Performs AI inference by calling the backend API and displaying the results.
   - Located in `index.tsx`.

## Backend

The backend is implemented using FastAPI and consists of two main endpoints:

1. **Authentication Endpoint** (`/api/auth`):
   - **POST /login**: Authenticates the user and returns a JWT token.
   - **GET /protected**: Example of a protected endpoint that requires a valid JWT token.

2. **Inference Endpoint** (`/api/inference`):
   - **POST /**: Accepts model ID and text, calls the Hugging Face API, and returns the inference result.

## API Endpoints

- **Login**:
  - URL: `/api/auth/login`
  - Method: `POST`
  - Body: `{ "username": "string", "password": "string" }`
  - Response: `{ "token": "string" }`

- **Protected Resource**:
  - URL: `/api/auth/protected`
  - Method: `GET`
  - Headers: `Authorization: Bearer <token>`
  - Response: `Access to protected resource granted`

- **AI Inference**:
  - URL: `/api/inference`
  - Method: `POST`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "modelID": "string", "text": "string" }`
  - Response: `{ "result": "inference result" }`
