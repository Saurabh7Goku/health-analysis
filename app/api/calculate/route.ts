import { NextResponse } from 'next/server';
import { callGemini } from '@/app/api/gemini';

export async function POST(request: Request) {
    console.log('API /calculate called', new Date().toISOString()); // Debug log
    const data = await request.json();
    const { name, age, gender, height, weight, activityLevel, healthConditions,dietType,
        micronutrientDeficiency,
        allergies,
        medicalConditions } = data;

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    let bmiInterpretation = '';
    if (bmi < 18.5) bmiInterpretation = 'Underweight';
    else if (bmi < 25) bmiInterpretation = 'Normal weight';
    else if (bmi < 30) bmiInterpretation = 'Overweight';
    else bmiInterpretation = 'Obese';

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

    const text = await callGemini(payload);
    const recommendations = text
        .split('\n')
        .filter(line =>
            line.trim().startsWith('•') ||
            line.trim().startsWith('-') ||
            line.trim().startsWith('*')
        )
        .map(line => line.replace(/^[-•*]\s*/, '').trim());

    return NextResponse.json({
        name,
        gender,
        height,
        weight,
        bmi: { value: bmi, interpretation: bmiInterpretation },
        bmr,
        calorieNeeds,
        recommendations,
    });
}