
import { BPCategory } from '../types';

export const getBPCategory = (systolic: number, diastolic: number): BPCategory => {
  if (systolic > 180 || diastolic > 120) {
    return BPCategory.HypertensiveCrisis;
  }
  if (systolic >= 140 || diastolic >= 90) {
    return BPCategory.Hypertension2;
  }
  if (systolic >= 130 || diastolic >= 80) {
    return BPCategory.Hypertension1;
  }
  if (systolic >= 120 && diastolic < 80) {
    return BPCategory.Elevated;
  }
  return BPCategory.Normal;
};
