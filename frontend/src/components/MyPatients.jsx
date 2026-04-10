import "./MyPatients.css";
import { useState, useEffect } from "react";
import { Search, Filter, User, Clock, Calendar, AlertCircle } from "lucide-react";
import axios from "axios";

function getAge(dob) {
    if (!dob) return "—";
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

function formatDate(dateStr) {
    if (!dateStr) return "Not scheduled";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function MyPatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:3001/physician/patients", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPatients(response.data.patients);
            } catch (error) {
                console.error("Failed to fetch patients:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filtered = patients.filter(p =>
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        p.health_id.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="mp-empty">Loading patients...</div>;

    return (
        <div className="mp-wrap">

            {/* Search + Filter */}
            <div className="mp-search-row">
                <div className="mp-search-wrap">
                    <Search size={16} className="mp-search-icon" />
                    <input
                        className="mp-search"
                        type="text"
                        placeholder="Search patients by name or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="mp-filter-btn">
                    <Filter size={15} /> Filter
                </button>
            </div>

            {/* Summary Stats */}
            <div className="mp-stats">
                <div className="mp-stat">
                    <span className="mp-stat-label">Total Patients</span>
                    <span className="mp-stat-value">{patients.length}</span>
                </div>
                <div className="mp-stat">
                    {/* TODO: Replace with real need review count */}
                    <span className="mp-stat-label">Need Review</span>
                    <span className="mp-stat-value">0</span>
                </div>
                <div className="mp-stat">
                    {/* TODO: Replace with real alerts count */}
                    <span className="mp-stat-label">With Alerts</span>
                    <span className="mp-stat-value">0</span>
                </div>
            </div>

            {/* Table */}
            <div className="mp-table-wrap">
                <table className="mp-table">
                    <thead>
                        <tr className="mp-thead-row">
                            <th className="mp-th">Patient</th>
                            <th className="mp-th">Age/Gender</th>
                            <th className="mp-th">Conditions</th>
                            <th className="mp-th">Last Visit</th>
                            <th className="mp-th">Next Appointment</th>
                            <th className="mp-th">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className="mp-empty-row">No patients found.</td>
                            </tr>
                        )}
                        {filtered.map(p => (
                            <tr key={p.id} className="mp-row">
                                <td className="mp-td">
                                    <div className="mp-patient-cell">
                                        <div className="mp-avatar">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="mp-patient-name">{p.first_name} {p.last_name}</p>
                                            <p className="mp-patient-id">{p.health_id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="mp-td">
                                    <p className="mp-age">{getAge(p.date_of_birth)} yrs</p>
                                    {/* TODO: Add gender column to users table */}
                                    <p className="mp-gender mp-muted">—</p>
                                </td>
                                <td className="mp-td">
                                    {/* TODO: Replace with real conditions from a conditions table */}
                                    <span className="mp-muted">None on file</span>
                                </td>
                                <td className="mp-td">
                                    <p className="mp-date">{formatDate(p.last_visit)}</p>
                                </td>
                                <td className="mp-td">
                                    {p.next_appointment ? (
                                        <div className="mp-next-appt">
                                            <Clock size={13} className="mp-clock-icon" />
                                            <p className="mp-date">{formatDate(p.next_appointment)}</p>
                                        </div>
                                    ) : (
                                        <p className="mp-muted">Not scheduled</p>
                                    )}
                                </td>
                                <td className="mp-td">
                                    {/* TODO: Replace with real status logic */}
                                    <span className="mp-status mp-status-active">active</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MyPatients;
