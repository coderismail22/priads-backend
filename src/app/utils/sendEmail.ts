import nodemailer from "nodemailer";
import config from "../config";

const sendEmail = async (
  recipientEmail: string,
  resetPasswordUILink: string,
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.NODE_ENV === "production", // true for port 465, false for other ports
    auth: {
      user: config.email_address,
      pass: config.email_password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: config.email_address, // list of receivers
    to: recipientEmail, // list of receivers
    subject: "Password reset link", // Subject line
    text: "Please change your password.", // plain text body
    html: `<p>Click <a href="${resetPasswordUILink}">here</a> to reset your password.</p>`,
  });
};

export default sendEmail;
