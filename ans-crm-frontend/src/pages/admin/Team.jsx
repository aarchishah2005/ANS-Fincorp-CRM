import Layout from "../../components/shared/Layout";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { useSalespersons, useAddSalesperson, useDeleteSalesperson } from "../../hooks/useUsers";
import useUIStore from "../../store/useUIStore";
import { useState } from "react";
import "./Team.css";

const Team = () => {
  const { data: salespeople, isLoading } = useSalespersons();
  const { mutate: addSalesperson } = useAddSalesperson();
  const { mutate: deleteSalesperson } = useDeleteSalesperson();
  const { showToast, showConfirm } = useUIStore();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = "Name required";
    if (!form.email?.includes("@")) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    return e;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    addSalesperson(form, {
      onSuccess: () => {
        showToast(`${form.name} added to team`);
        setForm({ name: "", email: "", password: "" });
      },
      onError: (err) =>
        showToast(err?.response?.data?.message || "Failed to add", "error"),
    });
  };

  const handleDelete = (person) => {
    showConfirm(`Remove ${person.name} from team? This cannot be undone.`, () => {
      deleteSalesperson(person._id, {
        onSuccess: () => showToast(`${person.name} removed`),
        onError: () => showToast("Failed to remove", "error"),
      });
    });
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales Team</h1>
          <p className="page-subtitle">
            {salespeople?.length ?? 0} team members
          </p>
        </div>
      </div>

      {/* ADD FORM */}
      <form className="team-add-form card" onSubmit={handleSubmit}>
        <h3 className="team-add-form__title">Add New Salesperson</h3>
        <div className="team-add-form__grid">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" name="name" value={form.name}
              onChange={handleChange} placeholder="John Doe" />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" name="email" type="email" value={form.email}
              onChange={handleChange} placeholder="john@company.com" />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input className="form-input" name="password" type="password"
              value={form.password} onChange={handleChange} placeholder="Min 6 characters" />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>
          <div className="team-add-form__action">
            <button type="submit" className="btn btn--primary">
              Add Salesperson
            </button>
          </div>
        </div>
      </form>

      {/* TEAM TABLE */}
      {isLoading ? (
        <LoadingSpinner />
      ) : !salespeople || salespeople.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: "center", color: "#718096", padding: "40px" }}>
            No team members yet. Add your first salesperson above.
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="team-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salespeople.map((person) => (
                <tr key={person._id}>
                  <td>
                    <div className="team-table__person">
                      <div className="team-table__avatar">
                        {person.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="team-table__name">{person.name}</span>
                    </div>
                  </td>
                  <td>{person.email}</td>
                  <td>
                    <span className="badge badge--ans_client">Sales</span>
                  </td>
                  <td>{new Date(person.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => handleDelete(person)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default Team;