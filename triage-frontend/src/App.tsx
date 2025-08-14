import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PatientForm from './components/PatientForm';
import TriageDashboard from './components/TriageDashboard';
import PatientQueue from './pages/PatientQueue';
import { PatientData, TriageResult, PatientRecord } from './types';

function App() {
  const initialPatientData: PatientData = {
    patientId: '', age: '', gender: '', chestPain: false, fever: false,
    breathingDifficulty: false, consciousness: '', pulseRate: '',
    additionalSymptoms: new Set<string>(),
  };

  const [patientData, setPatientData] = useState<PatientData>(initialPatientData);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [patientQueue, setPatientQueue] = useState<PatientRecord[]>([]);

  useEffect(() => {
    try {
      const savedQueue = localStorage.getItem('patientQueue');
      if (savedQueue) {
        const parsedQueue: PatientRecord[] = JSON.parse(savedQueue);
        parsedQueue.forEach(record => {
            if(record.data.additionalSymptoms && Array.isArray(record.data.additionalSymptoms)){
                 record.data.additionalSymptoms = new Set(record.data.additionalSymptoms);
            }
        });
        parsedQueue.sort((a, b) => a.result.esiLevel - b.result.esiLevel);
        setPatientQueue(parsedQueue);
      }
    } catch (e) { console.error("Could not parse patient queue:", e); }
  }, []);

  const handleAssessNewPatient = () => {
    setPatientData(initialPatientData);
    setResult(null);
    setError(null);
  };
  
  const getRecommendedActions = (esiLevel: number): string[] => {
    const actions = {
        1: ['Initiate immediate life-saving interventions', 'Notify trauma team', 'Prepare resuscitation bay'],
        2: ['Fast-track to acute care area', 'Continuous cardiac monitoring', 'Alert charge nurse'],
        3: ['Place in monitored observation area', 'Comprehensive nursing assessment', 'Physician evaluation within 30 mins'],
        4: ['Standard triage assessment', 'Schedule routine physician evaluation', 'Provide comfort measures'],
        5: ['Basic assessment', 'Schedule non-urgent evaluation', 'Provide patient education']
    };
    return actions[esiLevel as keyof typeof actions] || ['Follow standard hospital protocols.'];
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    const apiPayload: { [key: string]: any } = {
      patientId: patientData.patientId,
      age: parseFloat(patientData.age),
      gender: patientData.gender,
      pulse_last: parseFloat(patientData.pulseRate),
    };
    if (patientData.chestPain) apiPayload['chestpain'] = 1;
    if (patientData.fever) apiPayload['fuo'] = 1;
    if (patientData.breathingDifficulty) apiPayload['respdistres'] = 1;
    if (patientData.consciousness === 'Unconscious') apiPayload['cc_unresponsive'] = 1;
    else if (patientData.consciousness === 'Confused' || patientData.consciousness === 'Drowsy') apiPayload['deliriumdementiaamnesticothercognitiv'] = 1;
    patientData.additionalSymptoms.forEach(symptom => { apiPayload[symptom] = 1; });

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(apiPayload) });
      if (!response.ok) throw new Error(`Network error: ${response.statusText}`);
      const apiResult = await response.json();
      if (apiResult.predicted_esi) {
        const finalResult: TriageResult = { esiLevel: apiResult.predicted_esi, actions: getRecommendedActions(apiResult.predicted_esi) };
        setResult(finalResult);
        const newRecord: PatientRecord = { id: patientData.patientId, data: patientData, result: finalResult, timestamp: new Date().toLocaleTimeString() };
        const updatedQueue = [newRecord, ...patientQueue];
        updatedQueue.sort((a, b) => a.result.esiLevel - b.result.esiLevel);
        setPatientQueue(updatedQueue);
        const serializableQueue = updatedQueue.map(r => ({ ...r, data: { ...r.data, additionalSymptoms: Array.from(r.data.additionalSymptoms) } }));
        localStorage.setItem('patientQueue', JSON.stringify(serializableQueue));
      } else { setError(apiResult.error || 'The API returned an unexpected response.'); }
    } catch (err) {
      console.error("API Call failed:", err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route 
              path="/" 
              element={
                <div className="p-8">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Emergency Triage Dashboard</h1>
                    <p className="text-slate-600">AI-powered patient assessment</p>
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div>
                      <PatientForm
                        patientData={patientData}
                        setPatientData={setPatientData}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                      />
                    </div>
                    <div>
                      <TriageDashboard result={result} error={error} isLoading={isLoading} />
                      {result && !isLoading && (
                        <button onClick={handleAssessNewPatient} className="mt-4 w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg">
                          Assess New Patient
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              } 
            />
            <Route 
            path="/queue" 
            element={<PatientQueue />} 
            />
            <Route path="/settings" element={<div className="p-8"><h1 className="text-3xl font-bold">Settings</h1></div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;