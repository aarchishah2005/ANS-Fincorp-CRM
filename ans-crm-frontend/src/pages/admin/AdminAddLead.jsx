import Layout from "../../components/shared/Layout";
import { useState } from "react";
import { useCreateLead } from "../../hooks/useLeads";
import { useSalespersons } from "../../hooks/useUsers";
import useUIStore from "../../store/useUIStore";
import { useNavigate } from "react-router-dom";
import "../../components/sales/LeadForm.css";

const AdminAddLead = () => {
  const { mutate: createLead, isPending } = useCreateLead();
  const { data: salespeople, isLoading: loadingSales } = useSalespersons();
  const { showToast } = useUIStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    assignedTo: "", // Admin selects which salesperson
    visitDate: "",
    callingDate: "",
    followUpDate: "",
    firmName: "",
    personName: "",
    designation: "",
    mobileNo: "",
    email: "",
    areaEstate: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    industry: "",
    segment: "",
    constitution: "",
    machine: "",
    remark: "",
    bankName: "",
    visitType: "office",
    sanction: false,
    sanctionDate: "",
    amount: "",
    meetingScheduled: false,
    meetingDate: "",
    projectType: "loan",
    projectStatus: "",
    ansClientType: "ans_client",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.assignedTo) e.assignedTo = "Please select a salesperson";
    if (!form.firmName?.trim()) e.firmName = "Firm name required";
    if (!form.personName?.trim()) e.personName = "Person name required";
    if (!form.mobileNo?.trim()) e.mobileNo = "Mobile number required";
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    createLead(form, {
      onSuccess: () => {
        showToast("Lead added successfully");
        navigate("/admin/leads");
      },
      onError: () => showToast("Failed to add lead", "error"),
    });
  };

  if (loadingSales) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Lead</h1>
          <p className="page-subtitle">Admin: Assign to any salesperson</p>
        </div>
      </div>

      <form className="lead-form card" onSubmit={handleSubmit}>
        
        {/* ASSIGN TO SALESPERSON */}
        <div className="lead-form__section">
          <div className="lead-form__section-icon">👤</div>
          <div>
            <div className="lead-form__section-title">Assign To Salesperson</div>
            <div className="lead-form__section-desc">Select who will handle this lead</div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Assign To *</label>
          <select className="form-select" name="assignedTo" value={form.assignedTo}
            onChange={handleChange} required>
            <option value="">-- Select Salesperson --</option>
            {salespeople?.map((sp) => (
              <option key={sp._id} value={sp._id}>{sp.name}</option>
            ))}
          </select>
          {errors.assignedTo && <span className="form-error">{errors.assignedTo}</span>}
        </div>

        {/* REST OF THE FORM - SAME AS SALES LEADFORM */}
        {/* DATES */}
        <div className="lead-form__section">
          <div className="lead-form__section-icon">📅</div>
          <div>
            <div className="lead-form__section-title">Visit & Follow-up Dates</div>
          </div>
        </div>

        <div className="lead-form__grid lead-form__grid--3">
          <div className="form-group">
            <label className="form-label">Visit Date</label>
            <input className="form-input" name="visitDate" type="date"
              value={form.visitDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Calling Date</label>
            <input className="form-input" name="callingDate" type="date"
              value={form.callingDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Follow Up Date</label>
            <input className="form-input" name="followUpDate" type="date"
              value={form.followUpDate} onChange={handleChange} />
          </div>
        </div>

        {/* CLIENT */}
        <div className="lead-form__section">
          <div className="lead-form__section-icon">🏢</div>
          <div>
            <div className="lead-form__section-title">Client Information</div>
          </div>
        </div>

        <div className="lead-form__grid lead-form__grid--2">
          <div className="form-group">
            <label className="form-label">Firm Name *</label>
            <input className="form-input" name="firmName" value={form.firmName}
              onChange={handleChange} required />
            {errors.firmName && <span className="form-error">{errors.firmName}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Person Name *</label>
            <input className="form-input" name="personName" value={form.personName}
              onChange={handleChange} required />
            {errors.personName && <span className="form-error">{errors.personName}</span>}
          </div>
        </div>

        <div className="lead-form__grid lead-form__grid--3">
          <div className="form-group">
            <label className="form-label">Designation</label>
            <input className="form-input" name="designation" value={form.designation}
              onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile No. *</label>
            <input className="form-input" name="mobileNo" value={form.mobileNo}
              onChange={handleChange} required />
            {errors.mobileNo && <span className="form-error">{errors.mobileNo}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" name="email" type="email" value={form.email}
              onChange={handleChange} />
          </div>
        </div>

        {/* ADDRESS */}
        <div className="lead-form__section">
          <div className="lead-form__section-icon">📍</div>
          <div><div className="lead-form__section-title">Address</div></div>
        </div>

        <div className="form-group">
          <label className="form-label">Area / Estate</label>
          <input className="form-input" name="areaEstate" value={form.areaEstate}
            onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Full Address</label>
          <textarea className="form-textarea" name="address" value={form.address}
            onChange={handleChange} />
        </div>

        <div className="lead-form__grid lead-form__grid--3">
          <div className="form-group">
            <label className="form-label">District</label>
            <input className="form-input" name="district" value={form.district}
              onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">State</label>
            <input className="form-input" name="state" value={form.state}
              onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Pincode</label>
            <input className="form-input" name="pincode" value={form.pincode}
              onChange={handleChange} />
          </div>
        </div>

        {/* BUSINESS */}
        <div className="lead-form__section">
          <div className="lead-form__section-icon">💼</div>
          <div><div className="lead-form__section-title">Business Information</div></div>
        </div>

        <div className="lead-form__grid lead-form__grid--3">
          <div className="form-group">
            <label className="form-label">Industry</label>
            <input className="form-input" name="industry" value={form.industry}
              onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Segment</label>
            <input className="form-input" name="segment" value={form.segment}
              onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Constitution</label>
            <input className="form-input" name="constitution" value={form.constitution}
              onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Machine</label>
          <input className="form-input" name="machine" value={form.machine}
            onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Remark</label>
          <textarea className="form-textarea" name="remark" value={form.remark}
            onChange={handleChange} />
        </div>

        {/* BANKING */}
        <div className="lead-form__section">
          <div className="lead-form__section-icon">🏦</div>
          <div><div className="lead-form__section-title">Banking & Visit</div></div>
        </div>

        <div className="lead-form__grid lead-form__grid--2">
          <div className="form-group">
            <label className="form-label">Bank Name</label>
            <input className="form-input" name="bankName" value={form.bankName}
              onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Visit Type</label>
            <select className="form-select" name="visitType" value={form.visitType}
              onChange={handleChange}>
              <option value="office">Office Visit</option>
              <option value="meeting">Meeting</option>
            </select>
          </div>
        </div>

        <div className="lead-form__grid lead-form__grid--3">
          <div className="form-group">
            <label className="form-checkbox">
              <input type="checkbox" name="sanction" checked={form.sanction}
                onChange={handleChange} />
              <span>Sanctioned</span>
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">Sanction Date</label>
            <input className="form-input" name="sanctionDate" type="date"
              value={form.sanctionDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input className="form-input" name="amount" type="number"
              value={form.amount} onChange={handleChange} />
          </div>
        </div>

        <div className="lead-form__grid lead-form__grid--2">
          <div className="form-group">
            <label className="form-checkbox">
              <input type="checkbox" name="meetingScheduled"
                checked={form.meetingScheduled} onChange={handleChange} />
              <span>Meeting Scheduled</span>
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">Meeting Date</label>
            <input className="form-input" name="meetingDate" type="date"
              value={form.meetingDate} onChange={handleChange} />
          </div>
        </div>

        <div className="lead-form__grid lead-form__grid--3">
          <div className="form-group">
            <label className="form-label">Project Type</label>
            <select className="form-select" name="projectType" value={form.projectType}
              onChange={handleChange}>
              <option value="loan">Loan</option>
              <option value="subsidy">Subsidy</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Project Status</label>
            <input className="form-input" name="projectStatus" value={form.projectStatus}
              onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">ANS Client Type</label>
            <select className="form-select" name="ansClientType"
              value={form.ansClientType} onChange={handleChange}>
              <option value="ans_client">ANS Client</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="lead-form__footer">
          <button type="button" className="btn btn--ghost"
            onClick={() => navigate("/admin/leads")}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={isPending}>
            {isPending ? "Adding..." : "Add Lead"}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default AdminAddLead;