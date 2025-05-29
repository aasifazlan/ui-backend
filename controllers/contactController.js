import Contact from "../models/Contact.js";
import nodemailer from 'nodemailer';

export const submitContactForm=async(req, res)=>{
    try {
        const {name, email, message}=req.body;
        if(!name || !email || !message){
            return res.status(400).json({message: "All fields are required"});
        }

        const contactEntry= new Contact({name, email, message});
        await contactEntry.save();

        // Create transporter (you can use Gmail, Outlook, etc.)
      const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL, // your email address
        pass: process.env.CONTACT_EMAIL_PASSWORD, // app password
      },
    });

    // Email options
    const mailOptions = {
      from: `"Unscripted India Contact" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL, // your or team's email to receive messages
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h3>Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

        res.status(201).json({message:"message recieved. We'll get back to you soon! "});
    } catch (error) {
        console.error("Contact form error", error);
        res.sttaus(500).json({message: "Something went wrong. Try again later."})
    }
};