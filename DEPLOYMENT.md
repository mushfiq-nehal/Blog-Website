# Local Deployment & CI/CD Setup Guide

## 📋 Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Docker** & **Docker Compose** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com/))
- **PostgreSQL** 15+ (or use Docker)

---

## 🚀 Quick Start - Local Development with Docker

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd "Blog Website"
```

### 2. Setup Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your settings (or use defaults for local dev)
# Default values in docker-compose.yml will work
```

### 3. Start Docker Containers
```bash
# Start PostgreSQL and Node app
docker-compose up -d

# View logs
docker-compose logs -f app

# App runs on http://localhost:3000
```

### 4. Initialize Database
```bash
# The schema.sql is automatically run when container starts
# If you need to reinitialize:
docker-compose exec db psql -U blog_user -d blog_db -f /docker-entrypoint-initdb.d/schema.sql
```

### 5. Stop Containers
```bash
docker-compose down

# Remove all data (reset database)
docker-compose down -v
```

---

## 🛠️ Local Development (Without Docker)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup PostgreSQL
```bash
# Create database and user
createdb -U postgres blog_db
createuser -U postgres blog_user -P  # Enter password when prompted

# Run schema
psql -U blog_user -d blog_db -f database/schema.sql
```

### 3. Create .env File
```bash
cp .env.example .env

# Edit with your local PostgreSQL settings:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blog_db
DB_USER=blog_user
DB_PASSWORD=your_password
```

### 4. Run Application
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

App runs on `http://localhost:3000`

---

## 🐳 Docker Commands Reference

```bash
# View running containers
docker-compose ps

# View container logs
docker-compose logs app
docker-compose logs db

# Execute commands in container
docker-compose exec app npm test
docker-compose exec db psql -U blog_user -d blog_db

# Rebuild image
docker-compose build

# Remove everything including volumes
docker-compose down -v

# Run specific service
docker-compose up db      # Only database
docker-compose up app     # Only app (requires running db)
```

---

## 🔄 GitHub Actions CI/CD Pipeline

### Setup Instructions

#### 1. Add GitHub Secrets
```
Go to: Settings → Secrets and variables → Actions → New repository secret
```

Add these secrets:
- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Your Docker Hub access token

#### 2. Automatic Pipeline Triggers
The pipeline runs on:
- **Push to `main` or `develop` branch** → Build and push Docker image
- **Pull requests to `main` or `develop`** → Run tests only (no Docker push)

#### 3. Pipeline Stages

**Stage 1: Test**
- Install dependencies
- Run linting (if configured)
- Run tests (if configured)

**Stage 2: Build** (Main branch only)
- Build Docker image
- Push to Docker Hub

**Stage 3: Security Scan**
- Run npm audit
- Check for outdated packages

#### 4. View Pipeline Status
```
Go to: Actions tab → See workflow runs
```

---

## 📝 Add npm Scripts (Optional)

Edit `package.json` to add more npm scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "lint": "eslint .",
    "test": "jest",
    "db:init": "psql -U blog_user -d blog_db -f database/schema.sql",
    "db:seed": "node scripts/seedData.js"
  }
}
```

---

## 🔒 Environment Variables Checklist

### Development
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blog_db
DB_USER=blog_user
DB_PASSWORD=password
SESSION_SECRET=dev-secret-key
```

### Production
```
NODE_ENV=production
PORT=3000 (or your cloud provider's port)
DB_HOST=your-production-host
DB_PORT=5432
DB_NAME=blog_db
DB_USER=blog_user
DB_PASSWORD=strong-production-password
SESSION_SECRET=very-strong-random-secret
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000      # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker-compose ps
docker-compose logs db

# Verify credentials
docker-compose exec db psql -U blog_user -c "\l"
```

### Docker Build Fails
```bash
# Clean and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Node Modules Issues
```bash
# Within container
docker-compose exec app npm ci

# Or locally
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Next Steps

1. **Add Testing**: Configure Jest or Mocha for automated tests
2. **Add Linting**: Configure ESLint for code quality
3. **Add Production Deployment**: Deploy Docker image to AWS ECS, Google Cloud Run, or Railway
4. **Add Database Backups**: Setup automated PostgreSQL backups
5. **Add Monitoring**: Integrate with monitoring tools like DataDog or New Relic

---

## 🌐 Deployment Options

### Option 1: Railway (Easiest)
- Connect GitHub repo
- Auto-deploys on push
- Built-in PostgreSQL
- Free tier available

### Option 2: AWS ECS
- Docker image → ECR
- RDS for PostgreSQL
- Application Load Balancer

### Option 3: DigitalOcean App Platform
- Connect GitHub repo
- Auto-deploy from Docker image
- Managed PostgreSQL

### Option 4: Render
- Connect GitHub repo
- Deploy from Docker
- Built-in PostgreSQL

