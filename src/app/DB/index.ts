import mongoose from "mongoose";
import config from "../config";
import { TAdmin } from "../modules/admin/admin.interface";
import { Admin } from "../modules/admin/admin.model";
import { USER_ROLE } from "../modules/user/user.constant";
import { User } from "../modules/user/user.model";

// For Admin Model
const superAdminData: TAdmin = {
  name: "admin",
  email: config.super_admin_email as string,
  password: config.super_admin_password as string,
  role: USER_ROLE.superAdmin,
  phone: "",
};

// For User Model
const superAdminUserData: TAdmin = {
  name: "admin",
  email: config.super_admin_email as string,
  password: config.super_admin_password as string,
  role: USER_ROLE.superAdmin,
  status: "in-progress",
  phone: "",
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if there is any existing super admin user
    const superAdminUser = await User.findOne({
      role: USER_ROLE.superAdmin,
    }).session(session);
    if (!superAdminUser) {
      await User.create([superAdminUserData], { session });
    }

    // Check if there is any existing super admin in Admin collection
    const superAdmin = await Admin.findOne({
      role: USER_ROLE.superAdmin,
    }).session(session);
    if (!superAdmin) {
      await Admin.create([superAdminData], { session });
    }

    // Commit the transaction if all operations are successful
    await session.commitTransaction();
    // console.log("Super admin seeded successfully.");
  } catch (error) {
    // Rollback the transaction in case of an error
    await session.abortTransaction();
    // console.error("Error seeding super admin:", error);
  } finally {
    // End the session
    session.endSession();
  }
};

export default seedSuperAdmin;
