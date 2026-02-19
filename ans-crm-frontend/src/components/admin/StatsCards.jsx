import "./StatsCards.css";

const StatsCards = ({ stats = {} }) => {
  const cards = [
    {
      label: "Total Leads",
      value: stats.totalLeads ?? "—",
      icon: "📋",
      color: "#667eea",
      bg: "#f0f4ff",
    },
    {
      label: "Sanctioned",
      value: stats.sanctioned ?? "—",
      icon: "✓",
      color: "#10b981",
      bg: "#f0fdf4",
    },
    {
      label: "Total Amount",
      value: stats.totalAmount ? `₹${(stats.totalAmount / 100000).toFixed(1)}L` : "—",
      icon: "💰",
      color: "#f59e0b",
      bg: "#fffbeb",
    },
    {
      label: "Sanctioned Amount",
      value: stats.sanctionedAmount ? `₹${(stats.sanctionedAmount / 100000).toFixed(1)}L` : "—",
      icon: "💵",
      color: "#06b6d4",
      bg: "#ecfeff",
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div className="stats-card" key={card.label}>
          <div className="stats-card__icon" style={{ background: card.bg, color: card.color }}>
            {card.icon}
          </div>
          <div className="stats-card__info">
            <div className="stats-card__value">{card.value}</div>
            <div className="stats-card__label">{card.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
