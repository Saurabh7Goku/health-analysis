import { NextResponse } from "next/server";
import { callDietAi } from "../gemini";

export async function POST(request: Request) {
    console.log('API /dietplan called', new Date().toISOString());
    const data = await request.json();
    const {
      name,
      age,
      gender,
      height,
      weight,
      activityLevel,
      healthConditions,
      dietType,
      micronutrientDeficiency,
      allergies,
      medicalConditions
  } = data;
  
    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    let bmiInterpretation = '';
    if (bmi < 18.5) bmiInterpretation = 'Underweight';
    else if (bmi < 25) bmiInterpretation = 'Normal weight';
    else if (bmi < 30) bmiInterpretation = 'Overweight';
    else bmiInterpretation = 'Obese';
  
    // Calculate BMR
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
  
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      lightly: 1.375,
      moderately: 1.55,
      very: 1.725,
    };
    const calorieNeeds = bmr * activityMultipliers[activityLevel];
  
    const payload = {
      name,
      age,
      gender,
      height,
      weight,
      activityLevel,
      bmi: { value: bmi, interpretation: bmiInterpretation },
      bmr,
      calorieNeeds,
      healthConditions,
      dietType,
      micronutrientDeficiency,
      allergies,
      medicalConditions
    };
  
    // Call the diet AI function to get the diet plan text
    const dietPlanText = await callDietAi(payload);
  
    return NextResponse.json({
      name,
      gender,
      height,
      weight,
      bmi: { value: bmi, interpretation: bmiInterpretation },
      bmr,
      calorieNeeds,
      dietPlan: dietPlanText, 
    });
  }
  