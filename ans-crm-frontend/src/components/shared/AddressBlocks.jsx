// components/shared/AddressBlocks.jsx
// ── Reusable dynamic address blocks ──────────────────────────────────────
// Used by: LeadForm, SalesLeadEditModal, AdminAddLead, AdminLeadEditModal
//
// Props:
//   officeAddresses   : array of address objects
//   factoryAddresses  : array of address objects
//   onOfficeChange    : (index, field, value) => void
//   onFactoryChange   : (index, field, value) => void
//   onAddOffice       : () => void
//   onAddFactory      : () => void
//   onRemoveOffice    : (index) => void
//   onRemoveFactory   : (index) => void
//   gridClass         : CSS class for grid layout (default: "lead-form__grid")
//   sectionClass      : CSS class for section header (optional)

const AddressField = ({ label, name, value, onChange, placeholder, textarea }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    {textarea ? (
      <textarea
        className="form-textarea"
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder || ""}
      />
    ) : (
      <input
        className="form-input"
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder || ""}
      />
    )}
  </div>
);

const SingleAddressBlock = ({ address, index, type, onChange, onRemove, canRemove, gridClass }) => {
  const handleField = (e) => onChange(index, e.target.name, e.target.value);
  const icon  = type === "office" ? "🏢" : "🏭";
  const label = type === "office" ? "Office Address" : "Factory / Plant Address";
  const color = type === "office" ? "#667eea" : "#f59e0b";
  const bg    = type === "office" ? "#f0f4ff"  : "#fffbeb";
  const border= type === "office" ? "#c7d2fe"  : "#fde68a";

  return (
    <div className="address-block" style={{ borderColor: border, background: bg }}>
      <div className="address-block__header" style={{ color }}>
        <span>{icon} {label} {index + 1}</span>
        {canRemove && (
          <button
            type="button"
            className="btn btn--danger btn--sm"
            onClick={() => onRemove(index)}>
            Remove
          </button>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Label <span className="form-label-hint">(optional — e.g. "Head Office", "Unit 2")</span></label>
        <input
          className="form-input"
          name="label"
          value={address.label || ""}
          onChange={handleField}
          placeholder={type === "office" ? "Head Office" : "Plant A"}
        />
      </div>

      <div className={`${gridClass}--2`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <AddressField label="Area / Estate" name="areaEstate" value={address.areaEstate}
          onChange={handleField} placeholder="GIDC Phase 2" />
        <AddressField label="City" name="city" value={address.city}
          onChange={handleField} placeholder="Surat" />
      </div>

      <AddressField label="Full Address" name="address" value={address.address}
        onChange={handleField} placeholder="Plot No. 45, Sector 8..." textarea />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
        <AddressField label="District" name="district" value={address.district}
          onChange={handleField} />
        <AddressField label="State" name="state" value={address.state}
          onChange={handleField} />
        <AddressField label="Pincode" name="pincode" value={address.pincode}
          onChange={handleField} />
      </div>
    </div>
  );
};

const AddressBlocks = ({
  officeAddresses  = [],
  factoryAddresses = [],
  onOfficeChange,
  onFactoryChange,
  onAddOffice,
  onAddFactory,
  onRemoveOffice,
  onRemoveFactory,
  gridClass = "lead-form__grid",
}) => {
  return (
    <div className="address-blocks-wrapper">

      {/* ── Office Addresses ────────────────────────────────────── */}
      {officeAddresses.map((addr, idx) => (
        <SingleAddressBlock
          key={`office-${idx}`}
          address={addr}
          index={idx}
          type="office"
          onChange={onOfficeChange}
          onRemove={onRemoveOffice}
          canRemove={officeAddresses.length > 1}
          gridClass={gridClass}
        />
      ))}

      {/* ── Factory Addresses ───────────────────────────────────── */}
      {factoryAddresses.map((addr, idx) => (
        <SingleAddressBlock
          key={`factory-${idx}`}
          address={addr}
          index={idx}
          type="factory"
          onChange={onFactoryChange}
          onRemove={onRemoveFactory}
          canRemove={true}
          gridClass={gridClass}
        />
      ))}

      {/* ── Add buttons ─────────────────────────────────────────── */}
      <div className="address-blocks__add-row">
        <button type="button" className="btn btn--ghost btn--sm address-add-btn address-add-btn--office"
          onClick={onAddOffice}>
          🏢 Add Office Address
        </button>
        <button type="button" className="btn btn--ghost btn--sm address-add-btn address-add-btn--factory"
          onClick={onAddFactory}>
          🏭 Add Factory Address
        </button>
      </div>

    </div>
  );
};

export default AddressBlocks;