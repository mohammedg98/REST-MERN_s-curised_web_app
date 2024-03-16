import https from 'https';
import fs from 'fs';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';

dotenv.config();
const MONGO = 'mongodb://localhost:27017/myd';

mongoose
  .connect(MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();
const app = express();

const googleAuthDomain = 'https://accounts.google.com';
const allowedOrigins = ['http://127.0.0.1:5173', 'https://localhost:3000', googleAuthDomain];

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Allow resources from the same origin
        scriptSrc: ["'self'", "'unsafe-inline'"], // Allow scripts from the same origin and inline scripts (unsafe, consider removing this for stricter security)
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow styles from the same origin and inline styles (unsafe, consider removing this for stricter security)
        // Add more directives as needed for other content types
      },
      frameguard: {
        action: 'sameorigin' // Set the X-Frame-Options header to SAMEORIGIN
      }
    },
  })
);
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// HTTPS Configuration
const privateKey = fs.readFileSync(path.join(__dirname, 'key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'cert.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(3000, () => {
  console.log('HTTPS server running on port 3000!');
});

// Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);































