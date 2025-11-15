
import React, { useState, useMemo, forwardRef } from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, AreaChart, Area, ReferenceLine
} from 'recharts';
import { Reading } from '../types';

interface BloodPressureChartProps {
  readings: Reading[];
}

type ChartType = 'line' | 'bar' | 'area';

const ChartToggleButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            isActive
                ? 'bg-brand-primary text-white shadow'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
        }`}
    >
        {label}
    </button>
);


const BloodPressureChart = forwardRef<HTMLDivElement, BloodPressureChartProps>(({ readings }, ref) => {
  const [chartType, setChartType] = useState<ChartType>('line');

  const chartData = useMemo(() => readings
    .map(r => ({
      ...r,
      name: `${new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })} ${r.timeOfDay.charAt(0)}`,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [readings]);
    
  const averages = useMemo(() => {
    if (readings.length < 2) {
      return null;
    }
    const total = readings.reduce((acc, r) => ({
      systolic: acc.systolic + r.systolic,
      diastolic: acc.diastolic + r.diastolic,
      pulse: acc.pulse + r.pulse
    }), { systolic: 0, diastolic: 0, pulse: 0 });

    return {
      systolic: Math.round(total.systolic / readings.length),
      diastolic: Math.round(total.diastolic / readings.length),
      pulse: Math.round(total.pulse / readings.length),
    };
  }, [readings]);


  if (readings.length === 0) {
    return (
         <div ref={ref} className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow h-80 flex items-center justify-center">
            <p className="text-slate-500 dark:text-slate-400">Record readings to see your trend chart.</p>
        </div>
    );
  }

  const renderChart = () => {
    const commonProps = {
        data: chartData,
        margin: { top: 5, right: 20, left: -10, bottom: 5 }
    };

    const ChartComponents = {
        Grid: <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />,
        XAxis: <XAxis dataKey="name" tick={{ fill: 'rgb(100 116 139)' }} fontSize={12} />,
        YAxis: <YAxis tick={{ fill: 'rgb(100 116 139)' }} domain={['dataMin - 10', 'dataMax + 10']} />,
        Tooltip: <Tooltip 
                    contentStyle={{
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        borderColor: 'rgb(51 65 85)',
                        color: '#fff'
                    }}
                    labelStyle={{ fontWeight: 'bold' }}
                />,
        Legend: <Legend />,
        AvgLines: averages && (
            <>
                <ReferenceLine y={averages.systolic} stroke="#ef4444" strokeDasharray="3 3" isFront={true} />
                <ReferenceLine y={averages.diastolic} stroke="#3b82f6" strokeDasharray="3 3" isFront={true} />
                <ReferenceLine y={averages.pulse} stroke="#10b981" strokeDasharray="3 3" isFront={true} />
            </>
        )
    };
    
    switch(chartType) {
        case 'bar':
            return (
                <BarChart {...commonProps}>
                    {ChartComponents.Grid}
                    {ChartComponents.XAxis}
                    {ChartComponents.YAxis}
                    {ChartComponents.Tooltip}
                    {ChartComponents.Legend}
                    {ChartComponents.AvgLines}
                    <Bar dataKey="systolic" fill="#ef4444" name="Systolic" />
                    <Bar dataKey="diastolic" fill="#3b82f6" name="Diastolic" />
                    <Bar dataKey="pulse" fill="#10b981" name="Pulse" />
                </BarChart>
            );
        case 'area':
             return (
                <AreaChart {...commonProps}>
                    <defs>
                        <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorDia" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    {ChartComponents.Grid}
                    {ChartComponents.XAxis}
                    {ChartComponents.YAxis}
                    {ChartComponents.Tooltip}
                    {ChartComponents.Legend}
                    {ChartComponents.AvgLines}
                    <Area type="monotone" dataKey="systolic" stroke="#ef4444" fill="url(#colorSys)" name="Systolic" />
                    <Area type="monotone" dataKey="diastolic" stroke="#3b82f6" fill="url(#colorDia)" name="Diastolic" />
                    <Area type="monotone" dataKey="pulse" stroke="#10b981" fill="transparent" name="Pulse" />
                </AreaChart>
             );
        case 'line':
        default:
            return (
                <LineChart {...commonProps}>
                    {ChartComponents.Grid}
                    {ChartComponents.XAxis}
                    {ChartComponents.YAxis}
                    {ChartComponents.Tooltip}
                    {ChartComponents.Legend}
                    {ChartComponents.AvgLines}
                    <Line type="monotone" dataKey="systolic" stroke="#ef4444" activeDot={{ r: 8 }} name="Systolic" />
                    <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" name="Diastolic" />
                    <Line type="monotone" dataKey="pulse" stroke="#10b981" strokeDasharray="5 5" name="Pulse" />
                </LineChart>
            );
    }
  }

  return (
    <div ref={ref} className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
            <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Your Trend</h3>
                {averages && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Avg:{' '}
                        <span className="font-semibold text-red-500">{averages.systolic}</span> / {' '}
                        <span className="font-semibold text-blue-500">{averages.diastolic}</span> | Pulse:{' '}
                        <span className="font-semibold text-brand-primary">{averages.pulse}</span>
                    </p>
                )}
            </div>
            <div className="flex space-x-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg mt-2 sm:mt-0">
                <ChartToggleButton label="Line" isActive={chartType === 'line'} onClick={() => setChartType('line')} />
                <ChartToggleButton label="Bar" isActive={chartType === 'bar'} onClick={() => setChartType('bar')} />
                <ChartToggleButton label="Area" isActive={chartType === 'area'} onClick={() => setChartType('area')} />
            </div>
        </div>
        <div className="h-80 w-full">
            <ResponsiveContainer>
                {renderChart()}
            </ResponsiveContainer>
        </div>
    </div>
  );
});

export default BloodPressureChart;