require("dotenv").config({ path: "../.env" });
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

    const admin = await User.create({
      name: "Aarchi Shah",
      email: "aarchi.shah2005@gmail.com",
      password: "aarchi123",
      role: "admin",
    });

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
    // All new fields demonstrated:
    //   groupName          — Enhancement 5 (Business Group)
    //   additionalContacts — Enhancement 3 (Multiple contacts)
    //   factoryAddress     — Enhancement 4 (Factory address)
    //   city               — Enhancement 1 (Location filter)
    //   bankName / sanctionDate / amount — Enhancement 2
    //     (only populated when sanction: true)
    // ═══════════════════════════════════════════════════════════

    const sampleLeads = [

      // ─────────────────────────────────────────────────────────
      // SWAYAM'S LEADS (8 leads)
      // Demonstrates: Patel Group (3 companies), factory address,
      //               multiple contacts, banking gated by sanction
      // ─────────────────────────────────────────────────────────

      {
        assignedTo: sales1._id,
        visitDate: new Date("2024-01-15"),
        callingDate: new Date("2024-01-10"),
        followUpDate: new Date("2024-01-20"),

        // Enhancement 5: group tag
        groupName: "Patel Group",

        firmName: "Gujarat Steel Industries",
        personName: "Rakesh Mehta",
        designation: "Managing Director",
        mobileNo: "+91 98765 43210",
        email: "rakesh@gsi.com",

        // Enhancement 3: additional contacts
        additionalContacts: [
          {
            personName: "Neha Mehta",
            designation: "Finance Manager",
            mobileNo: "+91 98765 11111",
            email: "neha@gsi.com",
          },
        ],

        // Company address + city (Enhancement 1)
        areaEstate: "GIDC Phase 2",
        address: "Plot No. 45, Vatva GIDC",
        city: "Ahmedabad",
        district: "Ahmedabad",
        state: "Gujarat",
        pincode: "382445",

        // Enhancement 4: factory address
        factoryAddress: {
          areaEstate: "Vatva Industrial Estate",
          address: "Survey No. 78, Vatva",
          city: "Ahmedabad",
          district: "Ahmedabad",
          state: "Gujarat",
          pincode: "382440",
        },

        industry: "Steel Manufacturing",
        segment: "Heavy Industry",
        constitution: "Private Limited",
        machine: "CNC Lathe Machine",
        remark: "Interested in machinery loan for expansion",
        visitType: "office",

        // Enhancement 2: sanction true → banking details filled
        sanction: true,
        bankName: "State Bank of India",
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

        // Enhancement 5: same Patel Group
        groupName: "Patel Group",

        firmName: "Patel Polymer Works",
        personName: "Suresh Patel",
        designation: "Owner",
        mobileNo: "+91 98123 45678",
        email: "suresh@patelpoly.com",

        // Enhancement 3: two additional contacts
        additionalContacts: [
          {
            personName: "Amit Patel",
            designation: "Production Head",
            mobileNo: "+91 98123 22222",
            email: "amit@patelpoly.com",
          },
          {
            personName: "Sunita Patel",
            designation: "Accounts",
            mobileNo: "+91 98123 33333",
            email: "",
          },
        ],

        city: "Rajkot",
        district: "Rajkot",
        state: "Gujarat",

        // Enhancement 4: factory in different location
        factoryAddress: {
          areaEstate: "Aji GIDC",
          address: "Plot B-24, Aji GIDC",
          city: "Rajkot",
          district: "Rajkot",
          state: "Gujarat",
          pincode: "360003",
        },

        industry: "Automobile Parts",
        constitution: "Partnership",
        machine: "Hydraulic Press",
        visitType: "meeting",

        // Enhancement 2: sanction false → no banking fields
        sanction: false,

        projectType: "loan",
        projectStatus: "Under Review",
        ansClientType: "ans_client",
      },

      {
        assignedTo: sales1._id,
        visitDate: new Date("2024-01-22"),
        callingDate: new Date("2024-01-20"),

        // Enhancement 5: third company in Patel Group
        groupName: "Patel Group",

        firmName: "Patel Textile Mills",
        personName: "Kiran Shah",
        designation: "Director",
        mobileNo: "+91 99876 54321",

        areaEstate: "Narol Industrial Area",
        address: "Survey No. 120",
        city: "Ahmedabad",
        district: "Ahmedabad",
        state: "Gujarat",
        pincode: "382405",

        factoryAddress: {
          areaEstate: "Narol GIDC",
          address: "Block C, Narol GIDC",
          city: "Ahmedabad",
          district: "Ahmedabad",
          state: "Gujarat",
          pincode: "382405",
        },

        industry: "Textile",
        segment: "Processing",
        constitution: "Private Limited",
        machine: "Dyeing Machine",

        // Enhancement 2: sanction false → no banking
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

        additionalContacts: [
          {
            personName: "Dr. Rohit Desai",
            designation: "R&D Head",
            mobileNo: "+91 97234 99999",
            email: "rohit@pharmasolutions.com",
          },
        ],

        city: "Vadodara",
        district: "Vadodara",
        state: "Gujarat",

        factoryAddress: {
          areaEstate: "Savli Industrial Area",
          address: "Plot No. 12, Savli GIDC",
          city: "Vadodara",
          district: "Vadodara",
          state: "Gujarat",
          pincode: "391770",
        },

        industry: "Pharmaceutical",
        constitution: "Private Limited",
        visitType: "meeting",

        // Enhancement 2: sanctioned → banking filled
        sanction: true,
        bankName: "ICICI Bank",
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
        city: "Surat",
        district: "Surat",
        state: "Gujarat",
        industry: "Renewable Energy",
        constitution: "LLP",

        sanction: false,

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
        city: "Anand",
        district: "Anand",
        state: "Gujarat",
        industry: "Food Processing",
        machine: "Packaging Unit",
        visitType: "office",

        // Enhancement 2: sanction false → no bank details
        sanction: false,

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
        city: "Vapi",
        district: "Vapi",
        state: "Gujarat",
        industry: "Chemical",
        constitution: "Private Limited",
        visitType: "office",

        sanction: false,

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
        city: "Gandhinagar",
        district: "Gandhinagar",
        state: "Gujarat",
        industry: "Plastic Manufacturing",
        machine: "Injection Molding Machine",

        sanction: false,

        projectType: "subsidy",
        ansClientType: "other",
      },

      // ─────────────────────────────────────────────────────────
      // SHUBHAM'S LEADS (7 leads)
      // Demonstrates: Shah Packaging Group (3 companies),
      //               mixed sanction status
      // ─────────────────────────────────────────────────────────

      {
        assignedTo: sales2._id,
        visitDate: new Date("2024-01-12"),
        callingDate: new Date("2024-01-08"),
        followUpDate: new Date("2024-01-25"),

        // Enhancement 5: Shah Packaging Group
        groupName: "Shah Packaging Group",

        firmName: "Diamond Cutting Works",
        personName: "Jayesh Patel",
        designation: "Owner",
        mobileNo: "+91 98234 56789",
        email: "jayesh@diamondworks.com",

        additionalContacts: [
          {
            personName: "Bhavna Patel",
            designation: "Operations Manager",
            mobileNo: "+91 98234 77777",
            email: "bhavna@diamondworks.com",
          },
        ],

        areaEstate: "Diamond Market",
        address: "Shop No. 23, Varachha",
        city: "Surat",
        district: "Surat",
        state: "Gujarat",
        pincode: "395006",

        factoryAddress: {
          areaEstate: "Sachin GIDC",
          address: "Plot D-56, Sachin GIDC",
          city: "Surat",
          district: "Surat",
          state: "Gujarat",
          pincode: "394230",
        },

        industry: "Diamond Processing",
        segment: "Gems & Jewelry",
        constitution: "Partnership",
        machine: "Laser Cutting Machine",
        remark: "Needs working capital",
        visitType: "office",

        // Enhancement 2: sanctioned
        sanction: true,
        bankName: "Punjab National Bank",
        sanctionDate: new Date("2024-02-10"),
        amount: 4500000,

        projectType: "loan",
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",
      },

      {
        assignedTo: sales2._id,
        visitDate: new Date("2024-01-20"),

        // Enhancement 5: same Shah Packaging Group
        groupName: "Shah Packaging Group",

        firmName: "Shah Packaging Solutions",
        personName: "Nisha Gupta",
        designation: "Director",
        mobileNo: "+91 99234 56789",

        city: "Morbi",
        district: "Morbi",
        state: "Gujarat",

        industry: "Packaging",
        constitution: "Private Limited",
        visitType: "meeting",

        // Enhancement 2: not sanctioned → no bank details
        sanction: false,

        projectType: "loan",
        projectStatus: "Documentation Pending",
        ansClientType: "ans_client",
      },

      {
        assignedTo: sales2._id,
        visitDate: new Date("2024-01-28"),

        // Enhancement 5: third in Shah Packaging Group
        groupName: "Shah Packaging Group",

        firmName: "Shah Packaging Collection",
        personName: "Sanjay Shah",
        designation: "Managing Partner",
        mobileNo: "+91 98345 11111",

        city: "Morbi",
        district: "Morbi",
        state: "Gujarat",

        additionalContacts: [
          {
            personName: "Priya Shah",
            designation: "Sales Head",
            mobileNo: "+91 98345 22222",
            email: "priya@shahcollection.com",
          },
        ],

        industry: "Packaging",
        constitution: "Partnership",

        // Enhancement 2: sanctioned
        sanction: true,
        bankName: "Canara Bank",
        sanctionDate: new Date("2024-02-20"),
        amount: 6000000,

        projectType: "loan",
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",
      },

      {
        assignedTo: sales2._id,
        visitDate: new Date("2024-02-01"),
        firmName: "Paper Products Ltd",
        personName: "Sanjay Mehta",
        designation: "CEO",
        mobileNo: "+91 98345 67890",
        city: "Valsad",
        district: "Valsad",
        state: "Gujarat",
        industry: "Paper Manufacturing",

        sanction: false,

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
        city: "Bharuch",
        district: "Bharuch",
        state: "Gujarat",
        industry: "Agriculture",
        machine: "Grain Processing Unit",

        sanction: false,

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
        city: "Mehsana",
        district: "Mehsana",
        state: "Gujarat",
        industry: "Electrical",
        visitType: "office",

        sanction: false,

        projectType: "loan",
        ansClientType: "ans_client",
      },

      // ─────────────────────────────────────────────────────────
      // AAGAM'S LEADS (5 leads)
      // Demonstrates: standalone companies (no group),
      //               one sanctioned, factory addresses
      // ─────────────────────────────────────────────────────────

      {
        assignedTo: sales3._id,
        visitDate: new Date("2024-01-25"),
        callingDate: new Date("2024-01-22"),

        firmName: "Rubber Products Ltd",
        personName: "Mohan Das",
        designation: "Managing Partner",
        mobileNo: "+91 97456 78901",
        email: "mohan@rubberproducts.com",

        additionalContacts: [
          {
            personName: "Sunil Das",
            designation: "Plant Manager",
            mobileNo: "+91 97456 55555",
            email: "",
          },
        ],

        city: "Junagadh",
        district: "Junagadh",
        state: "Gujarat",

        factoryAddress: {
          areaEstate: "Junagadh GIDC",
          address: "Plot No. 88, Junagadh GIDC",
          city: "Junagadh",
          district: "Junagadh",
          state: "Gujarat",
          pincode: "362001",
        },

        industry: "Rubber Manufacturing",
        constitution: "Partnership",
        machine: "Molding Press",
        visitType: "office",

        // Enhancement 2: not sanctioned → no bank fields
        sanction: false,

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
        city: "Bharuch",
        district: "Bharuch",
        state: "Gujarat",
        industry: "Glass",

        sanction: false,

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
        city: "Surendranagar",
        district: "Surendranagar",
        state: "Gujarat",
        industry: "Metal Fabrication",

        sanction: false,

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
        city: "Ahmedabad",
        district: "Ahmedabad",
        state: "Gujarat",
        industry: "Printing",
        machine: "Digital Printing Press",
        visitType: "meeting",

        // Enhancement 2: sanctioned → banking filled
        sanction: true,
        bankName: "Bank of India",
        sanctionDate: new Date("2024-03-01"),
        amount: 3000000,

        projectType: "loan",
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",
      },

      {
        assignedTo: sales3._id,
        visitDate: new Date("2024-02-19"),
        firmName: "Packaging Solutions Pvt Ltd",
        personName: "Neha Kapoor",
        designation: "Managing Director",
        mobileNo: "+91 98789 01234",
        city: "Surat",
        district: "Surat",
        state: "Gujarat",
        industry: "Packaging",

        sanction: false,

        projectType: "subsidy",
        ansClientType: "other",
      },

      // ─────────────────────────────────────────────────────────
      // ADMIN LEAD (added by Aarchi directly)
      // ─────────────────────────────────────────────────────────
      {
        assignedTo: admin._id,
        visitDate: new Date("2024-03-01"),

        groupName: "Patel Group",

        firmName: "Patel Exports Pvt Ltd",
        personName: "Mahesh Patel",
        designation: "Chairman",
        mobileNo: "+91 99999 00001",
        email: "mahesh@patelexports.com",

        additionalContacts: [
          {
            personName: "Hiral Patel",
            designation: "Export Manager",
            mobileNo: "+91 99999 00002",
            email: "hiral@patelexports.com",
          },
        ],

        areaEstate: "GIDC Sector 28",
        address: "Unit 5, GIDC Sector 28",
        city: "Gandhinagar",
        district: "Gandhinagar",
        state: "Gujarat",
        pincode: "382028",

        factoryAddress: {
          areaEstate: "Changodar GIDC",
          address: "Plot C-12, Changodar",
          city: "Ahmedabad",
          district: "Ahmedabad",
          state: "Gujarat",
          pincode: "382213",
        },

        industry: "Export",
        constitution: "Private Limited",
        visitType: "office",

        sanction: true,
        bankName: "HDFC Bank",
        sanctionDate: new Date("2024-03-10"),
        amount: 12000000,

        projectType: "loan",
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",
      },
    ];

    // Assign srNo sequentially
    sampleLeads.forEach((lead, i) => {
      lead.srNo = i + 1;
    });

    await Lead.insertMany(sampleLeads);
    console.log(`✓ Created ${sampleLeads.length} sample leads`);

    // ═══════════════════════════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════════════════════════
    const sanctioned   = sampleLeads.filter((l) => l.sanction).length;
    const loans        = sampleLeads.filter((l) => l.projectType === "loan").length;
    const subsidies    = sampleLeads.filter((l) => l.projectType === "subsidy").length;
    const withGroup    = sampleLeads.filter((l) => l.groupName).length;
    const withFactory  = sampleLeads.filter((l) => l.factoryAddress?.address).length;
    const withContacts = sampleLeads.filter((l) => l.additionalContacts?.length > 0).length;

    console.log("\n════════════════════════════════════════════════");
    console.log("  ✓ SEED COMPLETED SUCCESSFULLY");
    console.log("════════════════════════════════════════════════");
    console.log("\nLOGIN CREDENTIALS:");
    console.log("──────────────────────────────────────────────");
    console.log("ADMIN:");
    console.log(`  Name:     Aarchi Shah`);
    console.log(`  Email:    aarchi.shah2005@gmail.com`);
    console.log(`  Password: aarchi123`);
    console.log("\nSALES TEAM:");
    console.log("  1. Swayam Shah");
    console.log("     Email:    swayam.shah2010@gmail.com");
    console.log("     Password: swayam123");
    console.log("     Leads:    8");
    console.log("\n  2. Shubham Shah");
    console.log("     Email:    shubham.shah2003@gmail.com");
    console.log("     Password: shubham123");
    console.log("     Leads:    7");
    console.log("\n  3. Aagam Shah");
    console.log("     Email:    aagam.shah2007@gmail.com");
    console.log("     Password: aagam123");
    console.log("     Leads:    5");
    console.log("\n──────────────────────────────────────────────");
    console.log(`TOTAL LEADS:               ${sampleLeads.length}`);
    console.log(`  Sanctioned (banking set): ${sanctioned}`);
    console.log(`  Not Sanctioned:           ${sampleLeads.length - sanctioned}`);
    console.log(`  Loan:                     ${loans}`);
    console.log(`  Subsidy:                  ${subsidies}`);
    console.log("\nNEW FIELDS COVERAGE:");
    console.log(`  With Business Group:      ${withGroup}  (Patel Group x4, Shah Packaging Group x3)`);
    console.log(`  With Factory Address:     ${withFactory}`);
    console.log(`  With Extra Contacts:      ${withContacts}`);
    console.log("\nBUSINESS GROUPS:");
    console.log("  Patel Group         → Gujarat Steel, Patel Polymer, Patel Textile, Patel Exports");
    console.log("  Shah Packaging Group → Diamond Cutting, Shah Packaging Solutions, Shah Packaging Collection");
    console.log("════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("✗ Seed error:", error.message);
    process.exit(1);
  }
};

seedData();