import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Heart } from 'lucide-react';
import { TriageResult } from '../types';

interface TriageDashboardProps {
  result: TriageResult | null;
  error: string | null;
  isLoading: boolean;
}

const TriageDashboard: React.FC<TriageDashboardProps> = ({ result, error, isLoading }) => {
  const getESIColor = (level: number) => {
    if (level <= 2) return 'text-red-600';
    if (level === 3) return 'text-amber-600';
    return 'text-green-600';
  };
  const getESIBackground = (level: number) => {
    if (level <= 2) return 'bg-red-50 border-red-200';
    if (level === 3) return 'bg-amber-50 border-amber-200';
    return 'bg-green-50 border-green-200';
  };
  const getUrgencyIcon = (level: number) => {
    if (level <= 2) return <AlertTriangle className="w-8 h-8 text-red-600" />;
    if (level === 3) return <Clock className="w-8 h-8 text-amber-600" />;
    return <CheckCircle className="w-8 h-8 text-green-600" />;
  };
  const getUrgencyLabel = (level: number) => {
    if (level === 1) return 'IMMEDIATE'; if (level === 2) return 'EMERGENT';
    if (level === 3) return 'URGENT'; if (level === 4) return 'LESS URGENT';
    return 'NON-URGENT';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 h-full flex items-center justify-center">
        <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div><h3 className="text-lg font-semibold text-slate-800 mb-2">Processing Assessment</h3><p className="text-slate-600">Analyzing patient data...</p></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 h-full flex items-center justify-center">
        <div className="text-center"><AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" /><h3 className="text-lg font-semibold text-slate-800 mb-2">Assessment Error</h3><p className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p></div>
      </div>
    );
  }
  if (!result) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 h-full flex items-center justify-center">
        <div className="text-center"><div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><Heart className="w-8 h-8 text-slate-400" /></div><h3 className="text-lg font-semibold text-slate-800 mb-2">Ready for Assessment</h3><p className="text-slate-500">Prediction results will appear here.</p></div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 h-full">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">Triage Assessment</h2>
      <div className={`${getESIBackground(result.esiLevel)} rounded-xl p-6 mb-6 border-2`}>
        <div className="text-center mb-4"><div className="flex items-center justify-center gap-3 mb-2">{getUrgencyIcon(result.esiLevel)}<span className={`text-6xl font-bold ${getESIColor(result.esiLevel)}`}>{result.esiLevel}</span></div><p className={`text-sm font-semibold ${getESIColor(result.esiLevel)} mb-1`}>ESI LEVEL {result.esiLevel}</p><p className={`text-xs font-medium ${getESIColor(result.esiLevel)} opacity-80`}>{getUrgencyLabel(result.esiLevel)}</p></div>
      </div>
      <div><h3 className="text-lg font-semibold text-slate-800 mb-4">Recommended Actions</h3><div className="space-y-3">{result.actions.map((action, index) => (<div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" /><span className="text-slate-700 text-sm">{action}</span></div>))}</div></div>
    </div>
  );
};
export default TriageDashboard;