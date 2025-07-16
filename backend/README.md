# PixelPulse API

This is the backend API for PixelPulse, a blog application built with the MERN stack.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/)
*   [MongoDB](https://www.mongodb.com/)

### Installation

1.  Clone the repository:
    ```
    git clone https://github.com/WambuiGrace/pixelpulse.git
    ```
2.  Navigate to the backend directory:
    ```
    cd pixelpulse/backend
    ```
3.  Install the dependencies:
    ```
    npm install
    ```

### Environment Variables

Create a `.env` file in the `backend` directory and add the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Usage

To start the server, run the following command:

```
npm run dev
```

The server will start on port 5000.

## API Endpoints

The following are the available API endpoints:

*   `GET /api/posts`: Get all blog posts
*   `GET /api/posts/:id`: Get single post
*   `POST /api/auth/login`: Login
*   `POST /api/auth/register`: Register
*   `POST /api/posts`: (Admin) Create post
*   `PUT /api/posts/:id`: (Admin) Update post
*   `DELETE /api/posts/:id`: (Admin) Delete post
*   `POST /api/posts/:id/like`: (User) Like post
*   `POST /api/posts/:id/comment`: (User) Comment on post
*   `POST /api/posts/:id/save`: (User) Save post
*   `GET /api/users/saved`: (User) View saved posts
*   `GET/PUT/DELETE /api/users/:id`: (Admin) Manage users

## Postman Collection

A Postman collection for testing the API. `backend/tests/pixelpulse.postman_collection.json`.