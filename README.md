# ![PenChronicles](https://res.cloudinary.com/dtq2cn21c/image/upload/v1738519494/My%20Assets/image-removebg-preview_4_dmb9kv.png)
  PenChronicles is a blogging platform where content creators can write and publish articles. Similar to Medium, PenChronicles allows readers to discover, comment, like, and engage with articles.

## ✨ Features

- 📝 **Create & Publish Articles** - Users can write, publish, and manage their articles.
- 🔍 **Search & Filter** - Smart search system to find articles by title, tags, and author.
- 👤 **User Authentication** - Signup/Login with JWT-based authentication.
- 💬 **Comments & Reactions** - Users can comment and like posts.
- 📊 **Analytics Dashboard** - Track views, likes, and engagement for each post.
- 📱 **Responsive UI** - Mobile-friendly and smooth user experience with Tailwind CSS.
- 🌙 **Dark Mode** - Switch between light and dark themes.
- 🎙️ **Text-to-Speech** - Listen to articles with content highlighted as it is read.
- 🔄 **User Feed** - Personalized feed based on followers, likes, and comments.
- 🖼️ **Profile Customization** - Users can update their bio and profile picture.

## 🚀 Tech Stack

- **Frontend:** React, CSS
- **Backend:** Node.js, Express.js, MongoDB
- **Text-to-Speech:** Integrated with React Quill
  
### Frontend Repository
- **Tech Stack:** React, CSS
- **Repo:** [Frontend Repository](https://github.com/your-username/PenChronicles-Frontend)

### Backend Repository
- **Tech Stack:** Node.js, Express.js, MongoDB
- **Repo:** [Backend Repository](https://github.com/your-username/PenChronicles-Backend)

## 🔧 Installation & Setup

### Frontend Setup
1. **Clone the frontend repository:**
   ```bash
   git clone https://github.com/Suraj-360/PenChronicles.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Setup environment variables (.env file) for frontend:**
   ```env
   REACT_APP_FRONTEND_URL =  Your frontend URL or [http://localhost:3000]
   REACT_APP_BACKEND_URL = Your backend URL or [http://localhost:5000]
   ```
4. **Run the frontend:**
   ```bash
   npm start
   ```

### Backend Setup
1. **Clone the backend repository:**
   ```bash
   git clone https://github.com/your-username/PenChronicles-Backend.git
   ```
2. **Install dependencies:**
   ```bash
   cd PenChronicles-Backend
   npm install
   ```
3. **Setup environment variables (.env file):**
   ```env
   DB_URL_ALTAS = Enter Your Mongo Altas URL (https://account.mongodb.com/)
   CLOUD_NAME = Enter Your Cloud Name (https://console.cloudinary.com/settings/)
   CLOUD_API_KEY = 15 digit Cloudnary API Key (https://console.cloudinary.com/settings/)
   CLOUD_API_SECRET= Write your Cloudnary API Secret (https://console.cloudinary.com/settings/)
   PORT = Mention port like 5000
   JWT_SECRET = Enter your JWT Secret (Anything like WseEwwDsEfes34sEW)
   EMAIL_USER = Enter email
   EMAIL_PASS = Enter email password
   FRONTEND_URL = Your frontend URL or [http://localhost:3000]
   ```
4. **Run the backend:**
   ```bash
   npm start
   ```

## 📌 API Endpoints

| Method | Endpoint                         | Description                         |
|--------|----------------------------------|-------------------------------------|
| POST   | /api/auth/signup                 | User signup                         |
| POST   | /api/auth/signin                 | User login                          |
| GET    | /api/verify-email/:token         | Verify user email                   |
| POST   | /api/create-post                 | Create a new post                   |
| POST   | /api/save-post-draft             | Save post as draft                  |
| POST   | /api/get-draft-post              | Get draft posts                     |
| POST   | /api/get-published-post          | Get published posts                 |
| POST   | /api/get-recent-post             | Get recent edited posts             |
| POST   | /api/get-trash-post              | Get temporarily deleted posts       |
| POST   | /api/get-profile-posts           | Get user profile posts              |
| POST   | /api/get-profile-saved-posts     | Get user saved posts                |
| POST   | /api/personalized-feed-post      | Get personalized feed posts         |
| POST   | /api/public-feed-post            | Get public feed posts               |
| GET    | /api/get-trending-posts          | Get trending posts                  |
| GET    | /api/get-recent-posts            | Get recent posts                    |
| PUT    | /api/temp-delete-post            | Temporarily delete a post           |
| PUT    | /api/restore-delete-post         | Restore a deleted post              |
| DELETE | /api/permanent-delete-post       | Permanently delete a post           |
| POST   | /api/toggle-save-post            | Save/Unsave a post                  |
| POST   | /api/user-saved-post-status      | Check if a post is saved            |
| POST   | /api/get-post-by-id              | Get a post by ID                    |
| POST   | /api/get-posts-by-category       | Get posts by category               |
| POST   | /api/like-post                   | Like a post                         |
| POST   | /api/comment-post                | Comment on a post                   |
| POST   | /api/like-comment                | Like a comment                      |
| POST   | /api/reply-on-comment            | Reply to a comment                  |
| POST   | /api/view-post                   | View a post                         |
| POST   | /api/search                      | Search posts & users                |
| POST   | /api/search-tag-posts            | Search posts by tags                |
| POST   | /api/get-notification            | Fetch notifications                 |
| POST   | /api/mark-notification-as-read   | Mark notification as read           |
| POST   | /api/delete-notification-message | Delete notification                 |
|--------|----------------------------------|-------------------------------------|

## 📷 Screenshots

![Homepage](https://res.cloudinary.com/dtq2cn21c/image/upload/v1738521680/My%20Assets/home_page_pxlmxn.png)

![Article Page](https://res.cloudinary.com/dtq2cn21c/image/upload/v1738520299/My%20Assets/Read_me_page_eivhqd.png)

## 🤝 Contributing

Contributions are welcome! Follow these steps:
1. **Fork the repository**
2. **Create a new branch:** `git checkout -b feature-name`
3. **Commit your changes:** `git commit -m "Added new feature"`
4. **Push to the branch:** `git push origin feature-name`
5. **Open a Pull Request**

## 📜 License

This project is licensed under the **MIT License**, created by **SURAJ PANDEY**. You are free to use, copy, modify, or distribute the project for both personal and commercial purposes. For more details, check the [LICENSE](./LICENSE) file.

