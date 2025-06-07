'use client';

import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import {
    Heart,
    Activity,
    Target,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Calendar,
    User
} from 'lucide-react';

interface HealthResultsProps {
    results: {
        name: string;
        bmi: { value: number; interpretation: string };
        bmr: number;
        calorieNeeds: number;
        recommendations: string[];
    };
}

export default function HealthResults({ results }: HealthResultsProps) {
    const getBMIColor = (bmi: number) => {
        if (bmi < 18.5) return 'text-blue-600';
        if (bmi < 25) return 'text-green-600';
        if (bmi < 30) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getBMIBgColor = (bmi: number) => {
        if (bmi < 18.5) return 'from-blue-100 to-blue-200';
        if (bmi < 25) return 'from-green-100 to-green-200';
        if (bmi < 30) return 'from-yellow-100 to-yellow-200';
        return 'from-red-100 to-red-200';
    };

    const getBMIIcon = (bmi: number) => {
        if (bmi < 18.5) return <TrendingUp className="w-6 h-6 text-blue-600" />;
        if (bmi < 25) return <CheckCircle className="w-6 h-6 text-green-600" />;
        if (bmi < 30) return <AlertCircle className="w-6 h-6 text-yellow-600" />;
        return <AlertCircle className="w-6 h-6 text-red-600" />;
    };

    const [recommendations, setRecommendations] = useState<string[]>([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await fetch("/api/calculate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(results),
                });

                const data = await res.json();

                if (!Array.isArray(data.recommendations)) {
                    throw new Error("Invalid recommendations format");
                }

                setRecommendations(data.recommendations);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };
        fetchRecommendations();
    }, [results]);

    // Split recommendations into two columns of 4 items each
    const firstColumn = recommendations.slice(0, 4);
    const secondColumn = recommendations.slice(4, 8);
    const extraRecommendations = recommendations.slice(8);
    console.log(extraRecommendations);


    return (
        <div className="min-h-screen bg-gradient-to-tr from-gray-50 via-white to-emerald-50 py-12 px-6">
            <div className="max-w-5xl mx-auto space-y-10">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500">
                        <Heart className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600 mt-4">
                        Health Report Summary
                    </h1>
                    <div className="flex justify-center items-center text-sm text-gray-600 mt-2">
                        <User className="w-4 h-4 mr-1" /> Analysis for {results.name}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* BMI */}
                    <div className={`rounded-2xl p-6 shadow-lg bg-gradient-to-br ${getBMIBgColor(results.bmi.value)}`}>
                        <div className="flex items-center justify-between">
                            <div className="bg-white p-2 rounded-xl">{getBMIIcon(results.bmi.value)}</div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500 uppercase">BMI</div>
                                <div className="text-sm font-semibold text-gray-600">Body Mass Index</div>
                            </div>
                        </div>
                        <div className={`mt-4 text-3xl font-bold ${getBMIColor(results.bmi.value)}`}>
                            {results.bmi.value.toFixed(1)}
                        </div>
                        <div className="mt-2 text-sm text-gray-700 bg-white/60 rounded-full px-3 py-1 inline-block">
                            {results.bmi.interpretation}
                        </div>
                    </div>

                    {/* BMR */}
                    <div className="rounded-2xl p-6 shadow-lg bg-gradient-to-br from-purple-100 to-purple-200">
                        <div className="flex items-center justify-between">
                            <div className="bg-white p-2 rounded-xl">
                                <Activity className="text-purple-600 w-6 h-6" />
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500 uppercase">BMR</div>
                                <div className="text-sm font-semibold text-gray-600">Basal Metabolic Rate</div>
                            </div>
                        </div>
                        <div className="mt-4 text-3xl font-bold text-purple-600">
                            {results.bmr.toFixed(0)} kcal
                        </div>
                        <div className="text-sm text-gray-700 mt-2">at rest daily</div>
                    </div>

                    {/* Calories */}
                    <div className="rounded-2xl p-6 shadow-lg bg-gradient-to-br from-orange-100 to-orange-200">
                        <div className="flex items-center justify-between">
                            <div className="bg-white p-2 rounded-xl">
                                <Target className="text-orange-600 w-6 h-6" />
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500 uppercase">Calorie Need</div>
                                <div className="text-sm font-semibold text-gray-600">Daily Total</div>
                            </div>
                        </div>
                        <div className="mt-4 text-3xl font-bold text-orange-600">
                            {results.calorieNeeds.toFixed(0)} kcal
                        </div>
                        <div className="text-sm text-gray-700 mt-2">estimated intake</div>
                    </div>
                </div>

                {/* Modern Recommendations Section */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-emerald-600 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white">
                            Personalized Recommendations
                        </h2>
                        <p className="text-blue-100 mt-1">Tailored health guidance for your wellness journey</p>
                    </div>

                    <div className="p-8">
                        <div className="grid md:grid-cols-2 gap-12">
                            {/* First Column */}
                            <div className="space-y-6">
                                {firstColumn.map((rec, idx) => (
                                    <div key={idx} className={idx === 0 ? "mb-8" : ""}>
                                        {idx === 0 ? (
                                            // Heading for first column
                                            <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">1</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800">
                                                    {rec.replace(/^[-•\d.]+\s*/, '').replace(/\*+/g, '')}
                                                </h3>
                                            </div>
                                        ) : (
                                            // Regular items for first column
                                            <div className="flex items-start gap-4 group hover:bg-gray-50 rounded-lg p-3 transition-colors">
                                                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                                                    {idx}
                                                </div>
                                                <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                                                    {rec.replace(/^[-•\d.]+\s*/, '')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Second Column */}
                            <div className="space-y-6">
                                {secondColumn.map((rec, idx) => (
                                    <div key={idx + 4} className={idx === 0 ? "mb-8" : ""}>
                                        {idx === 0 ? (
                                            // Heading for second column
                                            <div className="flex items-center gap-3 pb-4 border-b-2 border-emerald-100">
                                                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">2</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800">
                                                    {rec.replace(/^[-•\d.]+\s*/, '').replace(/\*+/g, '')}
                                                </h3>
                                            </div>
                                        ) : (
                                            // Regular items for second column
                                            <div className="flex items-start gap-4 group hover:bg-gray-50 rounded-lg p-3 transition-colors">
                                                <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                                                    {idx}
                                                </div>
                                                <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                                                    {rec.replace(/^[-•\d.]+\s*/, '')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>


                        {extraRecommendations.length > 0 && (
                            <div className="mt-12">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Tips</h3>
                                <div className="space-y-3">
                                    {extraRecommendations.map((rec, idx) => (
                                        <div
                                            key={idx + 8}
                                            className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100"
                                        >
                                            <div className="text-gray-500 font-bold">{idx + 9}.</div>
                                            <p className="text-gray-700">
                                                {rec.replace(/^[-•\d.]+\s*/, '')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-2" />
                                Generated on {new Date().toLocaleDateString()}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}