import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// import historyRoutes from './routes/history.js'
import factRoutes from './routes/facts.js'
import articleRoutes from './routes/articles.js';
import adminAuthRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import newsletterRoutes from "./routes/newsletter.js";
import contactRoute from './routes/contact.js'

dotenv.config();

const app = express();

app.use(cors({
  origin:"https://ui-optimised-frontend.vercel.app",
        
  credentials: true
}));
app.use(express.json());

app.use(cookieParser());


const PORT = process.env.PORT || 5000;

// Middleware


 
app.use('/uploads', express.static('uploads')); // serve image files

// app.use('/api/history', historyRoutes);
app.use('/api/facts', factRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/contact', contactRoute)
app.use("/api/newsletter", newsletterRoutes);

 

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));
