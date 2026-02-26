import { useState } from "react";
import { useCreateLead } from "../../hooks/useLeads";
import useUIStore from "../../store/useUIStore";
import { useNavigate } from "react-router-dom";
import { BANK_LIST } from "../../utils/bankList";
import "./LeadForm.css";

const LeadForm = () => {
  const { mutate: createLead, isPending } = useCreateLead();
  const { showToast } = useUIStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
    bankName: "", // Will be dropdown
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
        showToast("Visit added successfully");
        navigate("/sales/leads");
      },
      onError: () => showToast("Failed to add visit", "error"),
    });
  };

  return (
    <form className="lead-form card" onSubmit={handleSubmit}>
      
      {/* DATES */}
      <div className="lead-form__section">
        <div className="lead-form__section-icon">📅</div>
        <div>
          <div className="lead-form__section-title">Visit & Follow-up Dates</div>
          <div className="lead-form__section-desc">Track important timeline</div>
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
          <div className="lead-form__section-desc">Firm and contact person details</div>
        </div>
      </div>

      <div className="lead-form__grid lead-form__grid--2">
        <div className="form-group">
          <label className="form-label">Firm Name *</label>
          <input className="form-input" name="firmName" value={form.firmName}
            onChange={handleChange} placeholder="ABC Industries Pvt Ltd" required />
          {errors.firmName && <span className="form-error">{errors.firmName}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Person Name *</label>
          <input className="form-input" name="personName" value={form.personName}
            onChange={handleChange} placeholder="Rajesh Kumar" required />
          {errors.personName && <span className="form-error">{errors.personName}</span>}
        </div>
      </div>

      <div className="lead-form__grid lead-form__grid--3">
        <div className="form-group">
          <label className="form-label">Designation</label>
          <input className="form-input" name="designation" value={form.designation}
            onChange={handleChange} placeholder="Managing Director" />
        </div>
        <div className="form-group">
          <label className="form-label">Mobile No. *</label>
          <input className="form-input" name="mobileNo" value={form.mobileNo}
            onChange={handleChange} placeholder="+91 98765 43210" required />
          {errors.mobileNo && <span className="form-error">{errors.mobileNo}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" name="email" type="email" value={form.email}
            onChange={handleChange} placeholder="contact@company.com" />
        </div>
      </div>

      {/* ADDRESS */}
      <div className="lead-form__section">
        <div className="lead-form__section-icon">📍</div>
        <div><div className="lead-form__section-title">Address Details</div></div>
      </div>

      <div className="form-group">
        <label className="form-label">Area / Estate</label>
        <input className="form-input" name="areaEstate" value={form.areaEstate}
          onChange={handleChange} placeholder="GIDC Phase 2" />
      </div>

      <div className="form-group">
        <label className="form-label">Full Address</label>
        <textarea className="form-textarea" name="address" value={form.address}
          onChange={handleChange} placeholder="Plot No. 45, Sector 8..." />
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
            onChange={handleChange} placeholder="Manufacturing" />
        </div>
        <div className="form-group">
          <label className="form-label">Segment</label>
          <input className="form-input" name="segment" value={form.segment}
            onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Constitution</label>
          <input className="form-input" name="constitution" value={form.constitution}
            onChange={handleChange} placeholder="Partnership / Pvt Ltd" />
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
          onChange={handleChange} placeholder="Any additional notes..." />
      </div>

      {/* BANKING - WITH DROPDOWN */}
      <div className="lead-form__section">
        <div className="lead-form__section-icon">🏦</div>
        <div><div className="lead-form__section-title">Banking & Visit Details</div></div>
      </div>

      <div className="lead-form__grid lead-form__grid--2">
        <div className="form-group">
          <label className="form-label">Bank Name</label>
          <select className="form-select" name="bankName" value={form.bankName}
            onChange={handleChange}>
            <option value="">-- Select Bank --</option>
            {BANK_LIST.map((bank) => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
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

      {/* SANCTION */}
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
            value={form.amount} onChange={handleChange} placeholder="0" />
        </div>
      </div>

      {/* MEETING */}
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

      {/* PROJECT */}
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
            onChange={handleChange} placeholder="In Progress / Approved" />
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

      {/* FOOTER */}
      <div className="lead-form__footer">
        <button type="button" className="btn btn--ghost"
          onClick={() => navigate("/sales/leads")}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={isPending}>
          {isPending ? "Saving..." : "Add Visit"}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;