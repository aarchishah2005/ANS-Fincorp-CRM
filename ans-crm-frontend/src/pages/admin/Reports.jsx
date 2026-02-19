import { useState } from "react";
import Layout from "../../components/shared/Layout";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { useReportSummary, useReportBySales } from "../../hooks/useReports";
import "./Reports.css";

const Reports = () => {
  const { data: summary, isLoading: loadingSummary } = useReportSummary();
  const { data: bySales, isLoading: loadingSales } = useReportBySales();

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Performance insights and metrics</p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      {loadingSummary ? (
        <LoadingSpinner />
      ) : (
        <div className="reports-summary">
          <div className="reports-summary__card">
            <div className="reports-summary__icon" style={{ background: "#f0f4ff", color: "#667eea" }}>
              📋
            </div>
            <div>
              <div className="reports-summary__value">{summary?.stats?.totalLeads || 0}</div>
              <div className="reports-summary__label">Total Leads</div>
            </div>
          </div>
          <div className="reports-summary__card">
            <div className="reports-summary__icon" style={{ background: "#f0fdf4", color: "#10b981" }}>
              ✓
            </div>
            <div>
              <div className="reports-summary__value">{summary?.stats?.sanctioned || 0}</div>
              <div className="reports-summary__label">Sanctioned</div>
            </div>
          </div>
          <div className="reports-summary__card">
            <div className="reports-summary__icon" style={{ background: "#fffbeb", color: "#f59e0b" }}>
              💰
            </div>
            <div>
              <div className="reports-summary__value">
                ₹{((summary?.stats?.totalAmount || 0) / 100000).toFixed(1)}L
              </div>
              <div className="reports-summary__label">Total Amount</div>
            </div>
          </div>
          <div className="reports-summary__card">
            <div className="reports-summary__icon" style={{ background: "#ecfeff", color: "#06b6d4" }}>
              💵
            </div>
            <div>
              <div className="reports-summary__value">
                ₹{((summary?.stats?.sanctionedAmount || 0) / 100000).toFixed(1)}L
              </div>
              <div className="reports-summary__label">Sanctioned Amount</div>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT TYPE BREAKDOWN */}
      <div className="reports-section">
        <div className="card">
          <h3 className="reports-section__title">Project Type Distribution</h3>
          {loadingSummary ? (
            <LoadingSpinner />
          ) : (
            <div className="reports-breakdown">
              <div className="reports-breakdown__item">
                <span className="badge badge--loan">Loan</span>
                <span className="reports-breakdown__value">
                  {summary?.byProjectType?.loan || 0}
                </span>
              </div>
              <div className="reports-breakdown__item">
                <span className="badge badge--subsidy">Subsidy</span>
                <span className="reports-breakdown__value">
                  {summary?.byProjectType?.subsidy || 0}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="reports-section__title">Client Type Distribution</h3>
          {loadingSummary ? (
            <LoadingSpinner />
          ) : (
            <div className="reports-breakdown">
              <div className="reports-breakdown__item">
                <span className="badge badge--ans_client">ANS Client</span>
                <span className="reports-breakdown__value">
                  {summary?.byAnsClientType?.ans_client || 0}
                </span>
              </div>
              <div className="reports-breakdown__item">
                <span className="badge badge--other">Other</span>
                <span className="reports-breakdown__value">
                  {summary?.byAnsClientType?.other || 0}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SALES TEAM PERFORMANCE */}
      <div className="card">
        <h3 className="reports-section__title">Sales Team Performance</h3>
        {loadingSales ? (
          <LoadingSpinner />
        ) : !bySales?.data || bySales.data.length === 0 ? (
          <p style={{ color: "#718096", textAlign: "center", padding: "20px" }}>
            No performance data yet
          </p>
        ) : (
          <div className="reports-team-table">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Salesperson</th>
                  <th>Total Leads</th>
                  <th>Sanctioned</th>
                  <th>Sanctioned Amount</th>
                </tr>
              </thead>
              <tbody>
                {bySales.data.map((person, idx) => (
                  <tr key={idx}>
                    <td className="reports-table__name">{person.name}</td>
                    <td>{person.leads}</td>
                    <td>{person.sanctioned}</td>
                    <td className="reports-table__amount">
                      ₹{person.amount?.toLocaleString() || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reports;