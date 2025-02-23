export type TAdmin = {
  name: string;
  password: string;
  profileImg?: string;
  email: string;
  phone: string;
  isVerified?: boolean;
  role: "superAdmin" | "admin";
  status?: "in-progress" | "blocked";
  isDeleted?: boolean;
};
