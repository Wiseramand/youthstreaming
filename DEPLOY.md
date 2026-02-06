# Youth Angola Streaming - Deployment Guide

## 🚀 Deploy to Vercel

### Backend Deployment

1. **Prepare Environment Variables**
   - Copy `.env.example` to `.env.production`
   - Fill in all required environment variables:
     - `JWT_SECRET`: Generate a strong secret (use the script in `scripts/generate-secret.js`)
     - `DATABASE_URL`: Your production database URL
     - `SMTP_*`: Email configuration for notifications
     - `FRONTEND_URL`: Your frontend URL
     - `NODE_ENV`: Set to `production`

2. **Database Setup**
   - Run migrations: `npx prisma migrate deploy`
   - Create admin user: `node scripts/createAdmin.cjs`

3. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy!

### Frontend Deployment

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository
   - Set `VITE_API_URL` to your backend URL
   - Deploy!

## 📋 Environment Variables

### Required for Backend
```env
NODE_ENV=production
PORT=4000
JWT_SECRET=your-super-secret-jwt-key-here
DATABASE_URL="postgresql://user:password@host:port/dbname"
FRONTEND_URL="https://your-frontend.vercel.app"
```

### Optional for Email Notifications
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@youthangola.com
```

## 🔧 Database Schema

The application uses Prisma ORM with the following models:

- **User**: Authentication and roles
- **Profile**: User profiles and preferences
- **Stream**: Live streams and VOD
- **Donation**: Payment tracking
- **ChatMessage**: Real-time chat

## 🚨 Production Checklist

- [ ] Generate strong JWT secret
- [ ] Set up production database
- [ ] Configure SMTP for email notifications
- [ ] Set up SSL certificates
- [ ] Configure CORS for production
- [ ] Create admin user
- [ ] Test all endpoints
- [ ] Monitor logs and performance

## 📞 Support

For deployment issues or questions, check the [Issues](https://github.com/your-repo/issues) or contact the development team.