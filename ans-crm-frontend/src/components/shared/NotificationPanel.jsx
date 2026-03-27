// components/shared/NotificationPanel.jsx  ← REPLACE existing file
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications, useToggleDone } from "../../hooks/useNotifications";
import useAuth from "../../hooks/useAuth";
import "./NotificationPanel.css";

// ── Icons ────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.08 1.21 2 2 0 012.06 0h3a2 2 0 012 1.72c.13 1 .37 1.97.72 2.9a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.18-1.18a2 2 0 012.11-.45c.93.35 1.9.59 2.9.72A2 2 0 0122 14.92z"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const VisitIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const TYPE_CONFIG = {
  "Calling":   { icon: <PhoneIcon />,    color: "calling",  label: "Calling" },
  "Follow-Up": { icon: <CalendarIcon />, color: "followup", label: "Follow-Up" },
  "Visit":     { icon: <VisitIcon />,    color: "visit",    label: "Visit" },
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

// ── Single notification card ─────────────────────────────────
const NotifCard = ({ notif, isAdmin, onNavigate, onToggle, isToggling }) => {
  const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG["Follow-Up"];

  const handleTickClick = (e) => {
    e.stopPropagation(); // don't navigate when ticking
    onToggle({ leadId: notif.leadId, field: notif.field });
  };

  return (
    <div
      className={[
        "notif-card",
        `notif-card--${cfg.color}`,
        `notif-card--${notif.when}`,
        notif.isDone ? "notif-card--done" : "",
      ].join(" ")}
      onClick={() => !notif.isDone && onNavigate(notif)}
      title={notif.isDone ? "Marked as done" : "Click to view lead"}
    >
      {/* Tick button */}
      <button
        className={`notif-card__tick ${notif.isDone ? "notif-card__tick--done" : ""}`}
        onClick={handleTickClick}
        disabled={isToggling}
        title={notif.isDone ? "Mark as pending" : "Mark as done"}
      >
        {notif.isDone ? <CheckIcon /> : null}
      </button>

      {/* Type icon */}
      <div className={`notif-card__icon-wrap notif-card__icon-wrap--${cfg.color} ${notif.isDone ? "notif-card__icon-wrap--done" : ""}`}>
        {cfg.icon}
      </div>

      {/* Body */}
      <div className="notif-card__body">
        <div className="notif-card__top">
          <span className={`notif-card__firm ${notif.isDone ? "notif-card__firm--done" : ""}`}>
            {notif.firmName}
          </span>
          <span className={`notif-card__when notif-card__when--${notif.when}`}>
            {notif.when === "today"    ? "Today"
           : notif.when === "tomorrow" ? "Tomorrow"
           : "Overdue"}
          </span>
        </div>

        <div className="notif-card__meta">
          <span>{notif.personName}</span>
          <span className="notif-card__dot">·</span>
          <span>{notif.mobileNo}</span>
          {isAdmin && (
            <>
              <span className="notif-card__dot">·</span>
              <span className="notif-card__sales">👤 {notif.salesPerson}</span>
            </>
          )}
        </div>

        <div className="notif-card__type-row">
          <span className={`notif-card__badge notif-card__badge--${cfg.color}`}>
            {cfg.icon} {cfg.label}
          </span>
          <span className="notif-card__date">{formatDate(notif.date)}</span>
        </div>

        {/* Done overlay label */}
        {notif.isDone && (
          <div className="notif-card__done-label">✓ Done</div>
        )}
      </div>
    </div>
  );
};

// ── Main Panel ───────────────────────────────────────────────
const NotificationPanel = () => {
  const { data, isLoading }          = useNotifications();
  const { mutate: toggleDone, isPending: isToggling } = useToggleDone();
  const { user }                     = useAuth();
  const navigate                     = useNavigate();
  const isAdmin                      = user?.role === "admin";
  const [activeTab, setActiveTab]    = useState("today");

  const notifications = data?.notifications || [];
  const todayList    = notifications.filter((n) => n.when === "today");
  const tomorrowList = notifications.filter((n) => n.when === "tomorrow");
  const overdueList  = notifications.filter((n) => n.when === "overdue");

  const tabMap = { today: todayList, tomorrow: tomorrowList, overdue: overdueList };
  const shownList = tabMap[activeTab] || [];

  const handleNavigate = (notif) => {
    const base = isAdmin ? "/admin/leads" : "/sales/leads";
    navigate(`${base}/${notif.leadId}`);
  };

  if (isLoading) return null;
  if (notifications.length === 0) return null;

  // undone counts for tab dots
  const undoneToday    = todayList.filter((n) => !n.isDone).length;
  const undoneTomorrow = tomorrowList.filter((n) => !n.isDone).length;
  const undoneOverdue  = overdueList.filter((n) => !n.isDone).length;

  return (
    <div className="notif-panel">
      {/* Header */}
      <div className="notif-panel__header">
        <div className="notif-panel__title-row">
          <span className="notif-panel__bell">🔔</span>
          <h3 className="notif-panel__title">Reminders</h3>
          {undoneToday > 0 && (
            <span className="notif-panel__badge-count notif-panel__badge-count--today">
              {undoneToday} today
            </span>
          )}
          {undoneOverdue > 0 && (
            <span className="notif-panel__badge-count notif-panel__badge-count--overdue">
              {undoneOverdue} overdue
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="notif-panel__tabs">
          {[
            { key: "today",    label: "Today",    count: undoneToday,    dotClass: "" },
            { key: "tomorrow", label: "Tomorrow", count: undoneTomorrow, dotClass: "notif-panel__tab-dot--yellow" },
            { key: "overdue",  label: "Overdue",  count: undoneOverdue,  dotClass: "notif-panel__tab-dot--red" },
          ].map(({ key, label, count, dotClass }) => (
            <button
              key={key}
              className={`notif-panel__tab ${activeTab === key ? "notif-panel__tab--active notif-panel__tab--active-${key}" : ""}`}
              onClick={() => setActiveTab(key)}
            >
              {label}
              {count > 0 && (
                <span className={`notif-panel__tab-dot ${dotClass}`} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="notif-panel__list">
        {shownList.length === 0 ? (
          <p className="notif-panel__empty">
            {activeTab === "today"    ? "✅ No reminders for today"
           : activeTab === "tomorrow" ? "✅ No reminders for tomorrow"
           : "✅ No overdue reminders"}
          </p>
        ) : (
          shownList.map((notif, i) => (
            <NotifCard
              key={`${notif.leadId}-${notif.field}-${i}`}
              notif={notif}
              isAdmin={isAdmin}
              onNavigate={handleNavigate}
              onToggle={toggleDone}
              isToggling={isToggling}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;