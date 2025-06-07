'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { User, Calendar, Activity, Ruler, Weight, Heart, FileText, Download, Calculator } from 'lucide-react';
import { useState } from 'react';

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    age: z.number().min(1, 'Age must be at least 1').max(120, 'Age must be less than 120'),
    gender: z.enum(['male', 'female'], { errorMap: () => ({ message: 'Gender is required' }) }),
    height: z.number().min(50, 'Height must be at least 50 cm').max(300, 'Height must be less than 300 cm'),
    weight: z.number().min(10, 'Weight must be at least 10 kg').max(500, 'Weight must be less than 500 kg'),
    activityLevel: z.enum(['sedentary', 'lightly', 'moderately', 'very'], {
        errorMap: () => ({ message: 'Activity level is required' }),
    }),
    healthConditions: z.string().optional(),
});

interface HealthResults {
    name: string;
    bmi: {
        value: number;
        interpretation: string;
    };
    bmr: number;
    calorieNeeds: number;
    recommendations: string[];
}


type FormData = z.infer<typeof schema>;

interface HealthFormProps {
    setResults: React.Dispatch<React.SetStateAction<HealthResults | null>>;
    results: HealthResults | null;
}


export default function HealthForm({ setResults, results }: HealthFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            age: 0,
            gender: undefined,
            height: 0,
            weight: 0,
            activityLevel: undefined,
            healthConditions: '',
        },
    });
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);


    const watchedActivityLevel = watch('activityLevel');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedData = localStorage.getItem('formData');
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    reset(parsedData);
                    Object.keys(parsedData).forEach((key) => {
                        if (parsedData[key] !== undefined && parsedData[key] !== null) {
                            setValue(key as keyof FormData, parsedData[key]);
                        }
                    });
                } catch (error) {
                    console.error('Error parsing saved form data:', error);
                    localStorage.removeItem('formData');
                }
            }
        }
    }, [reset, setValue]);

    const onSubmit: SubmitHandler<FormData> = useCallback(
        async (data: FormData, event?: React.BaseSyntheticEvent) => {
            event?.preventDefault(); // Prevent default form submission
            if (loading) return;
            console.log('onSubmit called'); // Debug log
            setLoading(true);
            setTimer(10);

            const intervalId = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalId);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            try {
                const response = await fetch('/api/calculate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!response.ok) {
                    throw new Error(`API error: ${response.statusText}`);
                }
                const result = await response.json();
                setResults(result);
                reset();
                localStorage.removeItem('formData');
            } catch (error) {
                console.error('Error calculating health metrics:', error);
                localStorage.setItem('formData', JSON.stringify(data));
            } finally {
                setLoading(false);
                setTimer(0);
                clearInterval(intervalId);
            }
        },
        [loading, reset, setResults]
    );

    const downloadPDF = useCallback(() => {
        if (!results) return;
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Health Analysis Report', 20, 20);
        doc.setFontSize(12);
        doc.text(`Name: ${results.name}`, 20, 30);
        doc.text(`BMI: ${results.bmi.value} (${results.bmi.interpretation})`, 20, 40);
        doc.text(`BMR: ${results.bmr} kcal/day`, 20, 50);
        doc.text(`Daily Calorie Needs: ${results.calorieNeeds} kcal/day`, 20, 60);
        doc.text('Recommendations:', 20, 70);
        results.recommendations.forEach((rec: string, index: number) => {
            doc.text(`- ${rec}`, 20, 80 + index * 10);
        });
        doc.save('health-analysis.pdf');
    }, [results]);

    const activityLevels = [
        { value: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
        { value: 'lightly', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
        { value: 'moderately', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
        { value: 'very', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full max-w-screen-xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 lg:mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                        Health Assessment
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg lg:text-xl">
                        Get personalized health insights and recommendations
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-green-600 p-5 sm:p-6">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <FileText size={20} />
                            Personal Information
                        </h2>
                    </div>

                    <div className="p-6 sm:p-8 lg:p-12">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Row 1: Basic Info */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <User size={16} className="text-blue-600" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        {...register('name')}
                                        className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl text-base bg-gray-50 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100"
                                        placeholder="Enter your full name"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm flex items-center gap-1">
                                            <span>⚠</span>
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Calendar size={16} className="text-blue-600" />
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        {...register('age', { valueAsNumber: true })}
                                        className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl text-base bg-gray-50 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100"
                                        placeholder="Your age in years"
                                    />
                                    {errors.age && (
                                        <p className="text-red-500 text-sm flex items-center gap-1">
                                            <span>⚠</span>
                                            {errors.age.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 2: Physical Measurements */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <User size={16} className="text-green-600" />
                                        Gender
                                    </label>
                                    <select
                                        {...register('gender')}
                                        className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl text-base bg-gray-50 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {errors.gender && (
                                        <p className="text-red-500 text-sm flex items-center gap-1">
                                            <span>⚠</span>
                                            {errors.gender.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Ruler size={16} className="text-green-600" />
                                        Height (cm)
                                    </label>
                                    <input
                                        type="number"
                                        {...register('height', { valueAsNumber: true })}
                                        className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl text-base bg-gray-50 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100"
                                        placeholder="170"
                                    />
                                    {errors.height && (
                                        <p className="text-red-500 text-sm flex items-center gap-1">
                                            <span>⚠</span>
                                            {errors.height.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 md:col-span-2 xl:col-span-1">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Weight size={16} className="text-green-600" />
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        {...register('weight', { valueAsNumber: true })}
                                        className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl text-base bg-gray-50 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100"
                                        placeholder="70"
                                    />
                                    {errors.weight && (
                                        <p className="text-red-500 text-sm flex items-center gap-1">
                                            <span>⚠</span>
                                            {errors.weight.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 3: Activity Level */}
                            <div className="mb-8">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                    <Activity size={16} className="text-purple-600" />
                                    Physical Activity Level
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                    {activityLevels.map((activity) => (
                                        <label key={activity.value} className="relative cursor-pointer">
                                            <input
                                                type="radio"
                                                {...register('activityLevel')}
                                                value={activity.value}
                                                className="absolute opacity-0 pointer-events-none"
                                            />
                                            <div
                                                className={`p-4 border-2 rounded-xl transition-all duration-200 ${watchedActivityLevel === activity.value
                                                    ? 'border-purple-600 bg-purple-50'
                                                    : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-25'
                                                    }`}
                                            >
                                                <div className="font-semibold text-gray-900 mb-1">
                                                    {activity.label}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {activity.desc}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.activityLevel && (
                                    <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                                        <span>⚠</span>
                                        {errors.activityLevel.message}
                                    </p>
                                )}
                            </div>

                            {/* Row 4: Health Conditions */}
                            <div className="mb-8">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                    <Heart size={16} className="text-red-500" />
                                    Known Health Conditions (Optional)
                                </label>
                                <textarea
                                    {...register('healthConditions')}
                                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl text-base bg-gray-50 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100 min-h-[100px] resize-y font-sans"
                                    placeholder="Please list any known health conditions, allergies, or medications you're currently taking..."
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full sm:w-1/2 lg:w-1/4 p-4 rounded-xl font-semibold text-lg border-none cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 shadow-lg transform
                                            ${loading
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:scale-105 hover:shadow-xl active:scale-95'
                                            }`}
                                    >
                                        {loading ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v8z"
                                                    ></path>
                                                </svg>
                                                Processing... {timer}s
                                            </>
                                        ) : (
                                            <>
                                                <Calculator size={20} />
                                                Calculate Health Metrics
                                            </>
                                        )}
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        localStorage.removeItem('formData');
                                        localStorage.removeItem('healthResults');
                                        reset();
                                        setResults(null);
                                    }}
                                    className="w-full sm:w-1/2 lg:w-1/4 bg-gradient-to-r from-blue-600 to-green-600 text-white p-2 sm:p-3 lg:p-4 rounded-xl font-semibold text-sm sm:text-base lg:text-lg border-none cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:scale-105 hover:shadow-xl transform active:scale-95"
                                >
                                    Clear Form & Reset
                                </button>
                                {results && (
                                    <button
                                        type="button"
                                        onClick={downloadPDF}
                                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-xl font-semibold text-lg border-none cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:scale-105 hover:shadow-xl transform active:scale-95"
                                    >
                                        <Download size={20} />
                                        Download Health Report
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-gray-600">
                    <p className="text-sm">
                        Your health data is processed securely and stored locally on your device.
                    </p>
                </div>
            </div>
        </div>
    );
}