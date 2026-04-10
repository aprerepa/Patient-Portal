import { Router } from "express";
import pool from "../db";
import { authenticateToken } from "../middleware";

export const physicianRouter = Router();

physicianRouter.get("/patients", authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user.userId;

        const result = await pool.query(
            `SELECT DISTINCT
                u.id,
                u.health_id,
                u.first_name,
                u.last_name,
                u.date_of_birth,
                MAX(CASE WHEN a.appointment_date < NOW() THEN a.appointment_date END) as last_visit,
                MIN(CASE WHEN a.appointment_date >= NOW() AND a.status != 'completed' THEN a.appointment_date END) as next_appointment
            FROM appointments a
            JOIN users u ON u.id = a.patient_id
            WHERE a.physician_id = $1
            GROUP BY u.id, u.health_id, u.first_name, u.last_name, u.date_of_birth
            ORDER BY u.last_name ASC`,
            [userId]
        );

        res.json({ patients: result.rows });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch patients" });
    }
});