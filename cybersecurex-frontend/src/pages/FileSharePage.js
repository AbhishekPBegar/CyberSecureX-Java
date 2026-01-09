import { useState, useEffect, useCallback } from "react";

export default function FileSharePage() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [maxDownloads, setMaxDownloads] = useState("");
  const [expiryHours, setExpiryHours] = useState("");
  const [uploadResult, setUploadResult] = useState(null);
  const [myFiles, setMyFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
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
        body: formData,
      });
      const data = await res.json();
      setUploadResult(data);
      if (data.status === "success") {
        loadMyFiles();
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
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h2>📁 Secure File Sharing</h2>

      {/* Upload Form */}
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          padding: "2rem",
          borderRadius: "20px",
          backdropFilter: "blur(15px)",
          border: dragActive
            ? "3px dashed #4CAF50"
            : "2px dashed rgba(255,255,255,0.3)",
          marginBottom: "2rem",
          transition: "all 0.3s ease",
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <h3 style={{ marginBottom: "1rem", color: "#FFD700" }}>
          📤 Upload New File
        </h3>

        <input
          type="file"
          id="file-input"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: "none" }}
          accept="*/*"
        />
        <label
          htmlFor="file-input"
          style={{ cursor: "pointer", display: "block" }}
        >
          <div style={{ padding: "2rem", textAlign: "center" }}>
            {file ? (
              <>
                <div
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                  }}
                >
                  ✅ {file.name}
                </div>
                <div style={{ color: "#ccc" }}>
                  Size: {(file.size / 1024).toFixed(1)} KB
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                  📁
                </div>
                <div>Click or drag & drop to select file</div>
                <div style={{ color: "#ccc", fontSize: "0.9rem" }}>
                  Max 100MB
                </div>
              </>
            )}
          </div>
        </label>

        {/* Form fields */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
            marginTop: "1.5rem",
          }}
        >
          <input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              padding: "1rem",
              borderRadius: "12px",
              border: "none",
              background: "rgba(255,255,255,0.9)",
              color: "#333",
            }}
          />
          <input
            type="password"
            placeholder="Password protection (optional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "1rem",
              borderRadius: "12px",
              border: "none",
              background: "rgba(255,255,255,0.9)",
              color: "#333",
            }}
          />
          <input
            type="number"
            placeholder="Max downloads (optional)"
            value={maxDownloads}
            onChange={(e) => setMaxDownloads(e.target.value)}
            style={{
              padding: "1rem",
              borderRadius: "12px",
              border: "none",
              background: "rgba(255,255,255,0.9)",
              color: "#333",
            }}
          />
          <input
            type="number"
            placeholder="Expiry hours (optional)"
            value={expiryHours}
            onChange={(e) => setExpiryHours(e.target.value)}
            style={{
              padding: "1rem",
              borderRadius: "12px",
              border: "none",
              background: "rgba(255,255,255,0.9)",
              color: "#333",
            }}
          />
        </div>

        <button
          type="button"
          onClick={upload}
          disabled={loading || !file}
          style={{
            width: "100%",
            padding: "1.2rem",
            marginTop: "1.5rem",
            background:
              loading || !file
                ? "#666"
                : "linear-gradient(135deg, #4CAF50, #45a049)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading || !file ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "📤 Uploading..." : "🚀 Share File Securely"}
        </button>
      </div>

      {uploadResult && (
        <div
          style={{
            background:
              uploadResult.status === "success"
                ? "rgba(76,175,80,0.2)"
                : "rgba(244,67,54,0.2)",
            border: `2px solid ${
              uploadResult.status === "success" ? "#4CAF50" : "#F44336"
            }`,
            padding: "2rem",
            borderRadius: "16px",
            marginBottom: "2rem",
          }}
        >
          <h3
            style={{
              color: uploadResult.status === "success" ? "#4CAF50" : "#F44336",
            }}
          >
            {uploadResult.status === "success" ? "✅ Success" : "❌ Error"}
          </h3>
          {uploadResult.status === "success" && uploadResult.shareUrl && (
            <div>
              <p>
                <strong>Share this link:</strong>
              </p>
              <div
                style={{
                  background: "rgba(255,255,255,0.9)",
                  color: "#333",
                  padding: "1rem",
                  borderRadius: "8px",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                  margin: "1rem 0",
                }}
              >
                {window.location.origin + uploadResult.shareUrl}
              </div>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    window.location.origin + uploadResult.shareUrl
                  )
                }
                style={{
                  padding: "0.8rem 1.5rem",
                  background: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                📋 Copy Link
              </button>
            </div>
          )}
          <pre style={{ fontSize: "12px", marginTop: "1rem" }}>
            {JSON.stringify(uploadResult, null, 2)}
          </pre>
        </div>
      )}

      {/* My Files */}
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          padding: "2rem",
          borderRadius: "20px",
          backdropFilter: "blur(15px)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ color: "#FFD700" }}>📋 My Shared Files</h3>
          <button
            onClick={loadMyFiles}
            style={{
              padding: "0.8rem 1.5rem",
              background: "#FF9800",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {myFiles.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.7 }}>
            No files uploaded yet. Share your first file above!
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "1rem",
            }}
          >
            {myFiles.map((f) => (
              <div
                key={f.shareToken}
                style={{
                  padding: "1.5rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                  border:
                    f.isExpired || f.isActive === false
                      ? "2px solid #F44336"
                      : "1px solid rgba(255,255,255,0.2)",
                  opacity: f.isExpired ? 0.6 : 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                  }}
                >
                  <h4 style={{ color: "#FFD700", margin: 0 }}>{f.fileName}</h4>
                  <span
                    style={{
                      padding: "0.3rem 0.8rem",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      background: f.isExpired
                        ? "#F44336"
                        : f.isActive
                        ? "#4CAF50"
                        : "#FF9800",
                      color: "white",
                    }}
                  >
                    {f.isExpired
                      ? "Expired"
                      : f.isActive
                      ? "Active"
                      : "Limited"}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    marginBottom: "1rem",
                    color: "#ccc",
                  }}
                >
                  <div>📊 Size: {f.fileSize}</div>
                  <div>
                    📥 Downloads: {f.currentDownloads}
                    {f.maxDownloads > 0 ? ` / ${f.maxDownloads}` : ""}
                  </div>
                  <div>
                    📅 Uploaded: {new Date(f.uploadTime).toLocaleDateString()}
                  </div>
                  {f.expiryTime && (
                    <div>
                      ⏰ Expires: {new Date(f.expiryTime).toLocaleDateString()}
                    </div>
                  )}
                  {f.hasPassword && <div>🔒 Password protected</div>}
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    onClick={() => {
                      const link = `${window.location.origin}/download/${f.shareToken}`;
                      navigator.clipboard.writeText(link);
                      alert("Link copied!");
                    }}
                    style={{
                      flex: 1,
                      padding: "0.8rem",
                      background: "#2196F3",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    📋 Copy Share Link
                  </button>
                  {f.isActive && (
                    <a
                      href={`http://localhost:8000/download/${f.shareToken}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        flex: 1,
                        padding: "0.8rem",
                        background: "#4CAF50",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "8px",
                        textAlign: "center",
                        display: "block",
                      }}
                    >
                      🔗 Test Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
