import React, { useState, useEffect } from 'react';
import { Reading } from '../types';

interface ReadingFormModalProps {
  onClose: () => void;
  onSave: (reading: Omit<Reading, 'id' | 'userId'>) => void;
  readings: Reading[];
}

const ReadingFormModal: React.FC<ReadingFormModalProps> = ({ onClose, onSave, readings }) => {
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [pulse, setPulse] = useState('70');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);

  const getInitialTimeOfDay = () => {
    const hours = new Date().getHours();
    // Morning is generally considered from 4am to 11:59am
    return hours >= 4 && hours < 12 ? 'Morning' : 'Evening';
  };
  const [timeOfDay, setTimeOfDay] = useState<'Morning' | 'Evening'>(getInitialTimeOfDay());
  const [readingNumber, setReadingNumber] = useState<1 | 2>(1);

  useEffect(() => {
    const readingsForSelectedDateTime = readings.filter(r => r.date === date && r.timeOfDay === timeOfDay);
    const newReadingNumber = (readingsForSelectedDateTime.length % 2) + 1 as 1 | 2;
    setReadingNumber(newReadingNumber);
  }, [date, timeOfDay, readings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sys = parseInt(systolic, 10);
    const dia = parseInt(diastolic, 10);
    const pul = parseInt(pulse, 10);

    if (isNaN(sys) || isNaN(dia) || isNaN(pul) || sys <= 0 || dia <= 0 || pul <= 0) {
      setError('Please enter valid, positive numbers for all fields.');
      return;
    }
     if (sys <= dia) {
      setError('Systolic pressure must be higher than diastolic pressure.');
      return;
    }

    setError('');
    onSave({
      date,
      timeOfDay: timeOfDay,
      readingNumber: readingNumber,
      systolic: sys,
      diastolic: dia,
      pulse: pul,
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">New Reading</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            For {timeOfDay} Reading #{readingNumber}
          </p>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="systolic" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Systolic (SYS)</label>
              <input type="number" id="systolic" value={systolic} onChange={e => setSystolic(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50" required autoFocus />
            </div>
            <div>
              <label htmlFor="diastolic" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Diastolic (DIA)</label>
              <input type="number" id="diastolic" value={diastolic} onChange={e => setDiastolic(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50" required />
            </div>
            <div>
              <label htmlFor="pulse" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pulse</label>
              <input type="number" id="pulse" value={pulse} onChange={e => setPulse(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50" required />
            </div>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50" required/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Time of Day</label>
                    <div className="mt-1 flex items-center space-x-1 rounded-lg bg-slate-100 dark:bg-slate-700 p-1">
                        <label className={`w-full text-center px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer transition-colors ${timeOfDay === 'Morning' ? 'bg-brand-primary text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}>
                            <input type="radio" name="timeOfDay" value="Morning" checked={timeOfDay === 'Morning'} onChange={() => setTimeOfDay('Morning')} className="sr-only" aria-label="Morning"/>
                            Morning
                        </label>
                        <label className={`w-full text-center px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer transition-colors ${timeOfDay === 'Evening' ? 'bg-brand-primary text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}>
                            <input type="radio" name="timeOfDay" value="Evening" checked={timeOfDay === 'Evening'} onChange={() => setTimeOfDay('Evening')} className="sr-only" aria-label="Evening"/>
                            Evening
                        </label>
                    </div>
                </div>
            </div>
             <div className="mb-6">
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Notes (Optional)</label>
                <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50" placeholder="e.g., Feeling stressed, after workout..."></textarea>
            </div>


          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 transition">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-brand-primary text-white hover:bg-brand-secondary transition">Save Reading</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReadingFormModal;