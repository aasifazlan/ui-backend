import Article from '../models/Article.js';
import dotenv from 'dotenv';
import cloudinary from '../utils/cloudinary.js';
dotenv.config();

export const createArticle = async (req, res) => {
  try {
    const { title, content, category, tags, summary, author, period } = req.body;

    const images = req.files?.map(file => ({
      url: file.path,
      publicId: file.filename,
    })) || [];

    const newArticle = new Article({
      title,
      content,
      category,
      period,
      images,
      tags: tags ? tags.split(',') : [],
      summary,
      author
    });

    await newArticle.save();
    res.status(201).json({ message: 'Article created', article: newArticle });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ message: 'Server error while creating article' });
  }
};

export const getAllArticles = async (req, res) => {
  try {
    const { category, period } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (period) filter.period = period;

    const articles = await Article.find(filter).sort({ createdAt: -1 });

    const formattedArticles = articles.map(article => ({
      ...article.toObject(),
      imageUrls: article.images?.map(img => img.url) || [],
    }));

    res.json(formattedArticles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Server error while fetching articles' });
  }
};



export const getTodayHistory = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const latestHistory = await Article.findOne({
      category: 'history',
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ createdAt: -1 });

    if (!latestHistory) {
      return res.status(404).json({ message: 'No history article found for today' });
    }

    res.status(200).json(latestHistory);
  } catch (error) {
    console.error("Error fetching today's history:", error);
    res.status(500).json({ message: 'Server error while fetching history' });
  }
};
