export async function callGemini(payload: any): Promise<string> {
    

    const prompt = `
  You are a health expert. Based on the following information, generate personalized health recommendations in bullet points.
  Include fitness, diet with 3 points each.
  Be concise and no need to give extra information just some recommendation

  Age: ${payload.age}
  Gender: ${payload.gender}
  Height: ${payload.height} cm
  Weight: ${payload.weight} kg
  BMI: ${payload.bmi.value.toFixed(1)} (${payload.bmi.interpretation})
  BMR: ${payload.bmr.toFixed(0)} kcal/day
  Calorie Needs: ${payload.calorieNeeds.toFixed(0)} kcal/day
  Activity Level: ${payload.activityLevel}

  ${payload.healthConditions ? `\nHealth Conditions: ${payload.healthConditions}\nAdd a few extra points on how to manage or improve these conditions.` : ''}
  Return only the bullet points, no explanation.
    `.trim();

    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Your api key is: '+apiKey);
    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY is missing");
      return "• Gemini API key is missing.";
    }
  
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
  
    const data = await res.json();
    // console.log("🔍 Gemini response:", JSON.stringify(data, null, 2));
  
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "• Unable to generate recommendations.";
  }
  