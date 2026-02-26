// Dont use this file for seedUser
// use seed file in utils folder  

// require("dotenv").config();
// const connectDB = require("./config/db");
// const User = require("./models/User");

// const seedUsers = async () => {
//   try {
//     await connectDB();

//     await User.deleteMany({});

//     const admin1 = new User({
//       name: "Aarchi Shah",
//       email: "aarchi.shah2005@gmail.com",
//       password: "Aarchi@123",
//       role: "admin",
//     });

//     const sales = new User({
//       name: "Swayam Shah",
//       email: "swayam.shah2010@gmail.com",
//       password: "Swayam@123",
//       role: "sales",
//     });

//     const sales2 = new User({
//       name: "Jitubhai",
//       email: "jitubhai@gmail.com",
//       password: "Jitubhai@123",
//       role: "sales",
//     });

//     await admin1.save();   // triggers hashing
//     await sales.save();    // triggers hashing
//     await sales2.save();   // triggers hashing

//     console.log("✅ 3 Users seeded successfully with hashed passwords!");
//     process.exit();
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

// seedUsers();
