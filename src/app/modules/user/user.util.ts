import nodemailer from "nodemailer";
import config from "../../config";
// import sendResponse from "../../utils/sendResponse";
// import catchAsync from "../../utils/catchAsync";
// import AppError from "../../errors/AppError";
// import httpStatus from "http-status";
  
// generateOTP
export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// sendVerificationEmail
export const sendVerificationEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.email_address,
      pass: config.email_password,
    },
    tls: {
      rejectUnauthorized: false, // Accept self-signed certificates
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
  });
};

// EJOBSIT has SPF and DKIM issue that's why can't use it now.
// export const sendVerificationEmail = async (email: string, otp: string) => {
//   console.log("email hit", email);

//   const transporter = nodemailer.createTransport({
//     host: "ejobsit.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: "auth@ejobsit.com",
//       pass: "=%-Zm1{XhEm*",
//     },
//     tls: {
//       rejectUnauthorized: false, // Accept self-signed certificates (not ideal for security)
//     },
//     logger: true,
//     debug: true,
//   });

//   const mailOptions = {
//     from: "auth@ejobsit.com",
//     to: "devismail22@gmail.com",
//     subject: "Your OTP Code",
//     text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
//     html: `<p>Your OTP code is: <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     return { message: "Email sent successfully!" };
//   } catch (error) {
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to send email",
//     );
//   }
// };
