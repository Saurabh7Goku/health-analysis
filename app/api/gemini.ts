export interface HealthPayload {
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;
  bmi: {
    value: number;
    interpretation: string;
  };
  bmr: number;
  calorieNeeds: number;
  healthConditions?: string;
}

export async function callGemini(payload: HealthPayload): Promise<string> {
  const prompt = `
You are a health expert. Based on the following information, generate personalized health recommendations in bullet points.
Include 3 points on fitness,
Include 3 points on diet
Include a brief few points on how to impove given ${payload.healthConditions ? `Health Conditions: ${payload.healthConditions}` : ''}

Return response only for the provided information 
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
          topP: 0.95,             // Use 95% cumulative probability
        },
      }),
    }
  );
  console.log("callGemini → healthConditions:", payload.healthConditions);
  
  const data = await res.json();

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "• Unable to generate recommendations.";
}


export async function callDietAi(payload: HealthPayload): Promise<string> {
  const prompt = `You are a certified nutritionist AI. Based on the following physical and lifestyle information, 
  generate a personalized, structured, and goal-oriented diet plan for the user. The diet should be realistic, sustainable, 
  and aimed at optimizing their health.

  User Details:
  
  Age: ${payload.age}
  
  Gender: ${payload.gender}
  
  Height: ${payload.height} cm
  
  Weight: ${payload.weight} kg
  
  BMI: ${payload.bmi.value.toFixed(1)} (${payload.bmi.interpretation})
  
  BMR: ${payload.bmr.toFixed(0)} kcal/day
  
  Calorie Needs: ${payload.calorieNeeds.toFixed(0)} kcal/day
  
  Activity Level: ${payload.activityLevel}

  ${payload.healthConditions ? `Health Conditions: ${payload.healthConditions}` : ''}
  
  Instructions:
  
  Briefly explain what the BMI and BMR indicate about the person's body condition.
  
  Clearly state the user's recommended daily caloric intake based on their BMR and activity level.
  
  Provide a structured meal plan:
  
  Breakfast
  
  Mid-morning snack
  
  Lunch
  
  Evening snack
  
  Dinner
  
  Each meal should include:
  
  Food items with portion sizes
  
  Approximate calories per meal
  
  Balanced macro distribution (carbs, protein, fats)
  
  Add a list of foods to avoid and foods to prioritize.
  
  Recommend how often the user should review or adjust their diet.
  
  Provide the plan in a clean and easy-to-read format, suitable for users with no nutrition background.
`

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
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
          temperature: 0.75,       // Higher = more creativity
          topK: 40,               // Consider top 40 tokens
          topP: 0.95,             // Use 95% cumulative probability
        },
      }),
    }
  );
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "• Unable to generate recommendations.";
}