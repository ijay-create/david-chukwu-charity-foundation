const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./models/User");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log("MongoDB connected.");

    const adminEmail =
      "admin@davidchukwu.org";

    const adminPassword =
      "Admin@2024";

    const existingAdmin =
      await User.findOne({
        email: adminEmail
      });

    if (existingAdmin) {
      console.log(
        "Admin user already exists."
      );

      await mongoose.connection.close();

      return;
    }

    const hashedPassword =
      await bcrypt.hash(
        adminPassword,
        12
      );

    const admin = await User.create({
      email: adminEmail,
      password: hashedPassword,
      role: "admin"
    });

    console.log(
      "Admin user created successfully."
    );

    console.log(
      `Email: ${admin.email}`
    );

    console.log(
      "Password: Admin@2024"
    );

    await mongoose.connection.close();
  } catch (error) {
    console.error(
      "Admin seeding failed:",
      error.message
    );

    process.exit(1);
  }
};

seedAdmin();