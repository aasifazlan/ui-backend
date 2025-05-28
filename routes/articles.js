import express from 'express';
import upload from '../utils/multer.js';
import {
  createArticle,
  getAllArticles,
  getTodayHistory,
} from '../controllers/articleController.js';
import Article from '../models/Article.js';
import cloudinary from '../utils/cloudinary.js';

const router = express.Router();

router.get('/today-history/:date', getTodayHistory);
router.get('/', getAllArticles);
router.post('/', upload.array('images', 5), createArticle); // Allow up to 5 images

router.get('/slug/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const { title, content, category, tags, summary, period } = req.body;
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    article.title = title || article.title;
    article.content = content || article.content;
    article.category = category || article.category;
    article.tags = tags ? tags.split(',') : article.tags;
    article.summary = summary || article.summary;
    article.period = period || article.period;

    

    if (req.files.length) {
      // Delete old images
      for (const img of article.images) {
        await cloudinary.uploader.destroy(img.publicId);
      }
      article.images = req.files.map(file => ({
        url: file.path,
        publicId: file.filename
      }));
    }

    const updatedArticle = await article.save();
    res.status(200).json({ success: true, article: updatedArticle });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update article' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    for (const img of article.images) {
      await cloudinary.uploader.destroy(img.publicId);
    }

    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete article' });
  }
});

export default router;
