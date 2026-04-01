import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/shared/Layout";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { useLeads } from "../../hooks/useLeads";
import useUIStore from "../../store/useUIStore";
import SalesLeadEditModal from "../../components/sales/SalesLeadEditModal";
import LeadDetailModal from "../../components/shared/LeadDetailModal";
import BankSelectorModal from "../../components/admin/BankSelectorModal";
import "./MyLeads.css";

const MyLeads = () => {
  const navigate = useNavigate();
  const { leadFilters, setLeadFilters, resetLeadFilters } = useUIStore();
  const [editingLead, setEditingLead]     = useState(null);
  const [viewingLead, setViewingLead]     = useState(null);
  const [showBankSelector, setShowBankSelector] = useState(false);
  const [showLocationFilters, setShowLocationFilters] = useState(false);

  const { data: allLeads } = useLeads({});

  const locationOptions = useMemo(() => {
    if (!allLeads) return { states: [], districts: [], cities: [], areas: [] };
    return {
      states:    Array.from(new Set(allLeads.map((l) => l.state).filter(Boolean))).sort(),
      districts: Array.from(new Set(allLeads.map((l) => l.district).filter(Boolean))).sort(),
      cities:    Array.from(new Set(allLeads.map((l) => l.city).filter(Boolean))).sort(),
      areas:     Array.from(new Set(allLeads.map((l) => l.areaEstate).filter(Boolean))).sort(),
    };
  }, [allLeads]);

  const groupOptions = useMemo(() => {
    if (!allLeads) return [];
    return Array.from(new Set(allLeads.map((l) => l.groupName).filter(Boolean))).sort();
  }, [allLeads]);

  const activeFilters = Object.fromEntries(
    Object.entries(leadFilters).filter(([, v]) => v !== "")
  );
  const { data: leads, isLoading } = useLeads(activeFilters);

  const locationFilterCount = [
    leadFilters.state, leadFilters.district,
    leadFilters.city, leadFilters.areaEstate, leadFilters.groupName,
  ].filter(Boolean).length;

  const handleBankSelect = (bankName) => {
    setLeadFilters({ bankName });
    setShowBankSelector(false);
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Leads</h1>
          <p className="page-subtitle">{leads?.length ?? 0} visits</p>
        </div>
        <button className="btn btn--primary" onClick={() => navigate("/sales/leads/new")}>
          + Add Visit
        </button>
      </div>

      {/* ── FILTER BAR ───────────────────────────────────────────────── */}
      <div className="my-leads__filters card">
        <input
          className="form-input"
          style={{ flex: "1", minWidth: "200px" }}
          placeholder="Search firm, person, mobile..."
          value={leadFilters.search || ""}
          onChange={(e) => setLeadFilters({ search: e.target.value })}
        />

        <select className="form-select"
          value={leadFilters.projectType || ""}
          onChange={(e) => setLeadFilters({ projectType: e.target.value })}>
          <option value="">All Project Types</option>
          <option value="loan">Loan</option>
          <option value="subsidy">Subsidy</option>
        </select>

        <select className="form-select"
          value={leadFilters.sanction || ""}
          onChange={(e) => setLeadFilters({ sanction: e.target.value })}>
          <option value="">All Sanctions</option>
          <option value="true">Sanctioned</option>
          <option value="false">Not Sanctioned</option>
        </select>

        {/* Bank selector button — same style as admin */}
        <button
          className="btn btn--outline my-leads__bank-btn"
          onClick={() => setShowBankSelector(true)}>
          🏦 {leadFilters.bankName || "Select Bank"}
        </button>

        <button
          className={`btn ${locationFilterCount > 0 ? "btn--primary" : "btn--outline"} my-leads__location-btn`}
          onClick={() => setShowLocationFilters((p) => !p)}>
          📍 Location / Group
          {locationFilterCount > 0 && (
            <span className="my-leads__filter-badge">{locationFilterCount}</span>
          )}
        </button>

        <button className="btn btn--ghost" onClick={resetLeadFilters}>Reset</button>
      </div>

      {/* ── LOCATION & GROUP PANEL ───────────────────────────────────── */}
      {showLocationFilters && (
        <div className="my-leads__location-filters card">
          <div className="my-leads__location-title">📍 Filter by Location & Group</div>
          <div className="my-leads__location-grid">
            <div className="form-group">
              <label className="form-label">State</label>
              <select className="form-select" value={leadFilters.state || ""}
                onChange={(e) => setLeadFilters({ state: e.target.value })}>
                <option value="">All States</option>
                {locationOptions.states.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">District</label>
              <select className="form-select" value={leadFilters.district || ""}
                onChange={(e) => setLeadFilters({ district: e.target.value })}>
                <option value="">All Districts</option>
                {locationOptions.districts.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <select className="form-select" value={leadFilters.city || ""}
                onChange={(e) => setLeadFilters({ city: e.target.value })}>
                <option value="">All Cities</option>
                {locationOptions.cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Area / Estate</label>
              <select className="form-select" value={leadFilters.areaEstate || ""}
                onChange={(e) => setLeadFilters({ areaEstate: e.target.value })}>
                <option value="">All Areas</option>
                {locationOptions.areas.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Business Group</label>
              <select className="form-select" value={leadFilters.groupName || ""}
                onChange={(e) => setLeadFilters({ groupName: e.target.value })}>
                <option value="">All Groups</option>
                {groupOptions.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {locationFilterCount > 0 && (
            <div className="my-leads__filter-chips">
              {leadFilters.state     && <span className="my-leads__chip">State: {leadFilters.state}<button onClick={() => setLeadFilters({ state: "" })}>✕</button></span>}
              {leadFilters.district  && <span className="my-leads__chip">District: {leadFilters.district}<button onClick={() => setLeadFilters({ district: "" })}>✕</button></span>}
              {leadFilters.city      && <span className="my-leads__chip">City: {leadFilters.city}<button onClick={() => setLeadFilters({ city: "" })}>✕</button></span>}
              {leadFilters.areaEstate && <span className="my-leads__chip">Area: {leadFilters.areaEstate}<button onClick={() => setLeadFilters({ areaEstate: "" })}>✕</button></span>}
              {leadFilters.groupName && <span className="my-leads__chip my-leads__chip--group">🔗 {leadFilters.groupName}<button onClick={() => setLeadFilters({ groupName: "" })}>✕</button></span>}
            </div>
          )}
        </div>
      )}

      {/* ── TABLE ────────────────────────────────────────────────────── */}
      {isLoading ? (
        <LoadingSpinner />
      ) : !leads || leads.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: "center", color: "#718096", padding: "40px" }}>
            No visits found. Click "Add Visit" to get started.
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="my-leads-table">
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td className="my-leads-table__srno">{lead.srNo}</td>
                  <td>
                    <button className="my-leads-table__firm-btn" onClick={() => setViewingLead(lead)}>
                      {lead.firmName || "—"}
                    </button>
                  </td>
                  <td>
                    {lead.groupName
                      ? <button className="my-leads__group-tag" onClick={() => setLeadFilters({ groupName: lead.groupName })}>🔗 {lead.groupName}</button>
                      : <span style={{ color: "#cbd5e0" }}>—</span>}
                  </td>
                  <td>{lead.personName || "—"}</td>
                  <td>{lead.mobileNo   || "—"}</td>
                  <td className="my-leads-table__location">
                    {[lead.city, lead.district].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td><span className={`badge badge--${lead.projectType}`}>{lead.projectType || "—"}</span></td>
                  <td className="my-leads-table__sanction">{lead.sanction ? "✓" : "✗"}</td>
                  <td className="my-leads-table__amount">
                    {lead.sanction && lead.amount ? `₹${lead.amount.toLocaleString()}` : "—"}
                  </td>
                  <td>
                    <button className="btn btn--ghost btn--sm" onClick={() => setEditingLead(lead)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── MODALS ───────────────────────────────────────────────────── */}
      {editingLead && <SalesLeadEditModal lead={editingLead} onClose={() => setEditingLead(null)} />}

      {viewingLead && (
        <LeadDetailModal
          lead={viewingLead}
          onClose={() => setViewingLead(null)}
          onEdit={() => { setEditingLead(viewingLead); setViewingLead(null); }}
        />
      )}

      {/* Bank selector modal — same component as admin */}
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

export default MyLeads;