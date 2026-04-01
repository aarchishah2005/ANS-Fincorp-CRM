require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const User = require("../models/User");
const Lead = require("../models/Lead");

// ── Dates in March / April 2026 ───────────────────────────────────────────
const mar = (d) => new Date(`2026-03-${String(d).padStart(2, "0")}`);
const apr = (d) => new Date(`2026-04-${String(d).padStart(2, "0")}`);
// Today = Apr 1, 2026
// followUpDate < today   → overdue reminder  [EC-12]
// followUpDate = Apr 1   → due-today         [EC-13]
// followUpDate > today   → upcoming          [EC-14]

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB");

    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log("✓ Cleared existing data");

    // ═══════════════════════════════════════════════════════════════════════
    // USERS
    // ═══════════════════════════════════════════════════════════════════════
    const admin = await User.create({
      name: "Aarchi Shah", email: "aarchi.shah2005@gmail.com",
      password: "aarchi123", role: "admin",
    });
    const sales1 = await User.create({
      name: "Swayam Shah", email: "swayam.shah2010@gmail.com",
      password: "swayam123", role: "sales",
    });
    const sales2 = await User.create({
      name: "Shubham Shah", email: "shubham.shah2003@gmail.com",
      password: "shubham123", role: "sales",
    });
    const sales3 = await User.create({
      name: "Aagam Shah", email: "aagam.shah2007@gmail.com",
      password: "aagam123", role: "sales",
    });
    console.log("✓ Created 4 users (1 admin, 3 sales)");

    // ═══════════════════════════════════════════════════════════════════════
    // EDGE CASES INDEX
    // [EC-1]  sanction:true  → bankName + sanctionDate + amount filled
    // [EC-2]  sanction:false → NO bank fields at all
    // [EC-3]  Multiple officeAddresses (2 offices)
    // [EC-4]  Multiple factoryAddresses (2 factories)
    // [EC-5]  office + factory both present
    // [EC-6]  No addresses (empty arrays)
    // [EC-7]  Factory only, no office
    // [EC-8]  3 additionalContacts
    // [EC-9]  Zero additionalContacts (primary only)
    // [EC-10] groupName set → group filter + linked view
    // [EC-11] groupName empty → standalone
    // [EC-12] followUpDate PAST → overdue reminder
    // [EC-13] followUpDate Apr 1 (TODAY) → due-today reminder
    // [EC-14] followUpDate FUTURE → upcoming reminder
    // [EC-15] callingDate PAST → overdue calling
    // [EC-16] visitDate FUTURE → upcoming scheduled visit
    // [EC-17] All 3 dates set
    // [EC-18] No dates at all
    // [EC-19] projectType: loan
    // [EC-20] projectType: subsidy
    // [EC-21] ansClientType: ans_client
    // [EC-22] ansClientType: other
    // [EC-23] visitType: office
    // [EC-24] visitType: meeting
    // [EC-25] All 11 banks from BANK_LIST covered
    // [EC-26] 4 companies in Patel Group
    // [EC-27] 3 companies in Shah Packaging Group
    // [EC-28] Large amount ₹1Cr+
    // [EC-29] Small amount ₹5L
    // [EC-30] No amount (unsanctioned)
    // [EC-31] Admin-created lead
    // [EC-32] Minimal lead (required fields only)
    // [EC-33] Full lead (every field filled)
    // [EC-34] Different state (Rajasthan + Maharashtra for filter test)
    // [EC-35] meetingScheduled + meetingDate set
    // ═══════════════════════════════════════════════════════════════════════

    const sampleLeads = [

      // ─────────────────────────────────────────────────────────────────
      // SWAYAM'S LEADS  (10 leads)
      // ─────────────────────────────────────────────────────────────────

      // Lead 1 ── [EC-1][EC-3][EC-4][EC-5][EC-8][EC-10][EC-12][EC-17][EC-19][EC-21][EC-23][EC-25][EC-28][EC-33][EC-35]
      // FULL LEAD: Patel Group, sanctioned Bank of Baroda, 2 offices + 2 factories,
      //            3 extra contacts, overdue followUp (Mar 10), ₹1.5 Cr
      {
        assignedTo:   sales1._id,
        visitDate:    mar(5),
        callingDate:  mar(3),
        followUpDate: mar(10),          // [EC-12] PAST → overdue

        groupName: "Patel Group",       // [EC-10]

        firmName:    "Gujarat Steel Industries Pvt Ltd",
        personName:  "Rakesh Mehta",
        designation: "Managing Director",
        mobileNo:    "+91 98765 43210",
        email:       "rakesh@gsi.com",

        additionalContacts: [           // [EC-8]
          { personName: "Neha Mehta",   designation: "Finance Manager", mobileNo: "+91 98765 11111", email: "neha@gsi.com" },
          { personName: "Vijay Sharma", designation: "Plant Head",      mobileNo: "+91 98765 22222", email: "vijay@gsi.com" },
          { personName: "Pooja Rathod", designation: "HR Manager",      mobileNo: "+91 98765 33333", email: "" },
        ],

        officeAddresses: [              // [EC-3] 2 offices
          { label: "Head Office",   areaEstate: "GIDC Phase 2", address: "Plot No. 45, Vatva GIDC",  city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "382445" },
          { label: "Branch Office", areaEstate: "CG Road",      address: "301, Sakar Complex",       city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "380009" },
        ],
        factoryAddresses: [             // [EC-4] 2 factories
          { label: "Unit 1", areaEstate: "Vatva GIDC",  address: "Survey No. 78, Vatva",        city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "382440" },
          { label: "Unit 2", areaEstate: "Sanand GIDC", address: "Plot F-22, Sanand GIDC",      city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "382110" },
        ],

        areaEstate: "GIDC Phase 2", city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "382445",

        industry: "Steel Manufacturing", segment: "Heavy Industry",
        constitution: "Private Limited", machine: "CNC Lathe Machine",
        remark: "Interested in expansion loan. Very keen client. Follow up immediately.",
        visitType: "office",            // [EC-23]

        sanction: true,                 // [EC-1]
        bankName: "Bank of Baroda",     // [EC-25] bank 1
        sanctionDate: mar(20),
        amount: 15000000,               // [EC-28] ₹1.5 Cr

        meetingScheduled: true,
        meetingDate: mar(25),           // [EC-35]

        projectType:   "loan",          // [EC-19]
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",    // [EC-21]
      },

      // Lead 2 ── [EC-2][EC-5][EC-9][EC-10][EC-13][EC-19][EC-21][EC-24][EC-30]
      // Patel Group, NOT sanctioned, followUp TODAY (Apr 1), meeting visit
      {
        assignedTo:   sales1._id,
        visitDate:    mar(12),
        callingDate:  mar(15),
        followUpDate: apr(1),           // [EC-13] TODAY

        groupName: "Patel Group",

        firmName:    "Patel Polymer Works",
        personName:  "Suresh Patel",
        designation: "Owner",
        mobileNo:    "+91 98123 45678",
        email:       "suresh@patelpoly.com",

        additionalContacts: [],         // [EC-9]

        officeAddresses: [
          { label: "Office", areaEstate: "Gondal Road", address: "12, Gondal Road, Opp. Bus Stand", city: "Rajkot", district: "Rajkot", state: "Gujarat", pincode: "360002" },
        ],
        factoryAddresses: [
          { label: "Plant A", areaEstate: "Aji GIDC", address: "Plot B-24, Aji GIDC", city: "Rajkot", district: "Rajkot", state: "Gujarat", pincode: "360003" },
        ],

        areaEstate: "Gondal Road", city: "Rajkot", district: "Rajkot", state: "Gujarat",

        industry: "Automobile Parts", constitution: "Partnership",
        machine: "Hydraulic Press",
        visitType: "meeting",           // [EC-24]

        sanction: false,                // [EC-2] [EC-30]

        projectType:   "loan",
        projectStatus: "Under Review",
        ansClientType: "ans_client",
      },

      // Lead 3 ── [EC-2][EC-5][EC-10][EC-14][EC-20][EC-22][EC-30]
      // Patel Group 3rd company, subsidy, NOT sanctioned, followUp FUTURE (Apr 15)
      {
        assignedTo:   sales1._id,
        visitDate:    mar(18),
        followUpDate: apr(15),          // [EC-14] FUTURE

        groupName: "Patel Group",

        firmName:    "Patel Textile Mills",
        personName:  "Kiran Shah",
        designation: "Director",
        mobileNo:    "+91 99876 54321",
        email:       "kiran@pateltextile.com",

        additionalContacts: [
          { personName: "Manish Patel", designation: "Accounts Head", mobileNo: "+91 99876 11111", email: "" },
        ],

        officeAddresses: [
          { label: "Registered Office", areaEstate: "Narol Industrial Area", address: "Survey No. 120", city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "382405" },
        ],
        factoryAddresses: [
          { label: "Dyeing Unit", areaEstate: "Narol GIDC", address: "Block C, Narol GIDC", city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "382405" },
        ],

        areaEstate: "Narol Industrial Area", city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat",

        industry: "Textile", segment: "Processing",
        constitution: "Private Limited", machine: "Dyeing Machine",

        sanction: false,

        projectType:   "subsidy",       // [EC-20]
        projectStatus: "Documentation Pending",
        ansClientType: "other",         // [EC-22]
      },

      // Lead 4 ── [EC-1][EC-5][EC-8][EC-11][EC-15][EC-16][EC-19][EC-21][EC-25][EC-28]
      // Standalone, sanctioned HDFC Bank, callingDate PAST + visitDate FUTURE, 2 extra contacts
      {
        assignedTo:   sales1._id,
        visitDate:    apr(10),          // [EC-16] FUTURE scheduled visit
        callingDate:  mar(20),          // [EC-15] PAST overdue calling
        followUpDate: apr(20),

        groupName: "",                  // [EC-11]

        firmName:    "Pharma Solutions Pvt Ltd",
        personName:  "Dr. Anjali Desai",
        designation: "CEO",
        mobileNo:    "+91 97234 56789",
        email:       "anjali@pharmasolutions.com",

        additionalContacts: [           // [EC-8] 2 extra
          { personName: "Dr. Rohit Desai", designation: "R&D Head", mobileNo: "+91 97234 99999", email: "rohit@pharmasolutions.com" },
          { personName: "Kavita Nair",     designation: "CFO",       mobileNo: "+91 97234 88888", email: "kavita@pharmasolutions.com" },
        ],

        officeAddresses: [
          { label: "Corporate Office", areaEstate: "Race Course Road", address: "5th Floor, Swati Complex", city: "Vadodara", district: "Vadodara", state: "Gujarat", pincode: "390007" },
        ],
        factoryAddresses: [
          { label: "Manufacturing Plant", areaEstate: "Savli Industrial Area", address: "Plot No. 12, Savli GIDC", city: "Vadodara", district: "Vadodara", state: "Gujarat", pincode: "391770" },
        ],

        areaEstate: "Race Course Road", city: "Vadodara", district: "Vadodara", state: "Gujarat",

        industry: "Pharmaceutical", constitution: "Private Limited",
        visitType: "meeting",

        sanction: true,                 // [EC-1]
        bankName: "HDFC Bank",          // [EC-25] bank 2
        sanctionDate: mar(28),
        amount: 8000000,                // [EC-28]

        meetingScheduled: true,
        meetingDate: apr(10),           // [EC-35]

        projectType:   "loan",
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",
      },

      // Lead 5 ── [EC-2][EC-6][EC-9][EC-11][EC-18][EC-20][EC-22][EC-30]
      // NO dates, NO addresses, NO contacts → tests all empty states
      {
        assignedTo: sales1._id,
        // [EC-18] no dates at all

        groupName: "",

        firmName:    "Green Energy Systems LLP",
        personName:  "Vikram Singh",
        designation: "Founder",
        mobileNo:    "+91 98234 67890",

        additionalContacts: [],         // [EC-9]
        officeAddresses:    [],         // [EC-6]
        factoryAddresses:   [],

        city: "Surat", district: "Surat", state: "Gujarat",

        industry: "Renewable Energy", constitution: "LLP",

        sanction: false,

        projectType:   "subsidy",
        projectStatus: "In Progress",
        ansClientType: "other",
      },

      // Lead 6 ── [EC-1][EC-3][EC-9][EC-11][EC-12][EC-19][EC-21][EC-23][EC-25][EC-29]
      // 2 offices, no factory, sanctioned UCO Bank, small amount ₹5L, overdue
      {
        assignedTo:   sales1._id,
        visitDate:    mar(8),
        callingDate:  mar(10),
        followUpDate: mar(22),          // [EC-12] PAST overdue

        groupName: "",

        firmName:    "Food Processing Co Pvt Ltd",
        personName:  "Meena Joshi",
        designation: "Managing Partner",
        mobileNo:    "+91 99123 45678",

        additionalContacts: [],

        officeAddresses: [              // [EC-3] 2 offices, no factory
          { label: "Main Office",   areaEstate: "Anand APMC",         address: "Shop 5, APMC Yard",        city: "Anand", district: "Anand", state: "Gujarat", pincode: "388001" },
          { label: "Branch Office", areaEstate: "Vallabh Vidyanagar", address: "Near Railway Station",     city: "Anand", district: "Anand", state: "Gujarat", pincode: "388120" },
        ],
        factoryAddresses: [],

        areaEstate: "Anand APMC", city: "Anand", district: "Anand", state: "Gujarat",

        industry: "Food Processing", machine: "Packaging Unit",
        visitType: "office",

        sanction: true,
        bankName: "UCO Bank",           // [EC-25] bank 3
        sanctionDate: mar(25),
        amount: 500000,                 // [EC-29] ₹5 Lakh

        projectType:   "loan",
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",
      },

      // Lead 7 ── [EC-2][EC-7][EC-9][EC-11][EC-19][EC-21][EC-30]
      // FACTORY ONLY, no office address — tests factory-only edge case
      {
        assignedTo:   sales1._id,
        visitDate:    mar(14),
        followUpDate: apr(5),

        groupName: "",

        firmName:    "Chemical Industries Ltd",
        personName:  "Harish Rao",
        designation: "Director",
        mobileNo:    "+91 98765 12345",

        additionalContacts: [],
        officeAddresses:  [],           // [EC-7] no office
        factoryAddresses: [
          { label: "Chemical Plant", areaEstate: "Vapi GIDC", address: "Plot 233, Vapi GIDC", city: "Vapi", district: "Vapi", state: "Gujarat", pincode: "396195" },
        ],

        city: "Vapi", district: "Vapi", state: "Gujarat",

        industry: "Chemical", constitution: "Private Limited",
        visitType: "office",

        sanction: false,

        projectType:   "loan",
        projectStatus: "Under Review",
        ansClientType: "ans_client",
      },

      // Lead 8 ── [EC-2][EC-5][EC-9][EC-11][EC-17][EC-20][EC-22][EC-30]
      // All 3 dates set, subsidy, other client, Gandhinagar
      {
        assignedTo:   sales1._id,
        visitDate:    mar(20),          // [EC-17] all 3 dates
        callingDate:  mar(22),
        followUpDate: apr(3),

        groupName: "",

        firmName:    "Plastic Molding Works",
        personName:  "Ramesh Verma",
        designation: "Proprietor",
        mobileNo:    "+91 97123 45678",

        additionalContacts: [],

        officeAddresses: [
          { label: "Office", areaEstate: "Khatraj GIDC", address: "Unit 8, Khatraj", city: "Gandhinagar", district: "Gandhinagar", state: "Gujarat", pincode: "382721" },
        ],
        factoryAddresses: [
          { label: "Moulding Unit", areaEstate: "Khatraj GIDC", address: "Unit 9, Khatraj", city: "Gandhinagar", district: "Gandhinagar", state: "Gujarat", pincode: "382721" },
        ],

        areaEstate: "Khatraj GIDC", city: "Gandhinagar", district: "Gandhinagar", state: "Gujarat",

        industry: "Plastic Manufacturing", machine: "Injection Molding Machine",

        sanction: false,

        projectType:   "subsidy",
        projectStatus: "Applied",
        ansClientType: "other",
      },

      // Lead 9 ── [EC-32] TRULY MINIMAL — required fields only, nothing else
      {
        assignedTo: sales1._id,
        firmName:   "Minimal Industries",
        personName: "Test Person",
        mobileNo:   "+91 90000 00001",

        additionalContacts: [],
        officeAddresses:    [],
        factoryAddresses:   [],
        sanction: false,
      },

      // Lead 10 ── [EC-1][EC-5][EC-10][EC-13][EC-19][EC-21][EC-25][EC-26][EC-28][EC-35]
      // Patel Group 4th company, sanctioned ICICI Bank, followUp TODAY, ₹1.2 Cr
      {
        assignedTo:   sales1._id,
        visitDate:    mar(28),
        callingDate:  mar(30),
        followUpDate: apr(1),           // [EC-13] TODAY

        groupName: "Patel Group",       // [EC-26] 4th in group

        firmName:    "Patel Exports Pvt Ltd",
        personName:  "Mahesh Patel",
        designation: "Chairman",
        mobileNo:    "+91 99999 00001",
        email:       "mahesh@patelexports.com",

        additionalContacts: [
          { personName: "Hiral Patel", designation: "Export Manager", mobileNo: "+91 99999 00002", email: "hiral@patelexports.com" },
        ],

        officeAddresses: [
          { label: "Head Office", areaEstate: "GIDC Sector 28", address: "Unit 5, GIDC Sector 28", city: "Gandhinagar", district: "Gandhinagar", state: "Gujarat", pincode: "382028" },
        ],
        factoryAddresses: [
          { label: "Export Warehouse", areaEstate: "Changodar GIDC", address: "Plot C-12, Changodar", city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "382213" },
        ],

        areaEstate: "GIDC Sector 28", city: "Gandhinagar", district: "Gandhinagar", state: "Gujarat",

        industry: "Export", constitution: "Private Limited",
        visitType: "office",

        sanction: true,
        bankName: "ICICI Bank",         // [EC-25] bank 4
        sanctionDate: mar(31),
        amount: 12000000,               // [EC-28]

        meetingScheduled: true,
        meetingDate: apr(5),            // [EC-35]

        projectType:   "loan",
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",
      },

      // ─────────────────────────────────────────────────────────────────
      // SHUBHAM'S LEADS  (9 leads)
      // ─────────────────────────────────────────────────────────────────

      // Lead 11 ── [EC-1][EC-5][EC-8][EC-10][EC-12][EC-19][EC-21][EC-25][EC-27]
      // Shah Packaging Group, sanctioned PNB, overdue followUp, 2 extra contacts
      {
        assignedTo:   sales2._id,
        visitDate:    mar(3),
        callingDate:  mar(5),
        followUpDate: mar(15),          // [EC-12] PAST overdue

        groupName: "Shah Packaging Group",   // [EC-27]

        firmName:    "Diamond Cutting Works",
        personName:  "Jayesh Patel",
        designation: "Owner",
        mobileNo:    "+91 98234 56789",
        email:       "jayesh@diamondworks.com",

        additionalContacts: [
          { personName: "Bhavna Patel", designation: "Operations Manager", mobileNo: "+91 98234 77777", email: "bhavna@diamondworks.com" },
          { personName: "Chirag Mehta", designation: "Sales Manager",      mobileNo: "+91 98234 88888", email: "" },
        ],

        officeAddresses: [
          { label: "Office", areaEstate: "Diamond Market", address: "Shop No. 23, Varachha", city: "Surat", district: "Surat", state: "Gujarat", pincode: "395006" },
        ],
        factoryAddresses: [
          { label: "Cutting Unit", areaEstate: "Sachin GIDC", address: "Plot D-56, Sachin GIDC", city: "Surat", district: "Surat", state: "Gujarat", pincode: "394230" },
        ],

        areaEstate: "Diamond Market", city: "Surat", district: "Surat", state: "Gujarat",

        industry: "Diamond Processing", segment: "Gems & Jewelry",
        constitution: "Partnership", machine: "Laser Cutting Machine",
        remark: "Needs working capital urgently. Call before Apr 5.",
        visitType: "office",

        sanction: true,
        bankName: "Punjab National Bank",   // [EC-25] bank 5
        sanctionDate: mar(18),
        amount: 4500000,

        projectType:   "loan",
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",
      },

      // Lead 12 ── [EC-2][EC-5][EC-9][EC-10][EC-13][EC-20][EC-22][EC-27][EC-30]
      // Shah Packaging Group 2nd, subsidy, NOT sanctioned, followUp TODAY
      {
        assignedTo:   sales2._id,
        visitDate:    mar(10),
        followUpDate: apr(1),           // [EC-13] TODAY

        groupName: "Shah Packaging Group",

        firmName:    "Shah Packaging Solutions",
        personName:  "Nisha Gupta",
        designation: "Director",
        mobileNo:    "+91 99234 56789",

        additionalContacts: [],

        officeAddresses: [
          { label: "Office", areaEstate: "Morbi Industrial Hub", address: "Unit 45, MID", city: "Morbi", district: "Morbi", state: "Gujarat", pincode: "363641" },
        ],
        factoryAddresses: [
          { label: "Plant", areaEstate: "Morbi GIDC", address: "Plot 78, Morbi GIDC", city: "Morbi", district: "Morbi", state: "Gujarat", pincode: "363642" },
        ],

        areaEstate: "Morbi Industrial Hub", city: "Morbi", district: "Morbi", state: "Gujarat",

        industry: "Packaging", constitution: "Private Limited",
        visitType: "meeting",

        sanction: false,

        projectType:   "subsidy",
        projectStatus: "Applied",
        ansClientType: "other",
      },

      // Lead 13 ── [EC-1][EC-4][EC-5][EC-8][EC-10][EC-14][EC-19][EC-21][EC-25][EC-27][EC-28]
      // Shah Packaging Group 3rd, sanctioned Canara Bank, 2 factories, ₹1 Cr+, future followUp
      {
        assignedTo:   sales2._id,
        visitDate:    mar(15),
        callingDate:  mar(18),
        followUpDate: apr(10),          // [EC-14] FUTURE

        groupName: "Shah Packaging Group",

        firmName:    "Shah Packaging Collection",
        personName:  "Sanjay Shah",
        designation: "Managing Partner",
        mobileNo:    "+91 98345 11111",

        additionalContacts: [
          { personName: "Priya Shah", designation: "Sales Head",   mobileNo: "+91 98345 22222", email: "priya@shahcollection.com" },
          { personName: "Rahul Shah", designation: "Finance Head", mobileNo: "+91 98345 33333", email: "" },
        ],

        officeAddresses: [
          { label: "Regd. Office", areaEstate: "Morbi Road", address: "2nd Floor, Shree Complex", city: "Morbi", district: "Morbi", state: "Gujarat", pincode: "363641" },
        ],
        factoryAddresses: [             // [EC-4] 2 factories
          { label: "Unit 1", areaEstate: "Morbi GIDC Phase 2", address: "Plot 112",        city: "Morbi", district: "Morbi", state: "Gujarat", pincode: "363643" },
          { label: "Unit 2", areaEstate: "Wankaner GIDC",      address: "Survey No. 45",   city: "Morbi", district: "Morbi", state: "Gujarat", pincode: "363621" },
        ],

        areaEstate: "Morbi Road", city: "Morbi", district: "Morbi", state: "Gujarat",

        industry: "Packaging", constitution: "Partnership",

        sanction: true,
        bankName: "Canara Bank",        // [EC-25] bank 6
        sanctionDate: mar(25),
        amount: 10000000,               // [EC-28] ₹1 Cr

        meetingScheduled: true,
        meetingDate: apr(8),            // [EC-35]

        projectType:   "loan",
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",
      },

      // Lead 14 ── [EC-2][EC-6][EC-9][EC-11][EC-18][EC-20][EC-22][EC-30]
      // No dates, no addresses, no contacts, subsidy → pure edge-case empty data
      {
        assignedTo: sales2._id,

        groupName: "",

        firmName:    "Paper Products Ltd",
        personName:  "Sanjay Mehta",
        designation: "CEO",
        mobileNo:    "+91 98345 67890",

        additionalContacts: [],
        officeAddresses:    [],
        factoryAddresses:   [],

        city: "Valsad", district: "Valsad", state: "Gujarat",

        industry: "Paper Manufacturing",

        sanction: false,

        projectType:   "subsidy",
        ansClientType: "other",
      },

      // Lead 15 ── [EC-2][EC-5][EC-9][EC-11][EC-16][EC-19][EC-21][EC-24][EC-30]
      // Future visitDate, meeting type, NOT sanctioned, Bharuch
      {
        assignedTo:   sales2._id,
        visitDate:    apr(8),           // [EC-16] FUTURE visit
        callingDate:  apr(2),
        followUpDate: apr(15),

        groupName: "",

        firmName:    "Agro Processing Unit",
        personName:  "Kavita Rane",
        designation: "Managing Director",
        mobileNo:    "+91 97345 67890",

        additionalContacts: [],

        officeAddresses: [
          { label: "Office", areaEstate: "Bharuch GIDC", address: "Plot 56, Bharuch GIDC", city: "Bharuch", district: "Bharuch", state: "Gujarat", pincode: "392015" },
        ],
        factoryAddresses: [
          { label: "Processing Unit", areaEstate: "Bharuch Rural", address: "Survey No. 234, Amod", city: "Bharuch", district: "Bharuch", state: "Gujarat", pincode: "392110" },
        ],

        areaEstate: "Bharuch GIDC", city: "Bharuch", district: "Bharuch", state: "Gujarat",

        industry: "Agriculture", machine: "Grain Processing Unit",
        visitType: "meeting",           // [EC-24]

        sanction: false,

        projectType:   "subsidy",
        projectStatus: "In Progress",
        ansClientType: "ans_client",
      },

      // Lead 16 ── [EC-1][EC-5][EC-9][EC-11][EC-12][EC-19][EC-21][EC-23][EC-25]
      // Sanctioned Axis Bank, overdue, Mehsana
      {
        assignedTo:   sales2._id,
        visitDate:    mar(6),
        callingDate:  mar(8),
        followUpDate: mar(20),          // [EC-12] PAST overdue

        groupName: "",

        firmName:    "Electrical Components Co",
        personName:  "Arun Kumar",
        designation: "Partner",
        mobileNo:    "+91 98456 78901",

        additionalContacts: [],

        officeAddresses: [
          { label: "Office", areaEstate: "Mehsana GIDC", address: "Plot 34, Phase 2", city: "Mehsana", district: "Mehsana", state: "Gujarat", pincode: "384002" },
        ],
        factoryAddresses: [
          { label: "Factory", areaEstate: "Mehsana GIDC Phase 3", address: "Plot 89", city: "Mehsana", district: "Mehsana", state: "Gujarat", pincode: "384003" },
        ],

        areaEstate: "Mehsana GIDC", city: "Mehsana", district: "Mehsana", state: "Gujarat",

        industry: "Electrical", visitType: "office",    // [EC-23]

        sanction: true,
        bankName: "Axis Bank",          // [EC-25] bank 7
        sanctionDate: mar(22),
        amount: 3000000,

        projectType:   "loan",
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",
      },

      // Lead 17 ── [EC-2][EC-5][EC-9][EC-11][EC-14][EC-19][EC-22][EC-30]
      // Future followUp, Rajkot, NOT sanctioned, other client
      {
        assignedTo:   sales2._id,
        visitDate:    mar(25),
        followUpDate: apr(20),          // [EC-14] FUTURE

        groupName: "",

        firmName:    "Engineering Solutions Pvt Ltd",
        personName:  "Deepak Shah",
        designation: "Director",
        mobileNo:    "+91 99456 78901",

        additionalContacts: [],

        officeAddresses: [
          { label: "Office", areaEstate: "Kalawad Road", address: "34, Kalawad Road", city: "Rajkot", district: "Rajkot", state: "Gujarat", pincode: "360001" },
        ],
        factoryAddresses: [
          { label: "Workshop", areaEstate: "Metoda GIDC", address: "Plot 56, Metoda", city: "Rajkot", district: "Rajkot", state: "Gujarat", pincode: "360021" },
        ],

        areaEstate: "Kalawad Road", city: "Rajkot", district: "Rajkot", state: "Gujarat",

        industry: "Engineering",

        sanction: false,

        projectType:   "loan",
        projectStatus: "Under Review",
        ansClientType: "other",
      },

      // Lead 18 ── [EC-1][EC-3][EC-9][EC-11][EC-13][EC-19][EC-21][EC-25]
      // 2 offices, no factory, sanctioned Kotak, followUp TODAY, Ahmedabad
      {
        assignedTo:   sales2._id,
        visitDate:    mar(20),
        callingDate:  mar(28),
        followUpDate: apr(1),           // [EC-13] TODAY

        groupName: "",

        firmName:    "Furniture Manufacturing Co",
        personName:  "Pooja Jain",
        designation: "Owner",
        mobileNo:    "+91 98567 89012",

        additionalContacts: [],

        officeAddresses: [              // [EC-3] 2 offices, no factory
          { label: "Showroom",     areaEstate: "SG Highway",     address: "A-12, Shivalik Mall",  city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "380054" },
          { label: "Admin Office", areaEstate: "Satellite Area", address: "203, Parshwa Complex", city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "380015" },
        ],
        factoryAddresses: [],

        areaEstate: "SG Highway", city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat",

        industry: "Furniture", machine: "CNC Router",
        visitType: "office",

        sanction: true,
        bankName: "Kotak Mahindra Bank",   // [EC-25] bank 8
        sanctionDate: mar(30),
        amount: 2500000,

        projectType:   "loan",
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",
      },

      // Lead 19 ── [EC-2][EC-5][EC-11][EC-19][EC-22][EC-34]
      // DIFFERENT STATE — Rajasthan (tests state filter)
      {
        assignedTo:   sales2._id,
        visitDate:    mar(22),
        followUpDate: apr(12),

        groupName: "",

        firmName:    "Rajasthan Marble Industries",
        personName:  "Sunil Joshi",
        designation: "Proprietor",
        mobileNo:    "+91 98900 11223",

        additionalContacts: [],

        officeAddresses: [
          { label: "Office", areaEstate: "Kishangarh Marble Market", address: "Shop 12, Marble Market", city: "Kishangarh", district: "Ajmer", state: "Rajasthan", pincode: "305801" },   // [EC-34]
        ],
        factoryAddresses: [
          { label: "Factory", areaEstate: "Kishangarh Industrial", address: "Plot 34, KIA", city: "Kishangarh", district: "Ajmer", state: "Rajasthan", pincode: "305802" },
        ],

        areaEstate: "Kishangarh Marble Market", city: "Kishangarh", district: "Ajmer", state: "Rajasthan",

        industry: "Marble & Stone",

        sanction: false,

        projectType:   "loan",
        projectStatus: "New Enquiry",
        ansClientType: "other",
      },

      // ─────────────────────────────────────────────────────────────────
      // AAGAM'S LEADS  (8 leads)
      // ─────────────────────────────────────────────────────────────────

      // Lead 20 ── [EC-1][EC-5][EC-8][EC-11][EC-12][EC-19][EC-21][EC-25]
      // Sanctioned Indian Bank, overdue, Junagadh, 2 extra contacts
      {
        assignedTo:   sales3._id,
        visitDate:    mar(4),
        callingDate:  mar(6),
        followUpDate: mar(18),          // [EC-12] PAST overdue

        groupName: "",

        firmName:    "Rubber Products Ltd",
        personName:  "Mohan Das",
        designation: "Managing Partner",
        mobileNo:    "+91 97456 78901",
        email:       "mohan@rubberproducts.com",

        additionalContacts: [
          { personName: "Sunil Das", designation: "Plant Manager", mobileNo: "+91 97456 55555", email: "" },
          { personName: "Rita Das",  designation: "Admin",         mobileNo: "+91 97456 44444", email: "" },
        ],

        officeAddresses: [
          { label: "Office", areaEstate: "Junagadh City", address: "12, MG Road, Near Collector Office", city: "Junagadh", district: "Junagadh", state: "Gujarat", pincode: "362001" },
        ],
        factoryAddresses: [
          { label: "Plant", areaEstate: "Junagadh GIDC", address: "Plot No. 88, Junagadh GIDC", city: "Junagadh", district: "Junagadh", state: "Gujarat", pincode: "362002" },
        ],

        areaEstate: "Junagadh City", city: "Junagadh", district: "Junagadh", state: "Gujarat",

        industry: "Rubber Manufacturing", constitution: "Partnership",
        machine: "Molding Press", visitType: "office",

        sanction: true,
        bankName: "Indian Bank",        // [EC-25] bank 9
        sanctionDate: mar(25),
        amount: 2500000,

        projectType:   "loan",
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",
      },

      // Lead 21 ── [EC-2][EC-6][EC-9][EC-11][EC-14][EC-20][EC-22][EC-30]
      // No addresses, subsidy, future followUp, Bharuch
      {
        assignedTo:   sales3._id,
        visitDate:    mar(9),
        followUpDate: apr(18),          // [EC-14] FUTURE

        groupName: "",

        firmName:    "Glass Manufacturing Co",
        personName:  "Ravi Thakur",
        designation: "Director",
        mobileNo:    "+91 98678 90123",

        additionalContacts: [],
        officeAddresses:    [],         // [EC-6]
        factoryAddresses:   [],

        city: "Bharuch", district: "Bharuch", state: "Gujarat",

        industry: "Glass",

        sanction: false,

        projectType:   "subsidy",
        ansClientType: "other",
      },

      // Lead 22 ── [EC-2][EC-5][EC-9][EC-11][EC-13][EC-19][EC-21][EC-30]
      // followUp TODAY, Surendranagar, NOT sanctioned
      {
        assignedTo:   sales3._id,
        visitDate:    mar(16),
        callingDate:  mar(25),
        followUpDate: apr(1),           // [EC-13] TODAY

        groupName: "",

        firmName:    "Metal Fabrication Works",
        personName:  "Geeta Yadav",
        designation: "Owner",
        mobileNo:    "+91 99678 90123",

        additionalContacts: [],

        officeAddresses: [
          { label: "Office", areaEstate: "Surendranagar Industrial", address: "Plot 12, Industrial Estate", city: "Surendranagar", district: "Surendranagar", state: "Gujarat", pincode: "363001" },
        ],
        factoryAddresses: [
          { label: "Workshop", areaEstate: "Wadhwan GIDC", address: "Survey 56, Wadhwan", city: "Surendranagar", district: "Surendranagar", state: "Gujarat", pincode: "363030" },
        ],

        areaEstate: "Surendranagar Industrial", city: "Surendranagar", district: "Surendranagar", state: "Gujarat",

        industry: "Metal Fabrication",

        sanction: false,

        projectType:   "loan",
        ansClientType: "ans_client",
      },

      // Lead 23 ── [EC-1][EC-5][EC-9][EC-11][EC-14][EC-19][EC-21][EC-24][EC-25][EC-35]
      // Sanctioned Union Bank, future followUp, meeting scheduled, Ahmedabad
      {
        assignedTo:   sales3._id,
        visitDate:    mar(19),
        callingDate:  mar(21),
        followUpDate: apr(22),

        groupName: "",

        firmName:    "Printing Press Pvt Ltd",
        personName:  "Ramesh Iyer",
        designation: "CEO",
        mobileNo:    "+91 97678 90123",

        additionalContacts: [],

        officeAddresses: [
          { label: "Office", areaEstate: "Navrangpura", address: "201, Supath Complex", city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "380009" },
        ],
        factoryAddresses: [
          { label: "Printing Unit", areaEstate: "Odhav GIDC", address: "Plot 45, Odhav GIDC", city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "382415" },
        ],

        areaEstate: "Navrangpura", city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat",

        industry: "Printing", machine: "Digital Printing Press",
        visitType: "meeting",           // [EC-24]

        sanction: true,
        bankName: "Union Bank of India",   // [EC-25] bank 10
        sanctionDate: mar(29),
        amount: 3000000,

        meetingScheduled: true,
        meetingDate: apr(7),            // [EC-35]

        projectType:   "loan",
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",
      },

      // Lead 24 ── [EC-2][EC-5][EC-9][EC-11][EC-12][EC-20][EC-22][EC-30]
      // Subsidy, other, overdue, Surat
      {
        assignedTo:   sales3._id,
        visitDate:    mar(11),
        callingDate:  mar(14),
        followUpDate: mar(28),          // [EC-12] PAST overdue

        groupName: "",

        firmName:    "Packaging Solutions Pvt Ltd",
        personName:  "Neha Kapoor",
        designation: "Managing Director",
        mobileNo:    "+91 98789 01234",

        additionalContacts: [],

        officeAddresses: [
          { label: "Office", areaEstate: "Sachin", address: "B-12, Sachin Estate", city: "Surat", district: "Surat", state: "Gujarat", pincode: "394230" },
        ],
        factoryAddresses: [
          { label: "Unit", areaEstate: "Sachin GIDC", address: "Plot 78, Sachin GIDC", city: "Surat", district: "Surat", state: "Gujarat", pincode: "394230" },
        ],

        areaEstate: "Sachin", city: "Surat", district: "Surat", state: "Gujarat",

        industry: "Packaging",

        sanction: false,

        projectType:   "subsidy",
        ansClientType: "other",
      },

      // Lead 25 ── [EC-1][EC-5][EC-9][EC-11][EC-16][EC-19][EC-21][EC-25]
      // Sanctioned Central Bank, future visitDate (Apr 12)
      {
        assignedTo:   sales3._id,
        visitDate:    apr(12),          // [EC-16] FUTURE visit
        callingDate:  apr(2),
        followUpDate: apr(25),

        groupName: "",

        firmName:    "Auto Component Works",
        personName:  "Bharat Patel",
        designation: "Partner",
        mobileNo:    "+91 99800 12345",

        additionalContacts: [],

        officeAddresses: [
          { label: "Office", areaEstate: "Naroda GIDC", address: "Plot 23, Naroda GIDC Phase 2", city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "382330" },
        ],
        factoryAddresses: [
          { label: "Assembly Unit", areaEstate: "Naroda GIDC Phase 3", address: "Plot 67", city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "382330" },
        ],

        areaEstate: "Naroda GIDC", city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat",

        industry: "Auto Components", machine: "CNC Milling Machine",
        visitType: "office",

        sanction: true,
        bankName: "Central Bank of India",   // [EC-25] bank 11 — all banks now covered
        sanctionDate: mar(31),
        amount: 6000000,

        projectType:   "loan",
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",
      },

      // Lead 26 ── [EC-2][EC-5][EC-11][EC-19][EC-22][EC-34]
      // DIFFERENT STATE — Maharashtra (tests multi-state filter)
      {
        assignedTo:   sales3._id,
        visitDate:    mar(24),
        followUpDate: apr(14),

        groupName: "",

        firmName:    "Mumbai Textiles Pvt Ltd",
        personName:  "Raj Malhotra",
        designation: "Director",
        mobileNo:    "+91 98200 33445",

        additionalContacts: [],

        officeAddresses: [
          { label: "Office", areaEstate: "Bhiwandi Industrial", address: "Godown 5, Bhiwandi", city: "Bhiwandi", district: "Thane", state: "Maharashtra", pincode: "421302" },   // [EC-34]
        ],
        factoryAddresses: [],

        areaEstate: "Bhiwandi Industrial", city: "Bhiwandi", district: "Thane", state: "Maharashtra",

        industry: "Textile",

        sanction: false,

        projectType:   "loan",
        projectStatus: "New Enquiry",
        ansClientType: "other",
      },

      // Lead 27 ── [EC-31][EC-33] ADMIN LEAD — every possible field filled, admin created
      {
        assignedTo: admin._id,          // [EC-31]

        visitDate:    mar(1),
        callingDate:  mar(3),
        followUpDate: apr(1),           // [EC-13] TODAY

        groupName: "Patel Group",       // makes Patel Group have 5 companies total

        firmName:    "Patel Infrastructure Ltd",
        personName:  "Arvind Patel",
        designation: "CMD",
        mobileNo:    "+91 99001 12345",
        email:       "arvind@patelinfra.com",

        additionalContacts: [           // [EC-8] 3 extra
          { personName: "Smita Patel", designation: "CFO",             mobileNo: "+91 99001 22222", email: "smita@patelinfra.com" },
          { personName: "Nikhil Shah", designation: "Legal Head",      mobileNo: "+91 99001 33333", email: "nikhil@patelinfra.com" },
          { personName: "Rima Desai",  designation: "Project Manager", mobileNo: "+91 99001 44444", email: "" },
        ],

        officeAddresses: [              // [EC-3] 2 offices
          { label: "Corporate HQ",  areaEstate: "Prahladnagar",    address: "9th Floor, Sigma Hub", city: "Ahmedabad",   district: "Ahmedabad",   state: "Gujarat", pincode: "380015" },
          { label: "Branch Office", areaEstate: "Gandhinagar Hub", address: "Block A, GJ-Hub",      city: "Gandhinagar", district: "Gandhinagar", state: "Gujarat", pincode: "382028" },
        ],
        factoryAddresses: [             // [EC-4] 2 factories
          { label: "Plant 1", areaEstate: "Changodar GIDC",  address: "Plot D-45, Changodar", city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "382213" },
          { label: "Plant 2", areaEstate: "Bavla Industrial", address: "Survey No. 89, Bavla", city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "382220" },
        ],

        areaEstate: "Prahladnagar", city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", pincode: "380015",

        industry: "Infrastructure", segment: "Civil Construction",
        constitution: "Public Limited", machine: "Heavy Earthmoving Equipment",
        remark: "Premium client. High-value project. Admin personally handling.",
        visitType: "meeting",

        sanction: true,
        bankName: "HDFC Bank",          // reuses HDFC — tests bank filter count accuracy
        sanctionDate: mar(15),
        amount: 50000000,               // [EC-28] ₹5 Cr — largest in dataset

        meetingScheduled: true,
        meetingDate: apr(3),

        projectType:   "loan",
        projectStatus: "Sanctioned",
        ansClientType: "ans_client",
      },
    ];

    // ── Sequential srNo ───────────────────────────────────────────────────
    sampleLeads.forEach((lead, i) => { lead.srNo = i + 1; });

    await Lead.insertMany(sampleLeads);
    console.log(`✓ Created ${sampleLeads.length} sample leads`);

    // ═══════════════════════════════════════════════════════════════════════
    // SUMMARY REPORT
    // ═══════════════════════════════════════════════════════════════════════
    const today = new Date("2026-04-01");

    const total         = sampleLeads.length;
    const sanctioned    = sampleLeads.filter(l => l.sanction).length;
    const loans         = sampleLeads.filter(l => l.projectType === "loan").length;
    const subsidies     = sampleLeads.filter(l => l.projectType === "subsidy").length;
    const withGroup     = sampleLeads.filter(l => l.groupName).length;
    const multiOffice   = sampleLeads.filter(l => l.officeAddresses?.length > 1).length;
    const multiFactory  = sampleLeads.filter(l => l.factoryAddresses?.length > 1).length;
    const factoryOnly   = sampleLeads.filter(l => !l.officeAddresses?.length && l.factoryAddresses?.length > 0).length;
    const noAddresses   = sampleLeads.filter(l => !l.officeAddresses?.length && !l.factoryAddresses?.length).length;
    const withContacts  = sampleLeads.filter(l => l.additionalContacts?.length > 0).length;
    const noDates       = sampleLeads.filter(l => !l.visitDate && !l.callingDate && !l.followUpDate).length;
    const overdue       = sampleLeads.filter(l => l.followUpDate && new Date(l.followUpDate) < today).length;
    const dueToday      = sampleLeads.filter(l => l.followUpDate && new Date(l.followUpDate).toDateString() === today.toDateString()).length;
    const upcoming      = sampleLeads.filter(l => l.followUpDate && new Date(l.followUpDate) > today).length;
    const usedBanks     = [...new Set(sampleLeads.filter(l => l.bankName).map(l => l.bankName))];
    const usedStates    = [...new Set(sampleLeads.filter(l => l.state).map(l => l.state))];

    console.log("\n════════════════════════════════════════════════════");
    console.log("  ✓  SEED COMPLETED — ANS Fincorp CRM");
    console.log("════════════════════════════════════════════════════");
    console.log("\nLOGIN CREDENTIALS:");
    console.log("  Admin   → aarchi.shah2005@gmail.com  / aarchi123");
    console.log("  Sales 1 → swayam.shah2010@gmail.com  / swayam123  (10 leads)");
    console.log("  Sales 2 → shubham.shah2003@gmail.com / shubham123 (9 leads)");
    console.log("  Sales 3 → aagam.shah2007@gmail.com   / aagam123   (8 leads)");
    console.log("\n── LEADS ───────────────────────────────────────────");
    console.log(`  Total:              ${total}`);
    console.log(`  Sanctioned:         ${sanctioned}  (banking fields visible)`);
    console.log(`  Not Sanctioned:     ${total - sanctioned}  (banking hidden)`);
    console.log(`  Loan:               ${loans}`);
    console.log(`  Subsidy:            ${subsidies}`);
    console.log("\n── ADDRESSES ───────────────────────────────────────");
    console.log(`  2+ office addresses: ${multiOffice}  [EC-3]`);
    console.log(`  2+ factories:        ${multiFactory}  [EC-4]`);
    console.log(`  Factory only:        ${factoryOnly}  [EC-7]`);
    console.log(`  No addresses:        ${noAddresses}  [EC-6]`);
    console.log("\n── CONTACTS ────────────────────────────────────────");
    console.log(`  With extra contacts: ${withContacts}`);
    console.log("\n── GROUPS ──────────────────────────────────────────");
    console.log(`  With group:          ${withGroup}`);
    console.log("  Patel Group          → 5 companies (leads 1,2,3,10,27)");
    console.log("  Shah Packaging Group → 3 companies (leads 11,12,13)");
    console.log("\n── REMINDERS (followUpDate vs Apr 1, 2026) ─────────");
    console.log(`  🔴 Overdue:          ${overdue}   [EC-12]`);
    console.log(`  🟡 Due Today:        ${dueToday}   [EC-13]`);
    console.log(`  🟢 Upcoming:         ${upcoming}  [EC-14]`);
    console.log(`  ⬜ No dates:         ${noDates}   [EC-18]`);
    console.log("\n── BANKS COVERED ───────────────────────────────────");
    usedBanks.forEach(b => console.log(`  ✓ ${b}`));
    console.log("\n── STATES COVERED ──────────────────────────────────");
    usedStates.forEach(s => console.log(`  ✓ ${s}`));
    console.log("════════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (err) {
    console.error("✗ Seed error:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
};

seedData();