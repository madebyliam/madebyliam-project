import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  try {
    await sendgrid.send({
      to: "hi@madebyliam.co", // your email here
      from: "hi@madebyliam.co", // verified sender on SendGrid
      subject: "Test Email from Vercel API",
      text: "If you get this, your SendGrid & API route are working!",
    });
    res.status(200).json({ message: "Test email sent successfully!" });
  } catch (error) {
    console.error("SendGrid error:", error);
    res.status(500).json({ error: "Failed to send test email", details: error.message });
  }
}
