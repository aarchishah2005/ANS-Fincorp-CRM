import { useState, useEffect } from "react";
import { useUpdateLead } from "../../hooks/useLeads";
import { useSalespersons } from "../../hooks/useUsers";
import useUIStore from "../../store/useUIStore";
import "./AdminLeadEditModal.css";

const AdminLeadEditModal = ({ lead, onClose }) => {
  const { mutate: updateLead, isPending } = useUpdateLead();
  const { data: salespeople } = useSalespersons();
  const { showToast } = useUIStore();

  const [form, setForm] = useState({});

  useEffect(() => {
    if (lead) {
      setForm({
        assignedTo: lead.assignedTo?._id || lead.assignedTo || "",
        visitDate: lead.visitDate ? lead.visitDate.split("T")[0] : "",
        callingDate: lead.callingDate ? lead.callingDate.split("T")[0] : "",
        followUpDate: lead.followUpDate ? lead.followUpDate.split("T")[0] : "",
        firmName: lead.firmName || "",
        personName: lead.personName || "",
        designation: lead.designation || "",
        mobileNo: lead.mobileNo || "",
        email: lead.email || "",
        areaEstate: lead.areaEstate || "",
        address: lead.address || "",
        district: lead.district || "",
        state: lead.state || "",
        pincode: lead.pincode || "",
        industry: lead.industry || "",
        segment: lead.segment || "",
        constitution: lead.constitution || "",
        machine: lead.machine || "",
        remark: lead.remark || "",
        bankName: lead.bankName || "",
        visitType: lead.visitType || "office",
        sanction: lead.sanction || false,
        sanctionDate: lead.sanctionDate ? lead.sanctionDate.split("T")[0] : "",
        amount: lead.amount || "",
        meetingScheduled: lead.meetingScheduled || false,
        meetingDate: lead.meetingDate ? lead.meetingDate.split("T")[0] : "",
        projectType: lead.projectType || "loan",
        projectStatus: lead.projectStatus || "",
        ansClientType: lead.ansClientType || "ans_client",
      });
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateLead(
      { id: lead._id, data: form },
      {
        onSuccess: () => {
          showToast("Lead updated successfully");
          onClose();
        },
        onError: () => showToast("Failed to update lead", "error"),
      }
    );
  };

  if (!lead) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="admin-edit-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="admin-edit-modal__header">
          <h2>Edit Lead #{lead.srNo}</h2>
          <button className="admin-edit-modal__close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="admin-edit-modal__body">
          
          {/* REASSIGN */}
          <div className="admin-edit-modal__section">Reassignment</div>
          <div className="form-group">
            <label className="form-label">Assigned To</label>
            <select className="form-select" name="assignedTo" value={form.assignedTo}
              onChange={handleChange}>
              {salespeople?.map((sp) => (
                <option key={sp._id} value={sp._id}>{sp.name}</option>
              ))}
            </select>
          </div>

          {/* CLIENT */}
          <div className="admin-edit-modal__section">Client Info</div>
          <div className="admin-edit-modal__grid">
            <div className="form-group">
              <label className="form-label">Firm Name</label>
              <input className="form-input" name="firmName" value={form.firmName}
                onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Person Name</label>
              <input className="form-input" name="personName" value={form.personName}
                onChange={handleChange} required />
            </div>
          </div>

          <div className="admin-edit-modal__grid">
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input className="form-input" name="designation" value={form.designation}
                onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile</label>
              <input className="form-input" name="mobileNo" value={form.mobileNo}
                onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" name="email" value={form.email}
                onChange={handleChange} />
            </div>
          </div>

          {/* DATES */}
          <div className="admin-edit-modal__section">Dates</div>
          <div className="admin-edit-modal__grid admin-edit-modal__grid--3">
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
              <label className="form-label">Follow Up</label>
              <input className="form-input" name="followUpDate" type="date"
                value={form.followUpDate} onChange={handleChange} />
            </div>
          </div>

          {/* ADDRESS */}
          <div className="admin-edit-modal__section">Address</div>
          <div className="form-group">
            <label className="form-label">Area/Estate</label>
            <input className="form-input" name="areaEstate" value={form.areaEstate}
              onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea className="form-textarea" name="address" value={form.address}
              onChange={handleChange} />
          </div>
          <div className="admin-edit-modal__grid admin-edit-modal__grid--3">
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
          <div className="admin-edit-modal__section">Business</div>
          <div className="admin-edit-modal__grid admin-edit-modal__grid--3">
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

          {/* BANKING */}
          <div className="admin-edit-modal__section">Banking & Financial</div>
          <div className="admin-edit-modal__grid">
            <div className="form-group">
              <label className="form-label">Bank Name</label>
              <input className="form-input" name="bankName" value={form.bankName}
                onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Visit Type</label>
              <select className="form-select" name="visitType" value={form.visitType}
                onChange={handleChange}>
                <option value="office">Office</option>
                <option value="meeting">Meeting</option>
              </select>
            </div>
          </div>

          <div className="admin-edit-modal__grid admin-edit-modal__grid--3">
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
              <label className="form-label">Amount</label>
              <input className="form-input" name="amount" type="number"
                value={form.amount} onChange={handleChange} />
            </div>
          </div>

          <div className="admin-edit-modal__grid">
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
          <div className="admin-edit-modal__section">Project</div>
          <div className="admin-edit-modal__grid admin-edit-modal__grid--3">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" name="projectType" value={form.projectType}
                onChange={handleChange}>
                <option value="loan">Loan</option>
                <option value="subsidy">Subsidy</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <input className="form-input" name="projectStatus" value={form.projectStatus}
                onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Client Type</label>
              <select className="form-select" name="ansClientType" value={form.ansClientType}
                onChange={handleChange}>
                <option value="ans_client">ANS Client</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Remark</label>
            <textarea className="form-textarea" name="remark" value={form.remark}
              onChange={handleChange} />
          </div>

          <div className="admin-edit-modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLeadEditModal;