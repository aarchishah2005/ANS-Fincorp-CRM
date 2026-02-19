require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Lead = require("../models/Lead");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log("✓ Cleared existing data");

    // ═══════════════════════════════════════════════════════════
    // CREATE USERS
    // ═══════════════════════════════════════════════════════════
    
    // 1. Admin
    const admin = await User.create({
      name: "Aarchi Shah",
      email: "aarchi.shah2005@gmail.com",
      password: "aarchi123",
      role: "admin",
    });

    // 2-4. Sales Team
    const sales1 = await User.create({
      name: "Swayam Shah",
      email: "swayam.shah2010@gmail.com",
      password: "swayam123",
      role: "sales",
    });

    const sales2 = await User.create({
      name: "Shubham Shah",
      email: "shubham.shah2003@gmail.com",
      password: "shubham123",
      role: "sales",
    });

    const sales3 = await User.create({
      name: "Aagam Shah",
      email: "aagam.shah2007@gmail.com",
      password: "aagam123",
      role: "sales",
    });

    console.log("✓ Created 4 users (1 admin, 3 sales)");

    // ═══════════════════════════════════════════════════════════
    // CREATE SAMPLE LEADS
    // ═══════════════════════════════════════════════════════════

    const sampleLeads = [
      // Rajesh's Leads (8 leads)
      {
        assignedTo: sales1._id,
        visitDate: new Date("2024-01-15"),
        callingDate: new Date("2024-01-10"),
        followUpDate: new Date("2024-01-20"),
        firmName: "Gujarat Steel Industries",
        personName: "Rakesh Mehta",
        designation: "Managing Director",
        mobileNo: "+91 98765 43210",
        email: "rakesh@gsi.com",
        areaEstate: "GIDC Phase 2",
        address: "Plot No. 45, Vatva GIDC",
        district: "Ahmedabad",
        state: "Gujarat",
        pincode: "382445",
        industry: "Steel Manufacturing",
        segment: "Heavy Industry",
        constitution: "Private Limited",
        machine: "CNC Lathe Machine",
        remark: "Interested in machinery loan for expansion",
        bankName: "State Bank of India",
        visitType: "office",
        sanction: true,
        sanctionDate: new Date("2024-02-01"),
        amount: 5000000,
        meetingScheduled: false,
        projectType: "loan",
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",
      },
      {
        assignedTo: sales1._id,
        visitDate: new Date("2024-01-18"),
        firmName: "Precision Auto Parts",
        personName: "Suresh Patel",
        designation: "Owner",
        mobileNo: "+91 98123 45678",
        email: "suresh@precisionauto.com",
        district: "Rajkot",
        state: "Gujarat",
        industry: "Automobile Parts",
        constitution: "Partnership",
        machine: "Hydraulic Press",
        bankName: "HDFC Bank",
        visitType: "meeting",
        sanction: false,
        amount: 2000000,
        projectType: "loan",
        projectStatus: "Under Review",
        ansClientType: "ans_client",
      },
      {
        assignedTo: sales1._id,
        visitDate: new Date("2024-01-22"),
        callingDate: new Date("2024-01-20"),
        firmName: "Textile Processors Ltd",
        personName: "Kiran Shah",
        designation: "Director",
        mobileNo: "+91 99876 54321",
        areaEstate: "Narol Industrial Area",
        address: "Survey No. 120",
        district: "Ahmedabad",
        state: "Gujarat",
        pincode: "382405",
        industry: "Textile",
        segment: "Processing",
        constitution: "Private Limited",
        machine: "Dyeing Machine",
        bankName: "Bank of Baroda",
        visitType: "office",
        sanction: false,
        projectType: "subsidy",
        projectStatus: "Documentation Pending",
        ansClientType: "other",
      },
      {
        assignedTo: sales1._id,
        visitDate: new Date("2024-02-05"),
        firmName: "Pharma Solutions Pvt Ltd",
        personName: "Dr. Anjali Desai",
        designation: "CEO",
        mobileNo: "+91 97234 56789",
        email: "anjali@pharmasolutions.com",
        district: "Vadodara",
        state: "Gujarat",
        industry: "Pharmaceutical",
        constitution: "Private Limited",
        bankName: "ICICI Bank",
        visitType: "meeting",
        sanction: true,
        sanctionDate: new Date("2024-02-15"),
        amount: 8000000,
        meetingScheduled: true,
        meetingDate: new Date("2024-02-20"),
        projectType: "loan",
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",
      },
      {
        assignedTo: sales1._id,
        visitDate: new Date("2024-02-10"),
        firmName: "Green Energy Systems",
        personName: "Vikram Singh",
        designation: "Founder",
        mobileNo: "+91 98234 67890",
        district: "Surat",
        state: "Gujarat",
        industry: "Renewable Energy",
        constitution: "LLP",
        projectType: "subsidy",
        projectStatus: "In Progress",
        ansClientType: "other",
      },
      {
        assignedTo: sales1._id,
        visitDate: new Date("2024-02-12"),
        firmName: "Food Processing Co",
        personName: "Meena Joshi",
        designation: "Managing Partner",
        mobileNo: "+91 99123 45678",
        district: "Anand",
        state: "Gujarat",
        industry: "Food Processing",
        machine: "Packaging Unit",
        bankName: "Axis Bank",
        visitType: "office",
        amount: 3500000,
        projectType: "loan",
        projectStatus: "Under Review",
        ansClientType: "ans_client",
      },
      {
        assignedTo: sales1._id,
        visitDate: new Date("2024-02-15"),
        firmName: "Chemical Industries Ltd",
        personName: "Harish Rao",
        designation: "Director",
        mobileNo: "+91 98765 12345",
        district: "Vapi",
        state: "Gujarat",
        industry: "Chemical",
        constitution: "Private Limited",
        visitType: "office",
        projectType: "loan",
        ansClientType: "ans_client",
      },
      {
        assignedTo: sales1._id,
        visitDate: new Date("2024-02-16"),
        firmName: "Plastic Molding Works",
        personName: "Ramesh Verma",
        designation: "Proprietor",
        mobileNo: "+91 97123 45678",
        district: "Gandhinagar",
        state: "Gujarat",
        industry: "Plastic Manufacturing",
        machine: "Injection Molding Machine",
        projectType: "subsidy",
        ansClientType: "other",
      },

      // Priya's Leads (7 leads)
      {
        assignedTo: sales2._id,
        visitDate: new Date("2024-01-12"),
        callingDate: new Date("2024-01-08"),
        followUpDate: new Date("2024-01-25"),
        firmName: "Diamond Cutting Works",
        personName: "Jayesh Patel",
        designation: "Owner",
        mobileNo: "+91 98234 56789",
        email: "jayesh@diamondworks.com",
        areaEstate: "Diamond Market",
        address: "Shop No. 23, Varachha",
        district: "Surat",
        state: "Gujarat",
        pincode: "395006",
        industry: "Diamond Processing",
        segment: "Gems & Jewelry",
        constitution: "Partnership",
        machine: "Laser Cutting Machine",
        remark: "Needs working capital",
        bankName: "Punjab National Bank",
        visitType: "office",
        sanction: true,
        sanctionDate: new Date("2024-02-10"),
        amount: 4500000,
        projectType: "loan",
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",
      },
      {
        assignedTo: sales2._id,
        visitDate: new Date("2024-01-20"),
        firmName: "Ceramic Tiles Pvt Ltd",
        personName: "Nisha Gupta",
        designation: "Director",
        mobileNo: "+91 99234 56789",
        district: "Morbi",
        state: "Gujarat",
        industry: "Ceramic",
        constitution: "Private Limited",
        bankName: "Canara Bank",
        visitType: "meeting",
        amount: 6000000,
        projectType: "loan",
        projectStatus: "Documentation Pending",
        ansClientType: "ans_client",
      },
      {
        assignedTo: sales2._id,
        visitDate: new Date("2024-02-01"),
        firmName: "Paper Products Ltd",
        personName: "Sanjay Mehta",
        designation: "CEO",
        mobileNo: "+91 98345 67890",
        district: "Valsad",
        state: "Gujarat",
        industry: "Paper Manufacturing",
        projectType: "subsidy",
        ansClientType: "other",
      },
      {
        assignedTo: sales2._id,
        visitDate: new Date("2024-02-08"),
        firmName: "Agro Processing Unit",
        personName: "Kavita Rane",
        designation: "Managing Director",
        mobileNo: "+91 97345 67890",
        district: "Bharuch",
        state: "Gujarat",
        industry: "Agriculture",
        machine: "Grain Processing Unit",
        projectType: "subsidy",
        projectStatus: "In Progress",
        ansClientType: "ans_client",
      },
      {
        assignedTo: sales2._id,
        visitDate: new Date("2024-02-14"),
        firmName: "Electrical Components Co",
        personName: "Arun Kumar",
        designation: "Partner",
        mobileNo: "+91 98456 78901",
        district: "Mehsana",
        state: "Gujarat",
        industry: "Electrical",
        visitType: "office",
        projectType: "loan",
        ansClientType: "ans_client",
      },
      {
        assignedTo: sales2._id,
        visitDate: new Date("2024-02-17"),
        firmName: "Engineering Solutions",
        personName: "Deepak Shah",
        designation: "Director",
        mobileNo: "+91 99456 78901",
        district: "Rajkot",
        state: "Gujarat",
        industry: "Engineering",
        projectType: "loan",
        ansClientType: "other",
      },
      {
        assignedTo: sales2._id,
        visitDate: new Date("2024-02-18"),
        firmName: "Furniture Manufacturing",
        personName: "Pooja Jain",
        designation: "Owner",
        mobileNo: "+91 98567 89012",
        district: "Ahmedabad",
        state: "Gujarat",
        industry: "Furniture",
        machine: "CNC Router",
        projectType: "loan",
        ansClientType: "ans_client",
      },

      // Amit's Leads (5 leads)
      {
        assignedTo: sales3._id,
        visitDate: new Date("2024-01-25"),
        callingDate: new Date("2024-01-22"),
        firmName: "Rubber Products Ltd",
        personName: "Mohan Das",
        designation: "Managing Partner",
        mobileNo: "+91 97456 78901",
        email: "mohan@rubberproducts.com",
        district: "Junagadh",
        state: "Gujarat",
        industry: "Rubber Manufacturing",
        constitution: "Partnership",
        machine: "Molding Press",
        bankName: "Union Bank",
        visitType: "office",
        sanction: false,
        amount: 2500000,
        projectType: "loan",
        projectStatus: "Under Review",
        ansClientType: "ans_client",
      },
      {
        assignedTo: sales3._id,
        visitDate: new Date("2024-02-03"),
        firmName: "Glass Manufacturing Co",
        personName: "Ravi Thakur",
        designation: "Director",
        mobileNo: "+91 98678 90123",
        district: "Bharuch",
        state: "Gujarat",
        industry: "Glass",
        projectType: "subsidy",
        ansClientType: "other",
      },
      {
        assignedTo: sales3._id,
        visitDate: new Date("2024-02-11"),
        firmName: "Metal Fabrication Works",
        personName: "Geeta Yadav",
        designation: "Owner",
        mobileNo: "+91 99678 90123",
        district: "Surendranagar",
        state: "Gujarat",
        industry: "Metal Fabrication",
        projectType: "loan",
        ansClientType: "ans_client",
      },
      {
        assignedTo: sales3._id,
        visitDate: new Date("2024-02-13"),
        firmName: "Printing Press Pvt Ltd",
        personName: "Ramesh Iyer",
        designation: "CEO",
        mobileNo: "+91 97678 90123",
        district: "Ahmedabad",
        state: "Gujarat",
        industry: "Printing",
        machine: "Digital Printing Press",
        bankName: "Bank of India",
        visitType: "meeting",
        amount: 3000000,
        projectType: "loan",
        ansClientType: "ans_client",
      },
      {
        assignedTo: sales3._id,
        visitDate: new Date("2024-02-19"),
        firmName: "Packaging Solutions",
        personName: "Neha Kapoor",
        designation: "Managing Director",
        mobileNo: "+91 98789 01234",
        district: "Surat",
        state: "Gujarat",
        industry: "Packaging",
        projectType: "subsidy",
        ansClientType: "other",
      },
    ];

    // Add srNo to each lead
    for (let i = 0; i < sampleLeads.length; i++) {
      sampleLeads[i].srNo = i + 1;
    }

    await Lead.insertMany(sampleLeads);
    console.log(`✓ Created ${sampleLeads.length} sample leads`);

    // ═══════════════════════════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════════════════════════
    console.log("\n════════════════════════════════════════════════");
    console.log("  ✓ SEED COMPLETED SUCCESSFULLY");
    console.log("════════════════════════════════════════════════");
    console.log("\nLOGIN CREDENTIALS:");
    console.log("──────────────────────────────────────────────");
    console.log("ADMIN:");
    console.log("  Email:    admin@crm.com");
    console.log("  Password: admin123");
    console.log("\nSALES TEAM:");
    console.log("  1. Rajesh Kumar");
    console.log("     Email:    rajesh@crm.com");
    console.log("     Password: sales123");
    console.log("     Leads:    8");
    console.log("\n  2. Priya Sharma");
    console.log("     Email:    priya@crm.com");
    console.log("     Password: sales123");
    console.log("     Leads:    7");
    console.log("\n  3. Amit Patel");
    console.log("     Email:    amit@crm.com");
    console.log("     Password: sales123");
    console.log("     Leads:    5");
    console.log("\nTOTAL LEADS: 20");
    console.log("  - Sanctioned: 3");
    console.log("  - Loan: 15");
    console.log("  - Subsidy: 5");
    console.log("════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("✗ Seed error:", error.message);
    process.exit(1);
  }
};

seedData();