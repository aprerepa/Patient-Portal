import axios from "axios";

export const FHIR_BASE_URL = process.env.FHIR_BASE_URL;
export interface FHIRObservationResource {
    resourceType: 'Observation';
    id?: string;
    status: string;
    effectiveDateTime?: string;
    code?: {
        text?: string;
        coding?: Array<{
            system?: string;
            code?: string;
            display?: string;
        }>;
    };
    valueQuantity?: {
        value?: number;
        unit?: string;
        system?: string;
        code?: string;
    };
}

export interface FHIRBundleEntry {
    fullUrl?: string;
    resource: FHIRObservationResource & { [key: string]: any };
}

export interface FHIRBundle {
    resourceType: 'Bundle';
    id?: string;
    type: string;
    total?: number;
    entry?: FHIRBundleEntry[];
}

export async function fetchPatientMedicalData(resourceType: string, fhirPatientId: string, additionalParams = ''): Promise<FHIRBundle> {
    try {
        const url = `${FHIR_BASE_URL}/${resourceType}?patient=${fhirPatientId}${additionalParams}`;
        const response = await axios.get<FHIRBundle>(url, {
            headers: {
                'Accept': 'application/fhir+json'
            }
        });
        return response.data;
    } catch (error: any) {
        console.error(`FHIR Service Error [${resourceType}] for Patient [${fhirPatientId}]:`, error.message);
        throw new Error(`Failed to retrieve clinical data for ${resourceType} from downstream health system.`);
    }
}

export async function fetchFhirPatient(fhirPatientId: string) {
    const response = await axios.get(`${FHIR_BASE_URL}/Patient/${fhirPatientId}`, {
        headers: { Accept: "application/fhir+json" },
    });
    return response.data;
}

export function getPatientNameFromFhir(patient: any): { firstName: string | null; lastName: string | null } {
    const official =
        patient?.name?.find((n: any) => n.use === "official") ||
        patient?.name?.[0];

    return {
        firstName: official?.given?.[0] ?? null,
        lastName: official?.family ?? null,
    };
}
