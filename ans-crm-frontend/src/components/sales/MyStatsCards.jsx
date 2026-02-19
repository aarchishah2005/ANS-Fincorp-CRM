import "./MyStatsCards.css";

const MyStatsCards = ({ stats = {} }) => {
  const cards = [
    { label: "Total Leads", value: stats.total ?? "—", icon: "📋", color: "#667eea", bg: "#f0f4ff" },
    { label: "Sanctioned", value: stats.sanctioned ?? "—", icon: "✓", color: "#10b981", bg: "#f0fdf4" },
    { label: "Pending", value: stats.pending ?? "—", icon: "⏳", color: "#f59e0b", bg: "#fffbeb" },
    { label: "Total Amount", value: stats.amount ? `₹${(stats.amount / 100000).toFixed(1)}L` : "—", icon: "💰", color: "#06b6d4", bg: "#ecfeff" },
  ];

  return (
    <div className="my-stats-grid">
      {cards.map((card) => (
        <div className="my-stats-card" key={card.label}>
          <div className="my-stats-card__icon" style={{ background: card.bg, color: card.color }}>
            {card.icon}
          </div>
          <div>
            <div className="my-stats-card__value">{card.value}</div>
            <div className="my-stats-card__label">{card.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyStatsCards;
