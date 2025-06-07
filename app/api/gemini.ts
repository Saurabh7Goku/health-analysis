export interface HealthPayload {
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;
  healthConditions?: string;
  bmi: {
    value: number;
    interpretation: string;
  };
  bmr: number;
  calorieNeeds: number;
}

export async function callGemini(payload: HealthPayload): Promise<string> {
  const prompt = `
You are a health expert. Based on the following information, generate personalized health recommendations in bullet points.
Include 3 points on fitness,
Include 3 points on diet
Include 3 points on how to impove given Health Condition: ${payload.healthConditions ? payload.healthConditions : "None"}

Return response only for the provided information in the bullet points, no explanation.
Be concise and no need to give extra information just some recommendation.

Age: ${payload.age}
Gender: ${payload.gender}
Height: ${payload.height} cm
Weight: ${payload.weight} kg
BMI: ${payload.bmi.value.toFixed(1)} (${payload.bmi.interpretation})
BMR: ${payload.bmr.toFixed(0)} kcal/day
Calorie Needs: ${payload.calorieNeeds.toFixed(0)} kcal/day
Activity Level: ${payload.activityLevel}
`

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing");
    return "• Gemini API key is missing.";
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,       // Higher = more creativity
          topK: 40,               // Consider top 40 tokens
          topP: 0.95,             // Use 95% cumulative probability sampling
        },
      }),
    }
  );
  

  const data = await res.json();

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "• Unable to generate recommendations.";
}
