import { Router } from "express";
import pool from "../db";
import { authenticateToken } from "../middleware";
import { fetchFhirPatient, getPatientNameFromFhir } from "../fhirServices";

export const patientRouter = Router();

patientRouter.get("/profile", authenticateToken, async (req, res) => {
    try {
        const userId = (req as any).user.userId;

        const result = await pool.query(
            `SELECT id, health_id, role, email, created_at, fhir_patient_id
             FROM users
             WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Patient not found" });
        }

        const user = result.rows[0];
        let firstName: string | null = null;
        let lastName: string | null = null;

        if (user.fhir_patient_id) {
            try {
                const fhirPatient = await fetchFhirPatient(user.fhir_patient_id);
                ({ firstName, lastName } = getPatientNameFromFhir(fhirPatient));
            } catch (error) {
                console.error("Failed to load FHIR patient name:", error);
            }
        }

        res.json({
            user: {
                ...user,
                first_name: firstName,
                last_name: lastName,
            },
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});
