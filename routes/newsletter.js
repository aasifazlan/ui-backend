import express from "express";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";
import mailchimp from "../utils/mailchimp.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// 📦 Rate limiter: 5 requests per hour per IP
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: "Too many requests. Please try again later." },
});

router.post("/", limiter, async (req, res) => {
  const consentGiven = req.cookies.cookieConsent === "true";

  if (!consentGiven) {
    return res.status(403).json({ error: "Cookie consent required to subscribe." });
  }

  const { email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email." });
  }

  // Get IP address from request (behind proxies, use x-forwarded-for)
  const ip =
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.socket?.remoteAddress ||
    null;

  const timestamp = new Date();

  try {
    // Mailchimp subscription
    const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
      email_address: email,
      status: "subscribed",
    });

    console.log("Mailchimp response:", response.id);

    // MongoDB Backup with IP & timestamp
    const existing = await NewsletterSubscriber.findOne({ email });
    if (!existing) {
      const newSubscriber = new NewsletterSubscriber({ email, ip, subscribedAt: timestamp });
      await newSubscriber.save();
    }

    return res.status(200).json({ message: "Successfully subscribed via Mailchimp!" });
  } catch (error) {
    console.error("Mailchimp Error:", error.response?.body || error.message);
    return res.status(500).json({ error: "Subscription failed. Try again later." });
  }
});

export default router;
