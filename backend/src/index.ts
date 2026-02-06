import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import adminRoutes from "./routes/adminRoutes";
import vipRoutes from "./routes/vipRoutes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com", "https://api.paypal.com"],
      fontSrc: ["'self'", "https://fonts.googleapis.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "blob:", "data:"],
      frameSrc: ["'self'", "https://js.stripe.com", "https://www.paypal.com"],
    },
  },
}));

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later."
  }
});

app.use('/api/', limiter);

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://youth-angola-streaming.vercel.app']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vip", vipRoutes);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info endpoint
app.get("/api", (_req, res) => {
  res.json({
    name: "Youth Angola Streaming API",
    version: "1.0.0",
    description: "API para plataforma de streaming da juventude angolana",
    endpoints: {
      auth: "/api/auth",
      profile: "/api/profile", 
      admin: "/api/admin",
      vip: "/api/vip"
    },
    documentation: "https://github.com/Wiseramand/youthstreaming"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  
  // Don't send error details in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ 
      message: "Erro interno do servidor",
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(500).json({ 
      message: "Erro interno do servidor",
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.listen(port, () => {
  console.log(`🚀 Backend running on http://localhost:${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 CORS enabled for: ${corsOptions.origin}`);
});

export default app;
