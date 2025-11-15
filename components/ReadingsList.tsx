import React from 'react';
import { Reading } from '../types';
import { DeleteIcon, MorningIcon, EveningIcon } from './Icons';
import { getBPCategory } from '../utils/bpUtils';
import { BP_CATEGORIES_INFO } from '../constants';


const ReadingItem: React.FC<{ reading: Reading; onDelete: (id: number) => void; }> = ({ reading, onDelete }) => {
    const category = getBPCategory(reading.systolic, reading.diastolic);
    const categoryInfo = BP_CATEGORIES_INFO[category];

    return (
        <li className={`flex items-center space-x-4 p-4 rounded-lg bg-white dark:bg-slate-800 border-l-4 ${categoryInfo.borderColor} shadow-sm`}>
            <div className="flex-shrink-0">
                {reading.timeOfDay === 'Morning' ? <MorningIcon className="h-8 w-8 text-yellow-400" /> : <EveningIcon className="h-8 w-8 text-indigo-400" />}
            </div>
            <div className="flex-grow">
                <div className="flex items-center justify-between">
                    <div className="flex items-baseline space-x-2">
                        <p className="font-bold text-xl text-slate-800 dark:text-white">{reading.systolic} / {reading.diastolic}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">mmHg</p>
                    </div>
                    <div className={`px-2 py-1 text-xs font-semibold rounded-full ${categoryInfo.color} text-white`}>
                        {category}
                    </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{new Date(reading.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} - {reading.timeOfDay} #{reading.readingNumber}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pulse: {reading.pulse} bpm</p>
                 {reading.notes && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 italic">Note: {reading.notes}</p>
                )}
            </div>
            <button onClick={() => onDelete(reading.id)} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition ml-2">
                <DeleteIcon className="h-5 w-5" />
            </button>
        </li>
    );
}

const ReadingsList: React.FC<{ readings: Reading[]; onDelete: (id: number) => void; }> = ({ readings, onDelete }) => {
  if (readings.length === 0) {
    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow text-center">
            <h3 className="text-xl font-semibold mb-2">No Readings Yet</h3>
            <p className="text-slate-500 dark:text-slate-400">Click the '+' button to add your first blood pressure reading.</p>
        </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">History</h3>
      <ul className="space-y-3">
        {readings.map(reading => (
          <ReadingItem key={reading.id} reading={reading} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  );
};

export default ReadingsList;