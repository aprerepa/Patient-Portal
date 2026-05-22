import { useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Video } from "lucide-react";
import "./PhysicianSchedule.css";

const weekAppointments = [
    { day: 0, time: "8:30 AM", patient: "Sarah Johnson", reason: "HTN follow-up", mode: "in-person", duration: 20 },
    { day: 0, time: "10:15 AM", patient: "Michael Chen", reason: "Annual physical", mode: "video", duration: 30 },
    { day: 1, time: "9:00 AM", patient: "Emily Rodriguez", reason: "New patient", mode: "in-person", duration: 45 },
    { day: 2, time: "11:30 AM", patient: "David Thompson", reason: "DM labs review", mode: "in-person", duration: 25 },
    { day: 3, time: "2:00 PM", patient: "Jennifer Lee", reason: "Cardiology co-manage", mode: "video", duration: 30 },
    { day: 4, time: "8:00 AM", patient: "Noah Ibrahim", reason: "Post-hospitalization", mode: "in-person", duration: 40 },
    { day: 4, time: "3:30 PM", patient: "Amelia Park", reason: "URI + wheeze", mode: "in-person", duration: 15 },
];

const upcomingExtended = [
    { date: "Dec 16, 2024", time: "9:15 AM", patient: "Sarah Johnson", reason: "Follow-up", location: "Clinic 3A", status: "confirmed" },
    { date: "Dec 16, 2024", time: "11:00 AM", patient: "Michael Chen", reason: "Physical", location: "Video", status: "confirmed" },
    { date: "Dec 17, 2024", time: "8:45 AM", patient: "Emily Rodriguez", reason: "New patient", location: "Clinic 2C", status: "pending" },
    { date: "Dec 18, 2024", time: "1:30 PM", patient: "David Thompson", reason: "Labs", location: "Clinic 3A", status: "confirmed" },
    { date: "Dec 19, 2024", time: "10:00 AM", patient: "Jennifer Lee", reason: "Co-manage", location: "Video", status: "confirmed" },
    { date: "Dec 20, 2024", time: "3:00 PM", patient: "Robert Martinez", reason: "Med refill", location: "Clinic 1B", status: "pending" },
];

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function addDays(d, n) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
}

function startOfWeekMonday(d) {
    const x = new Date(d);
    const day = x.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    x.setDate(x.getDate() + diff);
    x.setHours(0, 0, 0, 0);
    return x;
}

function formatShort(d) {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function PhysicianSchedule() {
    const [anchor, setAnchor] = useState(() => startOfWeekMonday(new Date()));

    const weekStart = useMemo(() => startOfWeekMonday(anchor), [anchor]);
    const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

    const counts = useMemo(() => {
        const c = [0, 0, 0, 0, 0, 0, 0];
        weekAppointments.forEach((a) => {
            c[a.day] += 1;
        });
        return c;
    }, []);

    const goPrev = () => setAnchor((d) => addDays(d, -7));
    const goNext = () => setAnchor((d) => addDays(d, 7));
    const goToday = () => setAnchor(startOfWeekMonday(new Date()));

    return (
        <div className="phd-tab-stack">
            <div className="phd-tab-toolbar">
                <div className="phd-tab-toolbar-left">
                    <Calendar size={18} color="rgb(0, 160, 60)" />
                    <div>
                        <p className="phd-tab-toolbar-title">Schedule</p>
                        <p className="phd-tab-toolbar-sub">
                            Week of {formatShort(weekDays[0])} – {formatShort(weekDays[6])}
                        </p>
                    </div>
                </div>
                <div className="phd-tab-toolbar-actions">
                    <button type="button" className="phd-tab-ghost-btn" onClick={goPrev}>
                        <ChevronLeft size={18} /> Prev
                    </button>
                    <button type="button" className="phd-tab-ghost-btn" onClick={goToday}>This week</button>
                    <button type="button" className="phd-tab-ghost-btn" onClick={goNext}>
                        Next <ChevronRight size={18} />
                    </button>
                    <button type="button" className="phd-tab-primary-btn">Block time (demo)</button>
                </div>
            </div>

            <div className="phd-tab-week">
                {weekDays.map((d, i) => (
                    <div key={i} className={`phd-tab-day ${i >= 5 ? "phd-tab-day-muted" : ""}`}>
                        <p className="phd-tab-day-label">{dayLabels[i]}</p>
                        <p className="phd-tab-day-date">{formatShort(d)}</p>
                        <p className="phd-tab-day-count">{counts[i]} visits</p>
                        <div className="phd-tab-day-chips">
                            {weekAppointments
                                .filter((a) => a.day === i)
                                .map((a) => (
                                    <div key={`${a.time}-${a.patient}`} className="phd-tab-day-chip">
                                        <span className="phd-tab-chip-time">{a.time}</span>
                                        <span className="phd-tab-chip-name">{a.patient}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="phd-card">
                <div className="phd-card-title-row">
                    <Clock size={17} color="rgb(0, 87, 235)" />
                    <h2 className="phd-card-title">Upcoming appointments</h2>
                </div>
                <div className="phd-schedule-list">
                    {upcomingExtended.map((appt, idx) => (
                        <div key={idx} className="phd-schedule-item phd-tab-schedule-wide">
                            <div className="phd-schedule-time">
                                <span className="phd-schedule-hour">{appt.time}</span>
                                <span className="phd-schedule-dur">{appt.date}</span>
                            </div>
                            <div className="phd-schedule-info">
                                <span className="phd-schedule-patient">{appt.patient}</span>
                                <span className="phd-schedule-reason">{appt.reason}</span>
                                <span className="phd-tab-schedule-loc">
                                    {appt.location.toLowerCase().includes("video")
                                        ? <><Video size={13} /> {appt.location}</>
                                        : <><MapPin size={13} /> {appt.location}</>}
                                </span>
                            </div>
                            <span className={`phd-schedule-status phd-status-${appt.status}`}>
                                {appt.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PhysicianSchedule;
