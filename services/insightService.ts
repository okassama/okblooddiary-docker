
import { Reading, BPCategory } from '../types';
import { getBPCategory } from '../utils/bpUtils';

export const getBasicInsights = (readings: Reading[]): string => {
    if (readings.length < 3) {
        return "Record at least 3 readings to see basic insights.";
    }

    const recentReadings = readings.slice(0, 14);

    const totals = recentReadings.reduce((acc, r) => {
        acc.systolic += r.systolic;
        acc.diastolic += r.diastolic;
        return acc;
    }, { systolic: 0, diastolic: 0 });

    const avgSystolic = Math.round(totals.systolic / recentReadings.length);
    const avgDiastolic = Math.round(totals.diastolic / recentReadings.length);
    const avgCategory = getBPCategory(avgSystolic, avgDiastolic);

    const categoryCounts = recentReadings.reduce((acc, r) => {
        const category = getBPCategory(r.systolic, r.diastolic);
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {} as Record<BPCategory, number>);

    let insights: string[] = [];

    insights.push(`Your average over the last ${recentReadings.length} reading${recentReadings.length > 1 ? 's' : ''} is **${avgSystolic}/${avgDiastolic} mmHg**, which falls into the **'${avgCategory}'** category.`);

    const highCategories = Object.keys(categoryCounts).filter(c => c !== BPCategory.Normal) as BPCategory[];
    if (highCategories.length > 0) {
        const mostFrequentHighCat = highCategories.sort((a,b) => categoryCounts[b] - categoryCounts[a])[0];
        const count = categoryCounts[mostFrequentHighCat];
        insights.push(`Your most frequent elevated category recently was **'${mostFrequentHighCat}'**, with **${count} reading${count > 1 ? 's' : ''}** in this range.`);
    } else {
        insights.push(`Great job! All your recent readings have been in the 'Normal' range.`);
    }

    if (recentReadings.length >= 5) {
        const firstHalfAvg = recentReadings.slice(Math.ceil(recentReadings.length / 2)).reduce((acc, r) => acc + r.systolic, 0) / Math.floor(recentReadings.length / 2);
        const secondHalfAvg = recentReadings.slice(0, Math.floor(recentReadings.length / 2)).reduce((acc, r) => acc + r.systolic, 0) / Math.floor(recentReadings.length / 2);
        const systolicChange = secondHalfAvg - firstHalfAvg;
        
        if (systolicChange > 5) {
            insights.push(`There might be a slight upward trend in your systolic pressure recently. It's a good idea to monitor this.`);
        } else if (systolicChange < -5) {
            insights.push(`Your recent systolic pressure shows a downward trend. Keep up the positive habits!`);
        }
    }
    
    insights.push(`These are automated observations. For a detailed analysis, consult your doctor or enable AI-powered insights in the settings.`);

    return insights.map(insight => `• ${insight}`).join('\n\n');
};
