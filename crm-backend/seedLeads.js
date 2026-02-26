// Dont use this file for seedLeads
// use seed file in utils folder 





// require("dotenv").config();
// const connectDB = require("./config/db");
// const Lead = require("./models/Lead");
// const User = require("./models/User");

// const seedLeads = async () => {
//   try {
//     await connectDB();

//     // Remove old leads
//     await Lead.deleteMany({});

//     // Fetch users
//     const admin = await User.findOne({ email: "aarchi.shah2005@gmail.com" });
//     const swayam = await User.findOne({ email: "swayam.shah2010@gmail.com" });
//     const jitubhai = await User.findOne({ email: "jitubhai@gmail.com" });

//     if (!admin || !swayam || !jitubhai) {
//       console.log("❌ Users not found. Run seedUsers.js first.");
//       process.exit();
//     }

//     const leads = [

//       // ================= ADMIN LEADS =================
//       {
//         srNo: 1,
//         assignedTo: admin._id,
//         visitDate: new Date(),
//         firmName: "Shah Industries",
//         personName: "Rajesh Shah",
//         designation: "Owner",
//         mobileNo: "9876543210",
//         email: "rajesh@shahindustries.com",
//         industry: "Manufacturing",
//         projectType: "loan",
//         amount: 1500000,
//         sanction: false,
//         remark: "Interested in machinery loan",
//       },
//       {
//         srNo: 2,
//         assignedTo: admin._id,
//         firmName: "Green Agro Pvt Ltd",
//         personName: "Manoj Patel",
//         mobileNo: "9123456789",
//         projectType: "subsidy",
//         sanction: true,
//         amount: 500000,
//         sanctionDate: new Date(),
//       },
//       {
//         srNo: 3,
//         assignedTo: admin._id,
//         firmName: "Partial Lead Example",
//         mobileNo: "9999999999",
//       },

//       // ================= SWAYAM LEADS =================
//       {
//         srNo: 4,
//         assignedTo: swayam._id,
//         visitDate: new Date(),
//         firmName: "Sunrise Textiles",
//         personName: "Kunal Mehta",
//         designation: "Director",
//         mobileNo: "8888888888",
//         industry: "Textile",
//         projectType: "loan",
//         amount: 2500000,
//         sanction: false,
//       },
//       {
//         srNo: 5,
//         assignedTo: swayam._id,
//         firmName: "Metro Traders",
//         personName: "Ravi Kumar",
//         mobileNo: "7777777777",
//         projectType: "subsidy",
//         sanction: true,
//         amount: 300000,
//       },
//       {
//         srNo: 6,
//         assignedTo: swayam._id,
//         firmName: "Only Basic Info Lead",
//         personName: "Unknown",
//       },

//       // ================= JITUBHAI LEADS =================
//       {
//         srNo: 7,
//         assignedTo: jitubhai._id,
//         visitDate: new Date(),
//         firmName: "Global Engineering",
//         personName: "Harish Solanki",
//         mobileNo: "6666666666",
//         industry: "Engineering",
//         projectType: "loan",
//         amount: 4000000,
//         sanction: true,
//       },
//       {
//         srNo: 8,
//         assignedTo: jitubhai._id,
//         firmName: "Shakti Enterprises",
//         personName: "Vijay Parmar",
//         mobileNo: "5555555555",
//         projectType: "subsidy",
//         sanction: false,
//       },
//       {
//         srNo: 9,
//         assignedTo: jitubhai._id,
//         firmName: "Minimal Data Lead",
//       },
//     ];

//     await Lead.insertMany(leads);

//     console.log("✅ 9 Leads seeded successfully!");
//     process.exit();
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

// seedLeads();
