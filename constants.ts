
import { BPCategory } from "./types";

export const BP_CATEGORIES_INFO = {
    [BPCategory.Normal]: {
        range: "SYSTOLIC < 120 and DIASTOLIC < 80",
        color: "bg-green-500",
        textColor: "text-green-800 dark:text-green-200",
        borderColor: "border-green-500",
        hexColor: "22C55E",
        description: "Your blood pressure is in the normal range. Keep up the healthy habits!",
    },
    [BPCategory.Elevated]: {
        range: "SYSTOLIC 120-129 and DIASTOLIC < 80",
        color: "bg-yellow-400",
        textColor: "text-yellow-800 dark:text-yellow-200",
        borderColor: "border-yellow-400",
        hexColor: "FACC15",
        description: "Your blood pressure is elevated. Lifestyle changes are recommended to prevent hypertension.",
    },
    [BPCategory.Hypertension1]: {
        range: "SYSTOLIC 130-139 or DIASTOLIC 80-89",
        color: "bg-orange-500",
        textColor: "text-orange-800 dark:text-orange-200",
        borderColor: "border-orange-500",
        hexColor: "F97316",
        description: "You have Stage 1 Hypertension. Your doctor may recommend lifestyle changes and possibly medication.",
    },
    [BPCategory.Hypertension2]: {
        range: "SYSTOLIC >= 140 or DIASTOLIC >= 90",
        color: "bg-red-500",
        textColor: "text-red-800 dark:text-red-200",
        borderColor: "border-red-500",
        hexColor: "EF4444",
        description: "You have Stage 2 Hypertension. Your doctor will likely prescribe medication and recommend lifestyle changes.",
    },
    [BPCategory.HypertensiveCrisis]: {
        range: "SYSTOLIC > 180 and/or DIASTOLIC > 120",
        color: "bg-red-700",
        textColor: "text-red-800 dark:text-red-100",
        borderColor: "border-red-700",
        hexColor: "B91C1C",
        description: "This is a Hypertensive Crisis. Consult your doctor immediately.",
    },
};