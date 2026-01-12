import { useState } from "react";
import PageLayout from "../components/PageLayout";

export default function FileAnalyzerPage() {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/file/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ status: "error", message: "File analysis failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <PageLayout>
      <div className="analyzer-container">
        <div className="analyzer-header">
          <h1>📁 Malware & Threat Analyzer</h1>
          <p>Drag & drop files for instant security analysis</p>
        </div>
        
        <div
          className={`drop-zone ${dragging ? "drag-active" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragging(false);

         
            const droppedFiles = Array.from(e.dataTransfer.files).filter(
              (file) => file.type !== "" && file.size > 0
            );

            if (droppedFiles.length > 0) {
              setFiles((prev) => {
                const newFiles = [...prev, ...droppedFiles];
                return newFiles.slice(0, 10); 
              });
            }
          }}
        >
          <div className="drop-content">
            <div className="drop-icon">📁</div>
            <h3>{dragging ? "Drop files now!" : "Drag & drop files here"}</h3>
            <p>or click to select (max 10 files: .exe, .zip, .pdf, .txt)</p>
            <input
              type="file"
              multiple
              onChange={(e) => {
                const selectedFiles = Array.from(e.target.files).slice(0, 10);
                setFiles(selectedFiles);
                e.target.value = ""; 
              }}
              className="file-input"
              accept=".exe,.zip,.pdf,.docx,.txt"
              style={{ display: "none" }}
              id="file-upload"
            />
            <label htmlFor="file-upload" className="file-input-label">
              Choose Files
            </label>
          </div>
        </div>
        {files.length > 0 && (
          <div className="files-preview">
            <h4>📋 Selected Files ({files.length})</h4>
            <div className="files-grid">
              {files.map((file, i) => (
                <div key={i} className="file-item">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{formatBytes(file.size)}</span>
                  <button onClick={() => removeFile(i)} className="remove-btn">
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="analyze-btn"
            >
              {loading
                ? "🔍 Analyzing..."
                : `🚀 Analyze ${files.length} File${
                    files.length !== 1 ? "s" : ""
                  }`}
            </button>
          </div>
        )}
        {result && (
          <div className="analysis-results">
            <h3>📊 Analysis Results</h3>
            <div className="threat-summary">
              <div className="threat-stat">
                <span className="stat-number">{result.threats || 0}</span>
                <span className="stat-label">Threats Found</span>
              </div>
              <div className="threat-stat">
                <span className="stat-number">{result.clean || 0}</span>
                <span className="stat-label">Clean Files</span>
              </div>
            </div>

            {result.files?.length > 0 && (
              <div className="files-analysis">
                {result.files.map((file, i) => (
                  <div
                    key={i}
                    className={`file-result ${
                      file.threat ? "threat" : "clean"
                    }`}
                  >
                    <div className="file-header">
                      <span className="file-name">{file.name}</span>
                      <span
                        className={`status ${
                          file.threat ? "danger" : "success"
                        }`}
                      >
                        {file.threat ? "🚨 INFECTED" : "✅ CLEAN"}
                      </span>
                    </div>
                    {file.threat && file.details && (
                      <div className="threat-details">
                        <h5>Threat Details:</h5>
                        <ul>
                          {file.details.map((detail, j) => (
                            <li key={j}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {result?.status === "error" && (
          <div className="error-card">
            <h3>❌ Analysis Failed</h3>
            <p>{result.message}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .analyzer-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        .analyzer-header h1 {
          font-size: 2.6rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(
            135deg,
            #ff9a9e 0%,
            #fecfef 50%,
            #fecfef 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .drop-zone {
          border: 3px dashed #9ca3af;
          border-radius: 24px;
          padding: 4rem 2rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
          cursor: pointer;
          margin-bottom: 2rem;
        }
        .drop-zone.drag-active {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          transform: scale(1.02);
        }
        .drop-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        .drop-content h3 {
          color: white;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }
        .drop-content p {
          color: #9ca3af;
          margin-bottom: 2rem;
        }
        .file-input {
          display: none;
        }
        .files-preview {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .files-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .file-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .file-name {
          flex: 1;
          font-weight: 500;
        }
        .file-size {
          color: #9ca3af;
          font-size: 0.9rem;
        }
        .remove-btn {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          cursor: pointer;
          font-weight: bold;
        }
        .analyze-btn {
          width: 100%;
          padding: 1.2rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .analyze-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
        }
        .analysis-results {
          animation: slideUp 0.5s ease;
        }
        .threat-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .threat-stat {
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
        }
        .stat-number {
          display: block;
          font-size: 3rem;
          font-weight: 800;
          color: #ff9a9e;
          margin-bottom: 0.5rem;
        }
        .stat-label {
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .files-analysis {
          display: grid;
          gap: 1.5rem;
        }
        .file-result {
          padding: 2rem;
          border-radius: 16px;
          border-left: 5px solid;
          backdrop-filter: blur(10px);
        }
        .file-result.clean {
          background: rgba(16, 185, 129, 0.15);
          border-left-color: #10b981;
        }
        .file-result.threat {
          background: rgba(239, 68, 68, 0.15);
          border-left-color: #ef4444;
        }
        .file-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .status {
          padding: 0.5rem 1.5rem;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .status.danger {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        .status.success {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }
        .threat-details h5 {
          color: #ef4444;
          margin-bottom: 0.5rem;
        }
        .threat-details ul {
          list-style: none;
          padding: 0;
          color: #fca5a5;
        }
        .error-card {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          color: #ef4444;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 768px) {
          .analyzer-container {
            padding: 1rem;
          }
          .analyzer-header h1 {
            font-size: 2rem;
          }
          .files-grid {
            grid-template-columns: 1fr;
          }
          .threat-summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </PageLayout>
  );
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
