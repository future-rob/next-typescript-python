# Next Typescript Python Supabase

This project integrates a Supabase-authenticated API with a Next.js typescript frontend and a Python backend for Hugging Face model inference.

## Table of Contents

- [Next Typescript Python Supabase](#next-typescript-python-supabase)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Setup](#setup)
    - [Prerequisites](#prerequisites)
    - [Environment Variables](#environment-variables)
  - [Deployment](#deployment)

## Overview

The project consists of two main parts:
1. **Backend**: A Python API using serverless functions, which handles user authentication with Supabase and communicates with the Hugging Face API for model inference.
2. **Frontend**: A Next.js application for user authentication and sending inference requests to the backend.

## Features

- User authentication using Supabase
- Secure token verification
- Hugging Face model inference integration
- Simple frontend for user interaction

## Setup

### Prerequisites

- Python 3.12
- Node.js and npm
- Supabase account
- Hugging Face account

### Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
HUGGINGFACE_API_TOKEN=your_huggingface_api_token
```

```env.local
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
```

## Deployment

Deploy app to vercel and add the environment variables in the settings.

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
HUGGINGFACE_API_TOKEN=your_huggingface_api_token
```