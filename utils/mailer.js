
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


const sendVerificationCode = async (to, code) => {
  const mailOptions = {
    from: '"MeetUs Support" <your_email@gmail.com>',
    to,
    subject: "MeetUs Email Verification",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MeetUs Verification</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f6f8;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 30px auto;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background-color: #00bfff;
          padding: 20px;
          text-align: center;
          color: white;
        }
        .header img {
          max-width: 120px;
          margin-bottom: 10px;
        }
        .content {
          padding: 30px;
          text-align: center;
        }
        .code {
          display: inline-block;
          font-size: 28px;
          font-weight: bold;
          color: #1a1f36;
          background-color: #e6f0fa;
          padding: 15px 25px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .footer {
          background-color: #f0f2f5;
          text-align: center;
          padding: 15px;
          font-size: 12px;
          color: #555555;
        }
        a.button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 25px;
          background: linear-gradient(90deg, #4fc3f7, #0288d1);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="MeetUs Logo">
          <h1>MeetUs</h1>
        </div>
        <div class="content">
          <h2>Hello!</h2>
          <p>Thank you for signing up for <strong>MeetUs</strong>. Use the verification code below to confirm your email address:</p>
          <div class="code">${code}</div>
          <p>If you didn't request this, please ignore this email.</p>
          <a class="button" href="https://www.meetus.com">Visit MeetUs</a>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} MeetUs. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    `,
  
};



  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = sendVerificationCode;
