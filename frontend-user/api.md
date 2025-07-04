📘 API Documentation - Portal Berita

🔐 Authentication

POST /api/auth/login

Login Admin

Body:

{
  "usernameOrEmail": "admin01",
  "password": "yourPassword"
}

Response (200):

{
  "message": "Login berhasil",
  "token": "<jwt_token>",
  "admin": {
    "adminId": 1,
    "username": "admin01",
    "email": "admin@example.com"
  }
}

📰 News

GET /api/news

Get all news articles

Response (200): array of news objects

POST /api/news (protected)

Create a new article (with image upload)

Headers: Authorization: Bearer <token>

Form Data:

title (string)

content (string)

image (file)

authorId (int)

categoryId (int)

status (draft/published)

publishedAt (date)

PUT /api/news/:id (protected)

Update existing article

DELETE /api/news/:id (protected)

Delete article

🗂️ Category

GET /api/categories

Get all categories

POST /api/categories (protected)

Create a category

Body:

{
  "name": "Teknologi"
}

PUT /api/categories/:id (protected)

Update category

DELETE /api/categories/:id (protected)

Delete category

🧑 Author

GET /api/authors

Get all authors

💬 Comments

GET /api/comments (protected)

Get all comments

DELETE /api/comments/:id (protected)

Delete a comment