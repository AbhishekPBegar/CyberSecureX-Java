import { useState } from "react";

export default function PasswordPage() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!password) return;
    setLoading(true);
    setResult(null);
    try {
      const params = new URLSearchParams({ password });
      const res = await fetch("/api/password/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ status: "error", message: "Network error while analyzing" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h2>Password Security Checker</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <button onClick={analyze} disabled={loading}>
        {loading ? "Checking..." : "Analyze"}
      </button>

      {result && (
        <section style={{ marginTop: "1rem" }}>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </section>
      )}
    </main>
  );
}
