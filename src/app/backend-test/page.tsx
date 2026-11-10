
import { createClient } from "@/lib/supabase/server";

export default async function BackendTestPage() {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("articles")
    .select("id", { count: "exact", head: true });

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>PAFUPI Backend Test</h1>

      {error ? (
        <div>
          <h2>Connection failed</h2>
          <pre>{error.message}</pre>
        </div>
      ) : (
        <div>
          <h2>Database connected successfully!</h2>
          <p>Articles currently stored: {count ?? 0}</p>
        </div>
      )}
    </main>
  );
}