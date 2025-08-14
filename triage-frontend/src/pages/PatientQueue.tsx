// src/pages/PatientQueue.tsx

import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

// Define the structure of the data we expect from the backend
interface QueueRecord {
  id: number;
  patient_id: string;
  age: number;
  gender: string;
  predicted_esi: number;
  assessment_time: string;
}

const PatientQueue: React.FC = () => {
  const [queue, setQueue] = useState<QueueRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/queue');
        if (!response.ok) {
          throw new Error('Failed to fetch queue from the server.');
        }
        const data: QueueRecord[] = await response.json();
        setQueue(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQueue();
  }, []); // The empty array means this runs once when the component mounts

  const getESIColor = (level: number) => {
    if (level <= 2) return 'text-red-600';
    if (level === 3) return 'text-amber-600';
    return 'text-green-600';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600"/>
          Live Patient Queue
        </h1>
        <p className="text-slate-600">Live list of the 50 most recent assessments from the database, prioritized by severity.</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3">Predicted ESI</th>
                <th scope="col" className="px-6 py-3">Patient ID</th>
                <th scope="col" className="px-6 py-3">Time</th>
                <th scope="col" className="px-6 py-3">Age</th>
                <th scope="col" className="px-6 py-3">Gender</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-10">Loading queue from database...</td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="text-center py-10 text-red-500">{error}</td></tr>
              ) : queue.length > 0 ? (
                queue.map(record => (
                  <tr key={record.id} className="bg-white border-b hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-lg">
                      <span className={getESIColor(record.predicted_esi)}>{record.predicted_esi}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{record.patient_id}</td>
                    <td className="px-6 py-4">{new Date(record.assessment_time).toLocaleTimeString()}</td>
                    <td className="px-6 py-4">{record.age}</td>
                    <td className="px-6 py-4">{record.gender}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="text-center py-10 text-slate-500">The patient queue is empty.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientQueue;