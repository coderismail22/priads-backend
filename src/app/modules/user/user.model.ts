import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
// import config from "../../config";
import { IUser, UserModel } from "./user.interface";
import { STATUS } from "./user.constant";
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0, // makes invisible while finding
    },
    passwordChangedAt: {
      type: Date,
    },

    role: {
      type: String,
      enum: ["superAdmin", "student", "faculty", "admin"],
    },
    status: {
      type: String,
      enum: STATUS,
      default: "in-progress",
    },
    // OTP
    verificationCode: String,
    otpExpiresAt: Date,
    lastOtpSentAt: Date, // To handle resend delay
    isVerified: { type: Boolean, default: false },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// userSchema.pre("save", async function (next) {
//   // eslint-disable-next-line @typescript-eslint/no-this-alias
//   const user = this; // doc
//   // hashing password and save into DB
//   user.password = await bcrypt.hash(
//     user.password,
//     Number(config.bcrypt_salt_rounds),
//   );
//   next();
// });

// set '' after saving password
// userSchema.post("save", function (doc, next) {
//   doc.password = "";
//   next();
// });

// statics 👇
// doesUserExistByCustomId
userSchema.statics.doesUserExistByCustomId = async function (id: string) {
  return await User.findOne({ id }).select("+password"); // find with custom id +  explicit selection
};

// doPasswordsMatch
userSchema.statics.doPasswordsMatch = async function (
  plaintextPassword,
  hashedPassword,
) {
  return bcrypt.compare(plaintextPassword, hashedPassword);
};

// isUserDeleted
// userSchema.statics.isUserDeleted = async function (id: string) {
//   return;
// };

// TODO: isJWTIssuedAtBeforeChangingPassword 👇
// userSchema.statics.isJWTIssuedAtBeforeChangingPassword = async function (
//   jwtIssuedAtTimeStamp: string,
//   passwordChangedAtTimeStamp: Date,
// ) {
//   //covert date(passwordChangedAtTimeStamp) to milliseconds

//   const convertedPasswordChangedAtTimeStamp =
//     new Date(passwordChangedAtTimeStamp).getTime() / 1000;

//   const convertedJwtIssuedAtTimeStamp = parseInt(jwtIssuedAtTimeStamp);

//   const isJWTIssuedAtBeforeChangingPassword =
//     convertedJwtIssuedAtTimeStamp < convertedPasswordChangedAtTimeStamp;
//   return isJWTIssuedAtBeforeChangingPassword;
// };

export const User = model<IUser, UserModel>("User", userSchema);
