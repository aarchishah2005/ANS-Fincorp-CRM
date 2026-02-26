// Central bank list for the entire application
// ONLY selected partner banks

export const BANK_LIST = [
  "Bank of Baroda",
  "UCO Bank",
  "Punjab National Bank",
  "Central Bank of India",
  "HDFC Bank",
  "Kotak Mahindra Bank",
  "Axis Bank",
  "ICICI Bank",
  "Indian Bank",
  "Union Bank of India",
  "Canara Bank"
];

// Helper function to check if a bank is valid
export const isValidBank = (bankName) => {
  return BANK_LIST.includes(bankName);
};

// Helper to get bank list for dropdowns
export const getBankOptions = () => {
  return BANK_LIST;
};