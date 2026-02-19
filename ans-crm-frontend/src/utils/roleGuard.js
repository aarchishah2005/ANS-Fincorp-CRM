export const isAdmin = (user) => user?.role === "admin";
export const isSales = (user) => user?.role === "sales";

export const canEditLead = (user, lead) => {
  if (!user || !lead) return false;
  if (isAdmin(user)) return true;
  return lead.assignedTo === user._id || lead.assignedTo?._id === user._id;
};

export const canDeleteLead = (user) => isAdmin(user);
export const canAccessAdmin = (user) => isAdmin(user);
