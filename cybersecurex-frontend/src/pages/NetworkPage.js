import { useState } from "react";

export default function NetworkPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const scan = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/network/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ status: "error", message: "Network scan failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h2>Network Security Scanner</h2>
      <button onClick={scan} disabled={loading}>
        {loading ? "Scanning network..." : "🚀 Start Network Scan"}
      </button>

      {result && (
        <section style={{ marginTop: "1rem" }}>
          <h3>Results</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </section>
      )}
    </main>
  );
}
