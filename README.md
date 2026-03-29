# Blog Website

A full-stack blog application built with Node.js, Express, EJS, PostgreSQL, and Tailwind CSS.

## Features

✅ **Authentication & Authorization**
- Session-based authentication
- Role-based access control (Admin & User)
- Secure password hashing with bcrypt
- Protected routes with middleware

✅ **Blog System**
- Create, read, update, delete posts
- Rich text content support
- Post visibility (public/private)
- Slug-based URLs for SEO

✅ **Comments & Replies**
- Nested comment system
- Reply to comments
- Comment moderation

✅ **Admin Dashboard**
- Manage posts, users, and comments
- Statistics overview
- Quick actions

✅ **SEO Optimization**
- Dynamic meta tags (title, description, keywords)
- Open Graph tags for social sharing
- Clean, semantic URLs

✅ **Social Sharing**
- Share buttons (Facebook, X, LinkedIn)
- Pre-populated share content

✅ **Security**
- SQL injection prevention (parameterized queries)
- XSS protection
- Input validation
- httpOnly session cookies

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** EJS Templates + Tailwind CSS
- **Database:** PostgreSQL (raw SQL queries, no ORM)
- **Session Store:** PostgreSQL (connect-pg-simple)
- **Architecture:** MVC Pattern

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
cd Blog\ Website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up PostgreSQL database

Create a new PostgreSQL database:
```sql
CREATE DATABASE blog_db;
```

### 4. Run database migrations

Execute the schema file:
```bash
psql -U postgres -d blog_db -f database/schema.sql
```

Or manually run the SQL from `database/schema.sql` in your PostgreSQL client.

### 5. Configure environment variables

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` with your configurations:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=blog_db
DB_USER=postgres
DB_PASSWORD=your_password

SESSION_SECRET=your_super_secret_key_change_this_in_production

BASE_URL=http://localhost:3000
```

### 6. Start the application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Default Credentials

The database schema includes default accounts:

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**User Account:**
- Username: `user`
- Password: `user123`

⚠️ **Important:** Change these credentials in production!

## Project Structure

```
Blog Website/
├── config/
│   └── database.js          # Database connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── postController.js    # Post CRUD operations
│   ├── commentController.js # Comment operations
│   └── adminController.js   # Admin dashboard
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── validation.js       # Input validation
├── models/
│   ├── User.js             # User model
│   ├── Post.js             # Post model
│   └── Comment.js          # Comment model
├── routes/
│   ├── auth.js             # Auth routes
│   ├── posts.js            # Post routes
│   ├── comments.js         # Comment routes
│   └── admin.js            # Admin routes
├── views/
│   ├── partials/           # Reusable components
│   ├── auth/               # Login & register
│   ├── posts/              # Post views
│   └── admin/              # Admin views
├── database/
│   ├── schema.sql          # Database schema
│   └── fix-passwords.sql   # Password reset SQL
├── scripts/
│   └── fix-passwords.js    # Utility to reset passwords
├── docs/
│   ├── QUICKSTART.md       # Getting started guide
│   ├── LOGIN-FIXED.md      # Password fix documentation
│   └── UPDATES-APPLIED.md  # Recent changes
├── .env.example            # Environment template
├── .env                    # Environment variables (create this)
├── server.js               # Main application file
├── package.json            # Dependencies
└── README.md               # This file
```

## API Routes

### Public Routes
- `GET /` - Redirect to posts
- `GET /posts` - List all public posts
- `GET /posts/:slug` - View single post

### Authentication Routes
- `GET /auth/login` - Login page
- `POST /auth/login` - Login handler
- `GET /auth/register` - Register page
- `POST /auth/register` - Register handler
- `GET /auth/logout` - Logout

### Protected Routes (Admin Only)
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/posts` - Manage posts
- `GET /admin/users` - Manage users
- `GET /admin/comments` - Manage comments
- `GET /posts/create/new` - Create post form
- `POST /posts/create` - Create post
- `GET /posts/:slug/edit` - Edit post form
- `POST /posts/:slug/edit` - Update post
- `POST /posts/:slug/delete` - Delete post

### Comment Routes (Authenticated)
- `POST /comments/create` - Create comment
- `POST /comments/:id/delete` - Delete comment

## Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password` (Hashed)
- `role` (admin/user)
- `created_at`, `updated_at`

### Posts Table
- `id` (Primary Key)
- `title`
- `slug` (Unique, SEO-friendly)
- `content`
- `excerpt`
- `author_id` (Foreign Key → users)
- `visibility` (public/private)
- `meta_description`, `meta_keywords`
- `created_at`, `updated_at`

### Comments Table
- `id` (Primary Key)
- `post_id` (Foreign Key → posts)
- `user_id` (Foreign Key → users)
- `parent_id` (Self-reference for nested replies)
- `content`
- `created_at`, `updated_at`

## Key Features Explained

### 1. Session-Based Authentication
- Sessions stored in PostgreSQL
- httpOnly cookies for security
- Role-based middleware protection

### 2. Slug-Based URLs
- Automatically generated from post titles
- SEO-friendly URLs
- Unique slug enforcement

### 3. Nested Comments
- Hierarchical comment structure
- Unlimited reply depth
- Parent-child relationships

### 4. Post Visibility
- Public posts visible to all
- Private posts only for author/admin
- Middleware-based access control

### 5. SEO Optimization
- Dynamic meta tags per page
- Open Graph tags for social media
- Structured data for search engines

## Security Measures

1. **SQL Injection Prevention:** Parameterized queries
2. **XSS Protection:** Input sanitization
3. **Password Security:** bcrypt hashing (10 rounds)
4. **Session Security:** httpOnly, secure cookies in production
5. **Input Validation:** express-validator for all inputs
6. **CSRF Protection:** Consider adding csurf middleware in production

## Production Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Use strong `SESSION_SECRET`
- Enable `secure` cookies (HTTPS)

### Database
- Use connection pooling
- Set up regular backups
- Enable SSL connections

### Performance
- Enable compression middleware
- Use a reverse proxy (nginx)
- Implement rate limiting
- Add caching layer (Redis)

### Security
- Keep dependencies updated
- Use helmet middleware
- Implement CSRF protection
- Set up monitoring and logging

## Troubleshooting

**Database connection failed:**
- Check PostgreSQL is running
- Verify credentials in `.env`
- Ensure database exists

**Session not persisting:**
- Check session table exists
- Verify cookie settings
- Check browser cookie settings

**Posts not visible:**
- Check post visibility setting
- Verify user role permissions
- Check database records

**Can't login / Forgot password:**
- Run `node scripts/fix-passwords.js` to reset default passwords
- This will reset admin/user accounts to their default passwords
- See `docs/LOGIN-FIXED.md` for more information

## Additional Documentation

- **[Quick Start Guide](docs/QUICKSTART.md)** - Step-by-step usage instructions
- **[Login & Password Info](docs/LOGIN-FIXED.md)** - Password reset and troubleshooting
- **[Recent Updates](docs/UPDATES-APPLIED.md)** - Latest changes and features

## License

ISC

## Author

Built with ❤️ using Node.js, Express, EJS, and PostgreSQL

---

**Note:** This is a learning project demonstrating full-stack development with MVC architecture, raw SQL queries, and best practices.
