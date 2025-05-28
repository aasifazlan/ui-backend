import mongoose from 'mongoose';
import slugify from 'slugify';


const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  images: [
    {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    }
  ],
  category: {
    type: String,
    required: true,
    enum: ['history', 'culture', 'festival', 'fact-check', 'other'],
  },
  period: {
    type: String,
    required: true,
    enum: ['ancient', 'medieval', 'modern', 'post-independence'],
  },
  tags: {
    type: [String],
    default: [],
  },
  summary: {
    type: String,
    default: '',
  },
}, { timestamps: true });

articleSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});


const Article = mongoose.model('Article', articleSchema);
export default Article;
