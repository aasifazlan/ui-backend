// import History from '../models/History.js';
import Article from '../models/Article.js';
import moment from 'moment';

export const createHistory = async (req, res) => {
  try {
    const { title, content, date, events, imageUrl } = req.body;

    const existing = await Article.findOne({ date });
    if (existing) return res.status(400).json({ message: 'History already exists for this date.' });

    const newEntry = new Article({ title, content, date, events, imageUrl });
    await newEntry.save();

    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating history entry', error });
  }
};

export const getTodayHistory = async (req, res) => {
  const date=req.params.date
  // const today = moment().format('YYYY-MM-DD');

  try {
    const entry = await Article.findOne({ date });
    if (!entry) return res.status(404).json({ message: 'No historical events found for today' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching history', error: err });
  }
};
