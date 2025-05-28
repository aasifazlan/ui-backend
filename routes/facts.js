import express from 'express';

const router = express.Router();

router.get('/random', (req, res) => {
  res.json({ fact: 'Ayurveda is the oldest form of medicine in the world!' });
});

export default router;
