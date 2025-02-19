import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_TOKEN,
  jwt_refresh_secret: process.env.JWT_REFRESH_TOKEN,
  jwt_access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  jwt_refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  email_host: process.env.EMAIL_HOST,
  email_port: process.env.EMAIL_PORT,
  email_address: process.env.EMAIL_USER_ADDRESS,
  email_password: process.env.EMAIL_USER_PASS,
};
