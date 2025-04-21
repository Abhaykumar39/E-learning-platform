import { createTransport } from "nodemailer";

const sendMail = async (email, subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OTP Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .container {
      background-color: #ffffff;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 400px;
      width: 90%;
      animation: fadeIn 0.5s ease-in-out;
    }
    h1 {
      color: #5a3eab;
      font-size: 28px;
      margin-bottom: 10px;
    }
    p {
      color: #555;
      font-size: 16px;
      margin-bottom: 20px;
    }
    .otp {
      font-size: 42px;
      color: #ff4081;
      letter-spacing: 6px;
      font-weight: bold;
      background: #f3f3f3;
      padding: 15px 0;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    .footer {
      font-size: 12px;
      color: #aaa;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>OTP Verification</h1>
    <p>Hello <strong>${data.name}</strong>, your one-time password for verifying your account is:</p>
    <div class="otp">${data.otp}</div>
    <p class="footer">This code will expire in 10 minutes. Do not share it with anyone.</p>
  </div>
</body>
</html>`;

  await transport.sendMail({
    from: process.env.Gmail,
    to: email,
    subject,
    html,
  });
};

export default sendMail;
