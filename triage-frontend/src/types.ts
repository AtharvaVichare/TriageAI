export interface PatientData {
  patientId: string;
  age: string;
  gender: string;
  chestPain: boolean;
  fever: boolean;
  breathingDifficulty: boolean;
  consciousness: string;
  pulseRate: string;
  additionalSymptoms: Set<string>;
}

export interface TriageResult {
  esiLevel: number;
  actions: string[];
}

export interface PatientRecord {
  id: string; 
  data: PatientData;
  result: TriageResult;
  timestamp: string;
}