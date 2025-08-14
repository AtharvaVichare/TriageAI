import React, { useState, useMemo } from 'react';
import { Heart, User, Calendar, Thermometer, Zap, Search, X, AlertCircle } from 'lucide-react';
import { allSymptoms, symptomMap } from '../data/symptomMap';
import { PatientData } from '../types';

interface PatientFormProps {
  patientData: PatientData;
  setPatientData: React.Dispatch<React.SetStateAction<PatientData>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({ patientData, setPatientData, onSubmit, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const isFormValid = !!(patientData.patientId && patientData.age && patientData.gender && patientData.consciousness && patientData.pulseRate);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) onSubmit();
  };
  const handleSymptomSelect = (symptomId: string) => {
    const newSymptoms = new Set(patientData.additionalSymptoms);
    if (newSymptoms.has(symptomId)) newSymptoms.delete(symptomId);
    else newSymptoms.add(symptomId);
    setPatientData({ ...patientData, additionalSymptoms: newSymptoms });
  };
  const filteredSymptoms = useMemo(() => allSymptoms.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);
  const selectedSymptomsArray = Array.from(patientData.additionalSymptoms);
  const ToggleSwitch: React.FC<{
    label: string; checked: boolean; onChange: (checked: boolean) => void; icon: React.ReactNode;
  }> = ({ label, checked, onChange, icon }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-center gap-3"><div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div><span className="font-medium text-slate-700">{label}</span></div>
      <button type="button" onClick={() => onChange(!checked)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-300'}`} disabled={isLoading}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}/>
      </button>
    </div>
  );
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-blue-100 rounded-lg"><User className="w-6 h-6 text-blue-600" /></div><h2 className="text-xl font-semibold text-slate-800">Patient Assessment</h2></div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div><label htmlFor="patientId" className="block text-sm font-medium text-slate-700 mb-2">Patient Name <span className="text-red-500">*</span></label><input type="text" id="patientId" required value={patientData.patientId} onChange={(e) => setPatientData({ ...patientData, patientId: e.target.value })} placeholder="e.g., John Doe" className="w-full px-4 py-3 border border-slate-300 rounded-lg" disabled={isLoading} /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-2">Age <span className="text-red-500">*</span></label><div className="relative"><Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="number" id="age" min="0" max="120" required value={patientData.age} onChange={(e) => setPatientData({ ...patientData, age: e.target.value })} placeholder="e.g., 55" className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg" disabled={isLoading} /></div></div>
          <div><label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-2">Gender <span className="text-red-500">*</span></label><select id="gender" required value={patientData.gender} onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg" disabled={isLoading}><option value="">Select gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
          <div><label htmlFor="consciousness" className="block text-sm font-medium text-slate-700 mb-2">Consciousness <span className="text-red-500">*</span></label><select id="consciousness" required value={patientData.consciousness} onChange={(e) => setPatientData({ ...patientData, consciousness: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-lg" disabled={isLoading}><option value="">Select level</option><option value="Alert">Alert</option><option value="Confused">Confused</option><option value="Drowsy">Drowsy</option><option value="Unconscious">Unconscious</option></select></div>
          <div><label htmlFor="pulseRate" className="block text-sm font-medium text-slate-700 mb-2">Pulse Rate (BPM) <span className="text-red-500">*</span></label><input type="number" id="pulseRate" min="30" max="200" required value={patientData.pulseRate} onChange={(e) => setPatientData({ ...patientData, pulseRate: e.target.value })} placeholder="e.g., 85" className="w-full px-4 py-3 border border-slate-300 rounded-lg" disabled={isLoading} /></div>
        </div>
        <div><h3 className="text-lg font-medium text-slate-800 mb-4">Primary Symptoms</h3><div className="space-y-3"><ToggleSwitch label="Chest Pain" checked={patientData.chestPain} onChange={(checked) => setPatientData({ ...patientData, chestPain: checked })} icon={<Heart className="w-5 h-5 text-red-500" />}/><ToggleSwitch label="Fever" checked={patientData.fever} onChange={(checked) => setPatientData({ ...patientData, fever: checked })} icon={<Thermometer className="w-5 h-5 text-orange-500" />}/><ToggleSwitch label="Breathing Difficulty" checked={patientData.breathingDifficulty} onChange={(checked) => setPatientData({ ...patientData, breathingDifficulty: checked })} icon={<Zap className="w-5 h-5 text-blue-500" />}/></div></div>
        <div><h3 className="text-lg font-medium text-slate-800 mb-4">Additional Symptoms</h3><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"/><input type="text" placeholder="Search and select symptoms..." className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg mb-2" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/></div><div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1">{filteredSymptoms.map(symptom => (<div key={symptom.id} onClick={() => handleSymptomSelect(symptom.id)} className={`p-2 rounded-md cursor-pointer text-sm ${patientData.additionalSymptoms.has(symptom.id) ? 'bg-blue-100 text-blue-800 font-semibold' : 'hover:bg-slate-100'}`}>{symptom.name}</div>))}</div>{selectedSymptomsArray.length > 0 && (<div className="mt-2 flex flex-wrap gap-2">{selectedSymptomsArray.map(symptomId => (<div key={symptomId} className="bg-slate-200 text-slate-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">{symptomMap[symptomId] || symptomId}<button type="button" onClick={() => handleSymptomSelect(symptomId)}><X className="w-3 h-3"/></button></div>))}</div>)}</div>
        <button type="submit" disabled={!isFormValid || isLoading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 shadow-lg">{isLoading ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Analyzing...</>) : (<><Heart className="w-5 h-5" /> Get ESI Prediction</>)}</button>
        {!isFormValid && !isLoading && (<div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2"><AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" /><p className="text-sm text-amber-800">Please complete all required fields (*) to enable prediction.</p></div>)}
      </form>
    </div>
  );
};
export default PatientForm;