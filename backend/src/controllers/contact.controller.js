const axios = require('axios');

exports.sendContactMessage = async (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body;

  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }

  const fullName = `${firstName} ${lastName}`;

  try {
    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from: 'Your Site <onboarding@resend.dev>',
        to: ['trekshikhar@gmail.com'],
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({ message: "Message sent successfully", data: response.data });
  } catch (error) {
    console.error("Error sending contact form message:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};
