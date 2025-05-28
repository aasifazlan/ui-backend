import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  year: Number,
  description: String,
});

const historySchema = new mongoose.Schema({
  title: {
    type: String,
    default: "On This Day in History",
  },
  content: {
    type: String,
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
    unique: true
  },
  events: [eventSchema],
  imageUrl: {
    type: String,
  },
});

const History = mongoose.model('History', historySchema);
export default History;
