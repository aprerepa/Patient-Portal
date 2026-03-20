import "./Upload.css";
import { useState, useRef } from "react";
import {
    Upload, FileText, Image, CheckCircle, X
} from "lucide-react";

const fileTypes = [
    { icon: <FileText size={28} />, label: "Medical Notes", sub: "Doctor visits, consultations", color: "blue" },
    { icon: <FileText size={28} />, label: "Prescriptions", sub: "Medication records", color: "green" },
    { icon: <FileText size={28} />, label: "Lab Results", sub: "Blood work, tests", color: "purple" },
    { icon: <Image size={28} />, label: "Imaging", sub: "X-rays, MRI, CT scans", color: "orange" },
];

const dataSources = [
    { name: "Epic MyChart", desc: "Import from Epic health systems" },
    { name: "LabCorp", desc: "Import lab test results" },
    { name: "Quest Diagnostics", desc: "Import diagnostic results" },
    { name: "Apple Health", desc: "Import fitness and vital data" },
];

function UploadTab() {
    const [dragOver, setDragOver] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const inputRef = useRef(null);

    const handleFiles = (files) => {
        const newFiles = Array.from(files).map((file) => ({
            id: Date.now() + Math.random(),
            name: file.name,
            size: (file.size / 1024).toFixed(1) + " KB",
            status: "Complete",
            category: "Lab Results", // TODO: Replace with real AI categorization
        }));
        setUploadedFiles((prev) => [...prev, ...newFiles]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleInputChange = (e) => {
        handleFiles(e.target.files);
    };

    const removeFile = (id) => {
        setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
    };

    return (
        <div className="up-wrap">

            {/* Info Banner */}
            <div className="up-banner">
                <p className="up-banner-title">Upload Medical Documents</p>
                <p className="up-banner-body">Upload any medical documents including prescriptions, lab results, doctor notes, or imaging reports. Our AI will automatically extract and categorize key information from your documents.</p>
            </div>

            {/* Drop Zone */}
            <div
                className={`up-dropzone ${dragOver ? "up-dropzone-active" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.dcm"
                    style={{ display: "none" }}
                    onChange={handleInputChange}
                />
                <div className="up-drop-icon">
                    <Upload size={24} className="up-blue-icon" />
                </div>
                <p className="up-drop-title">Drop files here or click to upload</p>
                <p className="up-drop-sub">Supports PDF, JPG, PNG, and DICOM files up to 50MB</p>
                <button
                    className="up-select-btn"
                    onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}
                >
                    <Upload size={15} /> Select Files
                </button>
            </div>

            {/* File Type Cards */}
            <div className="up-types-grid">
                {fileTypes.map((t, i) => (
                    <div key={i} className="up-type-card">
                        <span className={`up-type-icon up-type-icon-${t.color}`}>{t.icon}</span>
                        <p className="up-type-label">{t.label}</p>
                        <p className="up-type-sub">{t.sub}</p>
                    </div>
                ))}
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
                <div className="up-card">
                    <h2 className="up-section-title">Uploaded Files ({uploadedFiles.length})</h2>
                    <div className="up-files-list">
                        {uploadedFiles.map((f) => (
                            <div key={f.id} className="up-file-item">
                                <div className="up-file-header">
                                    <div className="up-file-left">
                                        <div className="up-file-icon">
                                            <FileText size={18} className="up-blue-icon" />
                                        </div>
                                        <div>
                                            <p className="up-file-name">{f.name}</p>
                                            <p className="up-file-size">{f.size}</p>
                                            <div className="up-file-status">
                                                <CheckCircle size={13} className="up-green-icon" />
                                                <span>Complete</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="up-remove-btn" onClick={() => removeFile(f.id)}>
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="up-file-ai">
                                    <CheckCircle size={13} className="up-green-icon" />
                                    <div>
                                        <p className="up-file-ai-cat">Automatically categorized as: {f.category}</p>
                                        <p className="up-file-ai-sub">AI extracted key medical data from document</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Connect Data Sources */}
            <div className="up-card">
                <h2 className="up-section-title">Connect Data Sources</h2>
                <p className="up-section-sub">Automatically import records from healthcare providers and labs</p>
                <div className="up-sources-grid">
                    {dataSources.map((s, i) => (
                        <div key={i} className="up-source-item">
                            <div className="up-source-header">
                                <p className="up-source-name">{s.name}</p>
                                <span className="up-not-connected">Not connected</span>
                            </div>
                            <p className="up-source-desc">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default UploadTab;
