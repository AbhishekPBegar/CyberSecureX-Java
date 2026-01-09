import { useState } from "react";

export default function ScannerPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const params = new URLSearchParams({ url: url.trim() });
      const res = await fetch("/api/scanner/scan", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ status: "error", message: "Network error while scanning" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h2>Website Security Scanner</h2>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="example.com or https://example.com"
      />
      <button onClick={handleScan} disabled={loading}>
        {loading ? "Scanning..." : "Scan"}
      </button>

      {result && (
        <section style={{ marginTop: "1rem" }}>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </section>
      )}
    </main>
  );
}
