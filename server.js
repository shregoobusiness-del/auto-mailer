import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.post("/payment-success", async (req, res) => {
  try {
    const data = req.body.payload?.payment?.entity;
    if (!data) return res.status(400).send("Invalid payload");

    const email = data.email || data.notes?.email;
    const amount = data.amount / 100; // paisa → INR

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `Shregoo Store <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Thank You for Your Purchase – Shregoo SFX Bundle",
      html: `
        <h2>Hi there!</h2>
        <p>Your payment of ₹${amount} was successful.</p>
        <p>Here’s your download link:</p>
        <a href="${process.env.DOWNLOAD_LINK}" 
           style="background:#007bff;color:#fff;padding:10px 15px;text-decoration:none;border-radius:6px;">Download Bundle</a>
        <p>Enjoy your new editing pack! 💥</p>
        <p>— Team Shregoo 🎧</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", email);
    res.status(200).send("Email sent successfully!");
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Something went wrong");
  }
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
