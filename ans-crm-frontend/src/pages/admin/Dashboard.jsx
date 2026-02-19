import Layout from "../../components/shared/Layout";
import StatsCards from "../../components/admin/StatsCards";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { useReportSummary } from "../../hooks/useReports";

const AdminDashboard = () => {
  const { data: summary, isLoading } = useReportSummary();

  if (isLoading) return <Layout><LoadingSpinner /></Layout>;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of all leads and performance</p>
        </div>
      </div>

      <StatsCards stats={summary?.stats || {}} />

      <div className="card">
        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>
          Welcome to ANS CRM Admin Dashboard
        </h3>
        <p style={{ color: "#718096", fontSize: "14px", lineHeight: "1.6" }}>
          View all leads, manage your sales team, and track performance metrics from here.
          Use the sidebar to navigate to different sections.
        </p>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
