import mongoose from "mongoose";

const newsletterSubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  ip: { type: String },               // IP address
  subscribedAt: { type: Date },      // Timestamp
});

const NewsletterSubscriber = mongoose.model("NewsletterSubscriber", newsletterSubscriberSchema);

export default NewsletterSubscriber;
