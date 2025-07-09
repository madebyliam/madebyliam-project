import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const pdfUrl = "https://madebyliam.co/downloads/project-brief-form.pdf";

  try {
    const response = await fetch(pdfUrl);
    const buffer = await response.arrayBuffer();
    const base64Pdf = Buffer.from(buffer).toString("base64");

    await sendgrid.send({
      to: email,
      from: "hi@madebyliam.co", // must be verified in SendGrid
      subject: "Your Project Brief Form",
      text: "Thanks for your interest! Here's the PDF you requested.",
      attachments: [
        {
          content: base64Pdf,
          filename: "project-brief-form.pdf",
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    });

    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error sending email." });
  }
}