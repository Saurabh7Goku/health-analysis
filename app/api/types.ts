import { z } from 'zod';

export interface HealthResults {
    name: string;
    weight: number;
    height: number;
    gender: string;
    bmi: {
      value: number;
      interpretation: string;
    };
    bmr: number;
    calorieNeeds: number;
    recommendations: string[];
  }
  


  // Reuse your schema if it's also shared:
  export const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    age: z.number().min(1).max(120),
    gender: z.enum(['male', 'female']),
    height: z.number().min(50).max(300),
    weight: z.number().min(10).max(500),
    activityLevel: z.enum(['sedentary', 'lightly', 'moderately', 'very']),
    healthConditions: z.string().optional(),
  });
  
  export type FormData = z.infer<typeof schema>;
  
  export interface HealthResults {
    name: string;
    bmi: {
      value: number;
      interpretation: string;
    };
    bmr: number;
    calorieNeeds: number;
    recommendations: string[];
  }
  
  export interface HealthFormProps {
    results: HealthResults | null;
    setResults: React.Dispatch<React.SetStateAction<HealthResults | null>>;
  }
  