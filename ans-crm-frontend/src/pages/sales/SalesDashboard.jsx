import { useNavigate } from "react-router-dom";
import Layout from "../../components/shared/Layout";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { useLeads } from "../../hooks/useLeads";
import "./SalesDashboard.css";

const SalesDashboard = () => {
  const navigate = useNavigate();
  const { data: leads, isLoading } = useLeads();

  // Recent 10 leads
  const recentLeads = leads?.slice(0, 10) || [];

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Dashboard</h1>
          <p className="page-subtitle">Welcome back! Manage your visits here.</p>
        </div>
        <button className="btn btn--primary" onClick={() => navigate("/sales/leads/new")}>
          + Add New Visit
        </button>
      </div>

      {/* Quick Stats - Simple Count Only */}
      <div className="sales-dash__quick-stats">
        <div className="sales-dash__stat">
          <div className="sales-dash__stat-value">{leads?.length || 0}</div>
          <div className="sales-dash__stat-label">My Total Visits</div>
        </div>
        <div className="sales-dash__stat">
          <div className="sales-dash__stat-value">
            {leads?.filter(l => l.sanction).length || 0}
          </div>
          <div className="sales-dash__stat-label">Sanctioned</div>
        </div>
        <div className="sales-dash__stat">
          <div className="sales-dash__stat-value">
            {leads?.filter(l => !l.sanction).length || 0}
          </div>
          <div className="sales-dash__stat-label">Pending</div>
        </div>
      </div>

      <div className="card">
        <div className="sales-dash__recent-header">
          <h3>Recent Visits</h3>
          <button className="btn btn--ghost btn--sm"
            onClick={() => navigate("/sales/leads")}>
            View All
          </button>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : recentLeads.length === 0 ? (
          <p className="sales-dash__empty">
            No visits yet. Click "Add New Visit" to get started.
          </p>
        ) : (
          <div className="sales-dash__list">
            {recentLeads.map((lead) => (
              <div key={lead._id} className="sales-dash__lead-row">
                <div className="sales-dash__lead-left">
                  <div className="sales-dash__lead-srno">#{lead.srNo}</div>
                  <div>
                    <div className="sales-dash__lead-firm">{lead.firmName}</div>
                    <div className="sales-dash__lead-person">
                      {lead.personName} · {lead.mobileNo}
                    </div>
                  </div>
                </div>
                <div className="sales-dash__lead-right">
                  <span className={`badge badge--${lead.projectType}`}>
                    {lead.projectType}
                  </span>
                  {lead.sanction && (
                    <span className="sales-dash__sanctioned">✓ Sanctioned</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SalesDashboard;