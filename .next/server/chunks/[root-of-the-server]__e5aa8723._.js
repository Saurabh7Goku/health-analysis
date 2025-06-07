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
    "callGemini": (()=>callGemini)
});
async function callGemini(payload) {
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
    console.log('Your api key is: ' + apiKey);
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
            ]
        })
    });
    const data = await res.json();
    // console.log("🔍 Gemini response:", JSON.stringify(data, null, 2));
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
        ...healthConditions && {
            healthConditions
        }
    };
    const text = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["callGemini"])(payload);
    const recommendations = text.split('\n').filter((line)=>line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')).map((line)=>line.replace(/^[-•*]\s*/, '').trim());
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        name,
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