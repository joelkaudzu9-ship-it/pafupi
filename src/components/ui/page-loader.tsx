export default function PageLoader({
  message = "Loading…",
}: {
  message?: string;
}) {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="loader" aria-hidden="true" />
      <span className="page-loader-message">{message}</span>
    </div>
  );
}