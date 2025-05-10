# Personal Blogging Platform API

A RESTful API for a personal blogging platform built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- CRUD operations for blog posts
- Comment system
- Like/unlike functionality
- Search functionality
- Input validation
- Error handling
- JWT-based authentication

## Prerequisites

- Node.js >= 14.0.0
- MongoDB

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blog-platform
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=your_port
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the development server:
```bash
npm run dev
```

## Testing the Routes

To test the API routes, you can use tools like **Postman** or **Thunder Client**.

### Prerequisites
- Make sure the server is running.
- Install [Postman](https://www.postman.com/) or [Thunder Client (VS Code extension)](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client).

### Steps to Test

1. Open Postman or Thunder Client.
2. Create a new request.
3. Choose the request method (GET, POST, PUT, DELETE, etc.).
4. Enter the API endpoint URL (e.g., `http://localhost:5000/api/route`).
5. If the route requires authentication, add a Bearer Token in the **Authorization** tab.
6. For POST/PUT requests, go to the **Body** tab and select **raw** → **JSON**.



## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Users
- GET /api/users - Get all users (Private/Admin)
- GET /api/users/:id - Get user by ID (Private)
- GET /api/users/profile - Get user profile (Private)
- PUT /api/users/profile - Update user profile (Private)
- DELETE /api/users/profile - Delete user profile (Private)

### Posts
- POST /api/posts - Create a new post (Private)
- GET /api/posts - Get all posts (Public)
- GET /api/posts/:id - Get post by ID (Public)
- PUT /api/posts/:id - Update post (Private)
- DELETE /api/posts/:id - Delete post (Private)
- PUT /api/posts/:id/like - Like a post (Private)
- PUT /api/posts/:id/unlike - Unlike a post (Private)

### Comments
- POST /api/comments/:postId - Create a new comment (Private)
- GET /api/comments/:postId - Get all comments for a post (Public)
- PUT /api/comments/:id - Update a comment (Private)
- DELETE /api/comments/:id - Delete a comment (Private)
- PUT /api/comments/:id/like - Like a comment (Private)
- PUT /api/comments/:id/unlike - Unlike a comment (Private)

### Search
- GET /api/search/posts - Search posts by query (Public)
- GET /api/search/users - Search users by query (Private)

## Testing

Run the test suite:
```bash
npm test
```
