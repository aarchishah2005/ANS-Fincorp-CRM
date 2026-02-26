import { useState, useMemo } from "react";
import { BANK_LIST } from "../../utils/bankList";
import "./BankSelectorModal.css";

const BankSelectorModal = ({ leads, currentBank, onSelect, onClose }) => {
  const [search, setSearch] = useState("");

  // Count leads per bank from predefined list
  const banksWithCounts = useMemo(() => {
    if (!leads) return [];
    
    return BANK_LIST.map((bank) => ({
      name: bank,
      count: leads.filter((lead) => lead.bankName === bank).length,
    }));
  }, [leads]);

  // Filter banks by search
  const filteredBanks = useMemo(() => {
    if (!search) return banksWithCounts;
    return banksWithCounts.filter((bank) =>
      bank.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [banksWithCounts, search]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bank-selector-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="bank-selector-modal__header">
          <div>
            <h3 className="bank-selector-modal__title">Select Bank</h3>
            <p className="bank-selector-modal__subtitle">
              Filter leads by bank
            </p>
          </div>
          <button className="bank-selector-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="bank-selector-modal__body">
          {/* SEARCH */}
          <div className="bank-selector-modal__search">
            <input
              className="form-input"
              placeholder="Search banks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          {/* BANK LIST */}
          <div className="bank-selector-modal__list">
            {/* CLEAR OPTION */}
            <button
              className={`bank-selector-modal__item ${!currentBank ? "bank-selector-modal__item--active" : ""}`}
              onClick={() => onSelect("")}>
              <div className="bank-selector-modal__item-icon">🔄</div>
              <div>
                <div className="bank-selector-modal__item-name">All Banks</div>
                <div className="bank-selector-modal__item-desc">Show all leads</div>
              </div>
              {!currentBank && (
                <div className="bank-selector-modal__item-check">✓</div>
              )}
            </button>

            {/* BANK OPTIONS */}
            {filteredBanks.length === 0 ? (
              <div className="bank-selector-modal__empty">
                No banks found matching "{search}"
              </div>
            ) : (
              filteredBanks.map((bank) => (
                <button
                  key={bank.name}
                  className={`bank-selector-modal__item ${currentBank === bank.name ? "bank-selector-modal__item--active" : ""}`}
                  onClick={() => onSelect(bank.name)}>
                  <div className="bank-selector-modal__item-icon">🏦</div>
                  <div>
                    <div className="bank-selector-modal__item-name">{bank.name}</div>
                    <div className="bank-selector-modal__item-desc">
                      {bank.count} {bank.count === 1 ? "lead" : "leads"}
                    </div>
                  </div>
                  {currentBank === bank.name && (
                    <div className="bank-selector-modal__item-check">✓</div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="bank-selector-modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankSelectorModal;