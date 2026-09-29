import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { Client } from 'pg';
import * as argon2 from 'argon2';

dotenv.config();

const FHIR_SERVER = process.env.FHIR_BASE_URL || 'http://localhost:8080/fhir';
const SYNTHEA_DIR = path.join(__dirname, '../../synthea-generator/output/fhir');

const pgClient = new Client({
    connectionString: process.env.DATABASE_URL,
});

function loadBundle(filePath: string): fhir4.Bundle {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
}

function getPatientFromBundle(bundle: fhir4.Bundle): fhir4.Patient | undefined {
    return bundle.entry?.find(
        (e) => e.resource?.resourceType === 'Patient'
    )?.resource as fhir4.Patient | undefined;
}

/** FHIR Patient death: deceasedBoolean === true OR deceasedDateTime set (Synthea uses the latter). */
function isDeceasedPatient(patient: fhir4.Patient | undefined): boolean {
    if (!patient) return false;
    if (patient.deceasedBoolean === true) return true;
    if (typeof patient.deceasedDateTime === 'string' && patient.deceasedDateTime.length > 0) {
        return true;
    }
    return false;
}

function emailFromPatient(patient: fhir4.Patient | undefined, fallbackIndex: number): string {
    const official =
        patient?.name?.find((n) => n.use === 'official') ||
        patient?.name?.[0];
    const firstName = official?.given?.[0];
    const lastName = official?.family;

    if (firstName && lastName) {
        const normalize = (s: string) =>
            s.toLowerCase().normalize('NFKD').replace(/[^\w]/g, '');
        return `${normalize(firstName)}.${normalize(lastName)}@portal.com`;
    }

    return `patient_${fallbackIndex}@portal.com`;
}

async function uploadToFhir(bundle: fhir4.Bundle) {
    return await axios.post(FHIR_SERVER, bundle, {
        headers: { 'Content-Type': 'application/fhir+json' }
    });
}

async function seedServer() {
    try {
        await pgClient.connect();
        console.log('Connected to PostgreSQL database');

        const files = fs.readdirSync(SYNTHEA_DIR);
        const infraFiles = files.filter(file => file.startsWith('hospital') || file.startsWith('practitioner'));
        const patientFiles = files.filter(file => file.endsWith('.json') && !file.startsWith('hospital') && !file.startsWith('practitioner'));

        console.log(`Found ${infraFiles.length} infrastructure logs and ${patientFiles.length} patient records.`);
        console.log('Uploading infrastructure logs...');
        for (const file of infraFiles) {
            const bundle = loadBundle(path.join(SYNTHEA_DIR, file));
            await uploadToFhir(bundle);
        }
        console.log('Uploading patient records...');
        let userCount = 1;
        let skippedDeceased = 0;
        for (const file of patientFiles) {
            const bundle = loadBundle(path.join(SYNTHEA_DIR, file));
            const patient = getPatientFromBundle(bundle);

            if (isDeceasedPatient(patient)) {
                skippedDeceased++;
                console.log(`Skipping deceased patient in ${file} (deceasedDateTime=${patient?.deceasedDateTime ?? 'n/a'})`);
                continue;
            }

            const fhirResponse = await uploadToFhir(bundle);
            const patientLocation = fhirResponse.data.entry?.find(
                (e: any) => e.response?.location?.includes('Patient/')
            )?.response?.location;
            if (patientLocation) {
                const fhirPatientId = patientLocation.split('/')[1];
                const mockEmail = emailFromPatient(patient, userCount);
                const password = 'Password123';
                const mockPasswordHash = await argon2.hash(password);
                const randomInt = Math.floor(1000 + Math.random() * 9000);
                const mockHealthId = `PAT-${randomInt}`;
                const mockRole = 'patient';
                const sqlInsert =
                    `INSERT INTO users (health_id, role, email, password_hash, fhir_patient_id)
                    VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT (email) DO NOTHING;`;
                await pgClient.query(sqlInsert, [mockHealthId, mockRole, mockEmail, mockPasswordHash, fhirPatientId]);
                console.log(`User ${mockEmail} linked to FHIR ID ${fhirPatientId} in database`);
                userCount++;
            } else {
                console.log(`No patient location found for ${file}`);
            }
        }
        console.log(`All files uploaded successfully! Skipped ${skippedDeceased} deceased patient(s).`);
    } catch (error: any) {
        console.error('Error seeding FHIR server:', error.message);
    } finally {
        await pgClient.end();
        console.log('Disconnected from PostgreSQL database');
    }
}

seedServer();
