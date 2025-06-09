module.exports = {

"[project]/.next-internal/server/app/api/calculate/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/app/api/gemini.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "callDietAi": (()=>callDietAi),
    "callGemini": (()=>callGemini)
});
async function callGemini(payload) {
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
`;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ GEMINI_API_KEY is missing");
        return "• Gemini API key is missing.";
    }
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.9,
                topK: 40,
                topP: 0.95
            }
        })
    });
    console.log("callGemini → healthConditions:", payload.healthConditions);
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "• Unable to generate recommendations.";
}
async function callDietAi(payload) {
    const prompt = `You are a certified nutritionist AI. Based on the following physical and lifestyle information, 
  generate a personalized, structured, and goal-oriented diet plan for the Both types of user(Veg & Non-Veg). The diet should be realistic, sustainable, 
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
`;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return "• Gemini API key is missing.";
    }
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.75,
                topK: 40,
                topP: 0.95
            }
        })
    });
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "• Unable to generate recommendations.";
}
}}),
"[project]/app/api/calculate/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/gemini.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    console.log('API /calculate called', new Date().toISOString()); // Debug log
    const data = await request.json();
    const { name, age, gender, height, weight, activityLevel, healthConditions } = data;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    let bmiInterpretation = '';
    if (bmi < 18.5) bmiInterpretation = 'Underweight';
    else if (bmi < 25) bmiInterpretation = 'Normal weight';
    else if (bmi < 30) bmiInterpretation = 'Overweight';
    else bmiInterpretation = 'Obese';
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    const activityMultipliers = {
        sedentary: 1.2,
        lightly: 1.375,
        moderately: 1.55,
        very: 1.725
    };
    const calorieNeeds = bmr * activityMultipliers[activityLevel];
    const payload = {
        name,
        age,
        gender,
        height,
        weight,
        activityLevel,
        bmi: {
            value: bmi,
            interpretation: bmiInterpretation
        },
        bmr,
        calorieNeeds,
        healthConditions
    };
    const text = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["callGemini"])(payload);
    const recommendations = text.split('\n').filter((line)=>line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')).map((line)=>line.replace(/^[-•*]\s*/, '').trim());
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        name,
        gender,
        height,
        weight,
        bmi: {
            value: bmi,
            interpretation: bmiInterpretation
        },
        bmr,
        calorieNeeds,
        recommendations
    });
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__e5aa8723._.js.map