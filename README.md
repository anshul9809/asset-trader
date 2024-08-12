# Asset Trading Tracker - Backend

## Overview

The Asset Trading Tracker is a backend application that allows users to manage and trade digital assets. Users can create, list, and trade assets on a marketplace, negotiate prices, and track the trading history of each asset.

## Features

- User registration and authentication with JWT
- Asset creation, management, and publishing
- Marketplace listing and asset trading
- Price negotiation and trading history tracking

## Technologies Used

- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing user and asset data
- **JWT**: JSON Web Tokens for user authentication
- **Mongoose**: ODM for MongoDB

## Project Structure

/backend <br>
├── /controllers # Business logic for each route <br>
├── /models # Mongoose models and schemas <br>
├── /routes # API route definitions <br>
├── /middleware # Authentication and other middleware <br>
├── /config # Configuration files <br>
├── /utils # Utility functions <br>
├── app.js # Express app <br>
├── server.js # Entry point of the application <br>


## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/anshul9809/asset-trader
   cd backend
2. Install dependencies

   ```bash
   npm install
   ```
3. Create a .env file in the root directory and add your environment variables:
    ```bash 
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/asset-trading
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME = YOUR_CLOUD_NAME
    CLOUDINARY_API_KEY = YOUR_API_KEY
    CLOUDINARY_API_SECRET = YOUR_API_SECRET
    ```
4. Start the server:
    ```bash
    npm start
    ```

### API Endpoints

#### User Authentication
1. User Signup

- Endpoint: 
    ```bash
    POST /auth/signup
    ```
- Request:
    ```bash
    {
      "username": "testuser",
      "email": "testuser@example.com",
      "password": "password123"
    }
    ```
- Response:
    ```bash
    {
      "token": "your_jwt_token",
      "user": {
        "id": "your_user_id",
        "username": "testuser",
        "email": "testuser@example.com"
      }
    }
    ```

2. User Login

- Endpoint:

    ```bash
    POST /auth/login
    ```

- Request:

    ```bash
    {
      "email": "testuser@example.com",
      "password": "password123"
    }
    ```

- Response:

    ```bash
    {
      "token": "your_jwt_token",
      "user": {
        "id": "your_user_id",
        "username": "testuser",
        "email": "testuser@example.com"
      }
    }
    ```

#### Asset Management

1. Create Asset

- Endpoint:

    ```bash
    POST /assets/
    ```

- Request:

    ```bash
    {
      "name": "Bitcoin",
      "description": "Digital currency",
      "image": "https://example.com/bitcoin.jpg",
      "price": 30000
    }
    ```

- Response:

    ```bash
    {
      "message": "Asset created successfully",
      "assetId": assetId
    }
    ```

2. Update Asset

- Endpoint:

    ```bash
    PUT /assets/:assetId
    ```

- Request:

    ```bash
    {
      "name": "Bitcoin",
      "description": "Digital currency",
      "image": "https://example.com/bitcoin.jpg",
      "price": 30000
    }
    ```

- Response:

    ```bash
    {
      "message": "Asset updated successfully",
      "assetId" : assetId
    }
    ```

3. Get Asset Details

- Endpoint:

    ```bash
    GET /assets/:assetId
    ```

- Response:

    ```bash
    {
      "asset": {
        "id": assetId,
        "name": "Bitcoin",
        "description": "Digital currency",
        "image": "https://example.com/bitcoin.jpg",
        "price": 30000
      }
    }
    ```


#### Request

1. Create Request
- Endpoint:

    ```bash
    POST /assets/{assetId}/requests
    ```

- Request:

    ```bash
    {
      "proposedPrice": 30000
    }
    ```

- Response:

    ```bash
    {
      "message": "Request sent successfully",
      "requestId": requestId
    }
    ```
2. Accept Request
- Endpoint:

    ```bash
    PUT /requests/:id/accept
    ```

- Response:

    ```bash
    {
      "message": "Request accepted successfully",
      "requestId": requestId
    }
    ```

3. Reject Request
- Endpoint:

    ```bash
    PUT /requests/:id/deny
    ```

- Response:

    ```bash
    {
      "message": "Request rejected successfully",
      "requestId": requestId
    }
    ```
4. Get Request Details
- Endpoint:

    ```bash
    GET /requests/:id
    ```

- Response:

    ```bash
    {
      "request": {
        "id": requestId,
        "proposedPrice": 30000,
        "porposedAsset": assetId,
      }
    }
    ```
Thanks for using the Asset Trading Tracker API documentation. If you have any questions or need further assistance, feel free to reach out!
Email : anshul9809.project@gmail.com