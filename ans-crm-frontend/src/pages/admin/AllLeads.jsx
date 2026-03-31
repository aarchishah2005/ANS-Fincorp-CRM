import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/shared/Layout";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { useLeads, useDeleteLead } from "../../hooks/useLeads";
import useUIStore from "../../store/useUIStore";
import AdminLeadEditModal from "../../components/admin/AdminLeadEditModal";
import LeadDetailModal from "../../components/shared/LeadDetailModal";
import BankSelectorModal from "../../components/admin/BankSelectorModal";
import "./AllLeads.css";

const AllLeads = () => {
  const navigate = useNavigate();
  const { showConfirm, showToast, leadFilters, setLeadFilters, resetLeadFilters } = useUIStore();
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);
  const [showBankSelector, setShowBankSelector] = useState(false);
  const [showLocationFilters, setShowLocationFilters] = useState(false);
  const { mutate: deleteLead } = useDeleteLead();

  // Fetch ALL leads (no filters) just for deriving filter options
  const { data: allLeads } = useLeads({});

  // Build dynamic dropdown options from actual data
  const locationOptions = useMemo(() => {
    if (!allLeads) return { states: [], districts: [], cities: [], areas: [] };
    return {
      states: Array.from(new Set(allLeads.map((l) => l.state).filter(Boolean))).sort(),
      districts: Array.from(new Set(allLeads.map((l) => l.district).filter(Boolean))).sort(),
      cities: Array.from(new Set(allLeads.map((l) => l.city).filter(Boolean))).sort(),
      areas: Array.from(new Set(allLeads.map((l) => l.areaEstate).filter(Boolean))).sort(),
    };
  }, [allLeads]);

  // Build group options from actual data (Enhancement 5)
  const groupOptions = useMemo(() => {
    if (!allLeads) return [];
    return Array.from(new Set(allLeads.map((l) => l.groupName).filter(Boolean))).sort();
  }, [allLeads]);

  const activeFilters = Object.fromEntries(
    Object.entries(leadFilters).filter(([, v]) => v !== "")
  );

  const { data: leads, isLoading } = useLeads(activeFilters);

  // Count active location/group filters for badge
  const locationFilterCount = [
    leadFilters.state,
    leadFilters.district,
    leadFilters.city,
    leadFilters.areaEstate,
    leadFilters.groupName,
  ].filter(Boolean).length;

  const handleDelete = (lead) => {
    showConfirm(
      `Delete visit for "${lead.firmName}"? This cannot be undone.`,
      () => {
        deleteLead(lead._id, {
          onSuccess: () => showToast("Lead deleted"),
          onError: () => showToast("Failed to delete", "error"),
        });
      }
    );
  };

  const handleBankSelect = (bankName) => {
    setLeadFilters({ bankName });
    setShowBankSelector(false);
  };

  // Enhancement 5: when user clicks "View all companies in group" from detail modal
  const handleFilterGroup = (groupName) => {
    setLeadFilters({ groupName });
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Leads</h1>
          <p className="page-subtitle">{leads?.length ?? 0} total visits</p>
        </div>
        <button className="btn btn--primary" onClick={() => navigate("/admin/leads/new")}>
          + Add Lead
        </button>
      </div>

      {/* ── MAIN FILTER BAR ─────────────────────────────────────────── */}
      <div className="all-leads__filters card">
        {/* Search */}
        <input
          className="form-input"
          style={{ flex: "1", minWidth: "200px" }}
          placeholder="Search firm, person, mobile..."
          value={leadFilters.search || ""}
          onChange={(e) => setLeadFilters({ search: e.target.value })}
        />

        {/* Project type */}
        <select
          className="form-select"
          value={leadFilters.projectType || ""}
          onChange={(e) => setLeadFilters({ projectType: e.target.value })}>
          <option value="">All Project Types</option>
          <option value="loan">Loan</option>
          <option value="subsidy">Subsidy</option>
        </select>

        {/* Sanction */}
        <select
          className="form-select"
          value={leadFilters.sanction || ""}
          onChange={(e) => setLeadFilters({ sanction: e.target.value })}>
          <option value="">All Sanctions</option>
          <option value="true">Sanctioned</option>
          <option value="false">Not Sanctioned</option>
        </select>

        {/* Bank selector */}
        <button
          className="btn btn--outline all-leads__bank-btn"
          onClick={() => setShowBankSelector(true)}>
          🏦 {leadFilters.bankName || "Select Bank"}
        </button>

        {/* Enhancement 1 + 5: Location & Group filter toggle */}
        <button
          className={`btn ${locationFilterCount > 0 ? "btn--primary" : "btn--outline"} all-leads__location-btn`}
          onClick={() => setShowLocationFilters((p) => !p)}>
          📍 Location / Group
          {locationFilterCount > 0 && (
            <span className="filter-badge">{locationFilterCount}</span>
          )}
        </button>

        <button className="btn btn--ghost" onClick={resetLeadFilters}>
          Reset
        </button>
      </div>

      {/* Enhancement 1 + 5: Expandable location & group filters */}
      {showLocationFilters && (
        <div className="all-leads__location-filters card">
          <div className="location-filters-title">📍 Filter by Location & Group</div>
          <div className="location-filters-grid">

            {/* State */}
            <div className="form-group">
              <label className="form-label">State</label>
              <select
                className="form-select"
                value={leadFilters.state || ""}
                onChange={(e) => setLeadFilters({ state: e.target.value })}>
                <option value="">All States</option>
                {locationOptions.states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="form-group">
              <label className="form-label">District</label>
              <select
                className="form-select"
                value={leadFilters.district || ""}
                onChange={(e) => setLeadFilters({ district: e.target.value })}>
                <option value="">All Districts</option>
                {locationOptions.districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="form-group">
              <label className="form-label">City</label>
              <select
                className="form-select"
                value={leadFilters.city || ""}
                onChange={(e) => setLeadFilters({ city: e.target.value })}>
                <option value="">All Cities</option>
                {locationOptions.cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Area / Estate */}
            <div className="form-group">
              <label className="form-label">Area / Estate</label>
              <select
                className="form-select"
                value={leadFilters.areaEstate || ""}
                onChange={(e) => setLeadFilters({ areaEstate: e.target.value })}>
                <option value="">All Areas</option>
                {locationOptions.areas.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Enhancement 5: Group filter */}
            <div className="form-group">
              <label className="form-label">Business Group</label>
              <select
                className="form-select"
                value={leadFilters.groupName || ""}
                onChange={(e) => setLeadFilters({ groupName: e.target.value })}>
                <option value="">All Groups</option>
                {groupOptions.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Active location filter chips */}
          {locationFilterCount > 0 && (
            <div className="active-filter-chips">
              {leadFilters.state && (
                <span className="filter-chip">
                  State: {leadFilters.state}
                  <button onClick={() => setLeadFilters({ state: "" })}>✕</button>
                </span>
              )}
              {leadFilters.district && (
                <span className="filter-chip">
                  District: {leadFilters.district}
                  <button onClick={() => setLeadFilters({ district: "" })}>✕</button>
                </span>
              )}
              {leadFilters.city && (
                <span className="filter-chip">
                  City: {leadFilters.city}
                  <button onClick={() => setLeadFilters({ city: "" })}>✕</button>
                </span>
              )}
              {leadFilters.areaEstate && (
                <span className="filter-chip">
                  Area: {leadFilters.areaEstate}
                  <button onClick={() => setLeadFilters({ areaEstate: "" })}>✕</button>
                </span>
              )}
              {leadFilters.groupName && (
                <span className="filter-chip filter-chip--group">
                  🔗 Group: {leadFilters.groupName}
                  <button onClick={() => setLeadFilters({ groupName: "" })}>✕</button>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── TABLE ───────────────────────────────────────────────────── */}
      {isLoading ? (
        <LoadingSpinner />
      ) : !leads || leads.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: "center", color: "#718096", padding: "40px" }}>
            No leads found. Try adjusting filters.
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="all-leads-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Firm Name</th>
                <th>Group</th>
                <th>Person</th>
                <th>Mobile</th>
                <th>Location</th>
                <th>Project Type</th>
                <th>Sanction</th>
                <th>Amount</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td className="all-leads-table__srno">{lead.srNo}</td>
                  <td>
                    <button
                      className="all-leads-table__firm-btn"
                      onClick={() => setViewingLead(lead)}>
                      {lead.firmName || "—"}
                    </button>
                  </td>
                  {/* Enhancement 5: group tag in table */}
                  <td>
                    {lead.groupName ? (
                      <button
                        className="group-tag-btn"
                        title={`Filter by ${lead.groupName}`}
                        onClick={() => setLeadFilters({ groupName: lead.groupName })}>
                        🔗 {lead.groupName}
                      </button>
                    ) : (
                      <span style={{ color: "#cbd5e0" }}>—</span>
                    )}
                  </td>
                  <td>{lead.personName || "—"}</td>
                  <td>{lead.mobileNo || "—"}</td>
                  {/* Enhancement 1: Location column */}
                  <td className="all-leads-table__location">
                    {[lead.city, lead.district, lead.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td>
                    <span className={`badge badge--${lead.projectType}`}>
                      {lead.projectType || "—"}
                    </span>
                  </td>
                  <td className="all-leads-table__sanction">
                    {lead.sanction ? "✓" : "✗"}
                  </td>
                  <td className="all-leads-table__amount">
                    {lead.sanction && lead.amount
                      ? `₹${lead.amount.toLocaleString()}`
                      : "—"}
                  </td>
                  <td>{lead.assignedTo?.name || "—"}</td>
                  <td>
                    <div className="all-leads-table__actions">
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => setEditingLead(lead)}>
                        Edit
                      </button>
                      <button
                        className="btn btn--danger btn--sm"
                        onClick={() => handleDelete(lead)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── MODALS ──────────────────────────────────────────────────── */}
      {editingLead && (
        <AdminLeadEditModal
          lead={editingLead}
          onClose={() => setEditingLead(null)}
        />
      )}

      {viewingLead && (
        <LeadDetailModal
          lead={viewingLead}
          onClose={() => setViewingLead(null)}
          onFilterGroup={handleFilterGroup}
          onEdit={() => {
            setEditingLead(viewingLead);
            setViewingLead(null);
          }}
        />
      )}

      {showBankSelector && (
        <BankSelectorModal
          leads={leads}
          currentBank={leadFilters.bankName}
          onSelect={handleBankSelect}
          onClose={() => setShowBankSelector(false)}
        />
      )}
    </Layout>
  );
};

export default AllLeads;