import { Router } from "express";
import pool from "../db";
import { authenticateToken } from "../middleware";

export const patientRouter = Router();

patientRouter.get("/profile", authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user.userId;

        const result = await pool.query(
            `SELECT id, health_id, role, email, first_name, last_name, date_of_birth, phone, created_at
            FROM users
            WHERE id = $1` ,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Patient not found" });
        }

        res.json({ user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

patientRouter.get("/vitals", authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user.userId;
        const result = await pool.query(
            `SELECT id, user_id, recorded_at, heart_rate, systolic_bp, diastolic_bp, weight
            FROM vitals
            WHERE user_id = $1
            ORDER BY recorded_at ASC` ,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.json({ vitals: [] });
        }

        res.json({ vitals: result.rows });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch vitals" });
    }
});

patientRouter.get("/records", authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user.userId;
        const result = await pool.query(
            `SELECT id, user_id, record_type, title, provider, facility, record_date, summary, file_url
             FROM medical_records 
             WHERE user_id = $1
             ORDER BY record_date DESC` , 
             [userId]
        );

        if (result.rows.length === 0) {
            return res.json({ medical_records: [] });
        }

        res.json({ medical_records: result.rows });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch medical records" });
    }
});

patientRouter.get("/medications", authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user.userId;
        const result = await pool.query(
            `SELECT id, user_id, name, dosage, frequency, prescriber, start_date, end_date, is_active
            FROM medications
            WHERE user_id = $1
            ORDER BY is_active DESC, start_date DESC` , 
            [userId]
        );
        if (result.rows.length === 0) {
            return res.json({ medications: [] });
        }

        res.json({ medications: result.rows });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch medications" });
    }
});

patientRouter.get("/appointments", authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user.userId;
        const result = await pool.query(
            `SELECT id, patient_id, physician_id, facility, appointment_date, appointment_type, reason, status, notes
             FROM appointments
             WHERE patient_id = $1
             ORDER BY appointment_date DESC`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.json({ appointments: [] });
        }

        res.json({ appointments: result.rows });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch appointments" });
    }
});