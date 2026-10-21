import "./StatusBadge.css";

export default function StatusBadge({ status }) {
  return <span data-status={status.toLowerCase().replaceAll(" ", "-")}>{status}</span>;
}
