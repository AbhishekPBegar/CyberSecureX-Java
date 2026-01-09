import { useState, useEffect } from "react";

export default function FileSharePage() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [maxDownloads, setMaxDownloads] = useState("");
  const [expiryHours, setExpiryHours] = useState("");
  const [uploadResult, setUploadResult] = useState(null);
  const [myFiles, setMyFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMyFiles = async () => {
    try {
      const res = await fetch("/api/files/my-files");
      const data = await res.json();
      setMyFiles(data);
    } catch (e) {
      console.error("Failed to load files:", e);
    }
  };

  useEffect(() => {
    loadMyFiles();
  }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", file);
    if (description.trim()) formData.append("description", description.trim());
    if (password.trim()) formData.append("password", password.trim());
    if (maxDownloads) formData.append("maxDownloads", maxDownloads);
    if (expiryHours) formData.append("expiryHours", expiryHours);

    try {
      const res = await fetch("/api/files/upload", {
        method: "POST",
        body: formData, // FormData sets correct headers automatically
      });
      const data = await res.json();
      setUploadResult(data);
      loadMyFiles(); // Refresh list
      if (data.status === "success") {
        // Reset form
        setFile(null);
        setDescription("");
        setPassword("");
        setMaxDownloads("");
        setExpiryHours("");
      }
    } catch (e) {
      setUploadResult({ status: "error", message: "Upload failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h2>Secure File Sharing</h2>

      <form onSubmit={upload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password protection (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max downloads (optional)"
          value={maxDownloads}
          onChange={(e) => setMaxDownloads(e.target.value)}
        />
        <input
          type="number"
          placeholder="Expiry hours (optional)"
          value={expiryHours}
          onChange={(e) => setExpiryHours(e.target.value)}
        />
        <button type="submit" disabled={loading || !file}>
          {loading ? "Uploading..." : "🚀 Upload File"}
        </button>
      </form>

      {uploadResult && (
        <section style={{ marginTop: "1rem" }}>
          <h3>Upload Result:</h3>
          <pre>{JSON.stringify(uploadResult, null, 2)}</pre>
        </section>
      )}

      <section style={{ marginTop: "2rem" }}>
        <h3>My Files</h3>
        <ul>
          {myFiles.map((f) => (
            <li key={f.shareToken}>
              {f.fileName} ({f.fileSize}) —{" "}
              <a
                href={`http://localhost:8000/download/${f.shareToken}`}
                target="_blank"
                rel="noreferrer"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
