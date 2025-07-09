import sendgrid from "@sendgrid/mail";
import fs from "fs";
import path from "path";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
    // Path to your PDF file (adjust if needed)
    const pdfPath = path.resolve("./public/downloads/project-brief-form.pdf");
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfBuffer.toString("base64");

    const msg = {
      to: email,
      from: "hi@madebyliam.co", // your verified sender
      subject: "Your Project Brief Form",
      text: "Hi! Please find attached the project brief form.",
      attachments: [
        {
          content: pdfBase64,
          filename: "project-brief-form.pdf",
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    await sendgrid.send(msg);

    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error sending email" });
  }
}

