import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    await sendgrid.send({
      to: email,
      from: 'hi@madebyliam.co', // your verified sender
      subject: 'Your Requested PDF',
      text: 'Please find your PDF attached.',
      attachments: [
        {
          content: Buffer.from('public/download/project-brief-form.pdf', 'utf-8').toString('base64'),
          filename: 'file.pdf',
          type: 'application/pdf',
          disposition: 'attachment',
        }
      ]
    });

    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
