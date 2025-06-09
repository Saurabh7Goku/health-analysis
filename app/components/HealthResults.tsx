'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import {
    Activity,
    Target,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Calendar,
    User,
    Download,
    X,
    Shield,
    Sparkles,
    Clock,
} from 'lucide-react';
import jsPDF from "jspdf";
import { GenerateDietPlanPdf } from "../api/types";


type ActivityLevel = 'sedentary' | 'lightly' | 'moderately' | 'very';

interface HealthResultsProps {
    results: {
        name: string;
        age: number;
        weight: number;
        height: number;
        gender: string;
        bmi: { value: number; interpretation: string };
        bmr: number;
        calorieNeeds: number;
        activityLevel: ActivityLevel;
        recommendations: string[];
    };
    onClose?: () => void;
}

export default function HealthResults({ results }: HealthResultsProps) {
    const [isLoadingDietPlan, setIsLoadingDietPlan] = useState(false);
    const [showDownloadComplete, setShowDownloadComplete] = useState(false);
    const [showDietDialog, setShowDietDialog] = useState(false);
    const [dietPreferences, setDietPreferences] = useState({
        dietType: '',
        micronutrientDeficiency: '',
        allergies: '',
        medicalConditions: ''
    });

    const firstInputRef = useRef<HTMLInputElement>(null);

    const dialogRef = useRef<HTMLDivElement>(null);

    // Close dialog handler
    const closeDietDialog = useCallback(() => {
        setShowDietDialog(false);
        setDietPreferences({
            dietType: '',
            micronutrientDeficiency: '',
            allergies: '',
            medicalConditions: ''
        });
    }, []);

    // Handle Escape key to close dialog
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeDietDialog();
            }
        };
        if (showDietDialog) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showDietDialog, closeDietDialog]);

    // Focus first input when dialog opens
    useEffect(() => {
        if (showDietDialog && firstInputRef.current) {
            firstInputRef.current.focus();
        }
    }, [showDietDialog]);

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

    const recommendations = results.recommendations || [];
    const reportRef = useRef<HTMLDivElement>(null);

    const firstColumn = recommendations.slice(0, 4);
    const secondColumn = recommendations.slice(4, 8);
    const extraRecommendations = recommendations.slice(8);

    const handleDownloadPdf = async () => {
        if (!reportRef.current) return;

        try {
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "pt",
                format: "a4"
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 40;
            const contentWidth = pdfWidth - 2 * margin;

            // Header Section
            pdf.setFillColor(219, 234, 254);
            pdf.rect(0, 0, pdfWidth, 80, "F");

            // Main heading
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(24);
            pdf.setTextColor(30, 58, 138); // Blue-900
            pdf.text("HEALTH ASSESSMENT REPORT", margin, 35);

            // License number (right aligned)
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            pdf.setTextColor(107, 114, 128); // Gray-500
            pdf.text(`License No. HL-${Date.now().toString().slice(-6)}`, pdfWidth - margin, 25, { align: 'right' });
            pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, pdfWidth - margin, 40, { align: 'right' });

            let yPosition = 110;

            // Patient Name Section
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(16);
            pdf.setTextColor(17, 24, 39); // Gray-900
            pdf.text("Patient Information", margin, yPosition);

            yPosition += 25;
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(14);
            pdf.setTextColor(55, 65, 81); // Gray-700
            pdf.text(`Name: ${results.name}`, margin, yPosition);

            const rightColumnX = margin + 200;
            pdf.text(`Height: ${results.height} cm`, rightColumnX + 200, yPosition);

            yPosition += 20
            pdf.text(`Gender: ${results.gender}`, margin, yPosition);
            pdf.text(`Weight: ${results.weight} kg`, rightColumnX + 200, yPosition);

            yPosition += 40;
            // Health Metrics Row
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(16);
            pdf.setTextColor(17, 24, 39);
            pdf.text("Health Metrics", margin, yPosition);

            yPosition += 30;

            // Create three columns for metrics
            const colWidth = contentWidth / 3;

            // BMI Column
            pdf.setFillColor(239, 246, 255); // Blue-50
            pdf.roundedRect(margin, yPosition, colWidth - 10, 80, 8, 8, "F");

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(12);
            pdf.setTextColor(37, 99, 235); // Blue-600
            pdf.text("BMI", margin + 15, yPosition + 20);

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(18);
            pdf.setTextColor(17, 24, 39);
            pdf.text(results.bmi.value.toFixed(1), margin + 15, yPosition + 40);

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            pdf.setTextColor(75, 85, 99);
            pdf.text(results.bmi.interpretation, margin + 15, yPosition + 60);

            // BMR Column
            pdf.setFillColor(245, 243, 255); // Purple-50
            pdf.roundedRect(margin + colWidth, yPosition, colWidth - 10, 80, 8, 8, "F");

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(12);
            pdf.setTextColor(147, 51, 234); // Purple-600
            pdf.text("BMR", margin + colWidth + 15, yPosition + 20);

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(18);
            pdf.setTextColor(17, 24, 39);
            pdf.text(`${results.bmr.toFixed(0)} kcal`, margin + colWidth + 15, yPosition + 40);

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            pdf.setTextColor(75, 85, 99);
            pdf.text("Basal Metabolic Rate", margin + colWidth + 15, yPosition + 60);

            // Calories Column
            pdf.setFillColor(255, 247, 237); // Orange-50
            pdf.roundedRect(margin + 2 * colWidth, yPosition, colWidth - 10, 80, 8, 8, "F");

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(12);
            pdf.setTextColor(234, 88, 12); // Orange-600
            pdf.text("Daily Calories", margin + 2 * colWidth + 15, yPosition + 20);

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(18);
            pdf.setTextColor(17, 24, 39);
            pdf.text(`${results.calorieNeeds.toFixed(0)} kcal`, margin + 2 * colWidth + 15, yPosition + 40);

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            pdf.setTextColor(75, 85, 99);
            pdf.text("Recommended Intake", margin + 2 * colWidth + 15, yPosition + 60);

            yPosition += 120;

            // Check if we need a new page
            if (yPosition > pdfHeight - 200) {
                pdf.addPage();
                yPosition = 50;
            }

            const title = "Health Analysis & Recommendations";
            const pageWidth = pdf.internal.pageSize.getWidth();
            const textWidth = pdf.getTextWidth(title);
            const centerX = (pageWidth - textWidth) / 3;

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(18);
            pdf.setTextColor(17, 24, 39);
            pdf.text(title, centerX, yPosition);

            yPosition += 30;
            // Function to add recommendation section
            const addRecommendationSection = (recs: string[], sectionTitle: string, iconColor: { bg: number[]; text: number[]; bullet: number[] }) => {
                if (recs.length === 0) return;

                // Section header with icon
                pdf.setFillColor(iconColor.bg[0], iconColor.bg[1], iconColor.bg[2]);
                pdf.circle(margin + 8, yPosition + 8, 8, "F");

                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(14);
                pdf.setTextColor(iconColor.text[0], iconColor.text[1], iconColor.text[2]);
                pdf.text(sectionTitle, margin + 25, yPosition + 12);

                yPosition += 30;

                // First item as heading (markdown formatted)
                if (recs[0]) {
                    const heading = recs[0].replace(/^[-•\d.]+\s*/, '').replace(/\*+/g, '').replace(/#+\s*/, '');
                    pdf.setFont("helvetica", "bold");
                    pdf.setFontSize(13);
                    pdf.setTextColor(31, 41, 55);

                    // Split long headings
                    const headingLines = pdf.splitTextToSize(heading, contentWidth - 20);
                    pdf.text(headingLines, margin + 20, yPosition);
                    yPosition += headingLines.length * 15 + 10;
                }

                // Rest of the recommendations as bullet points
                for (let i = 1; i < recs.length; i++) {
                    if (yPosition > pdfHeight - 100) {
                        pdf.addPage();
                        yPosition = 50;
                    }

                    const rec = recs[i].replace(/^[-•\d.]+\s*/, '').replace(/\*+/g, '');

                    // Bullet point
                    pdf.setFillColor(iconColor.bullet[0], iconColor.bullet[1], iconColor.bullet[2]);
                    pdf.circle(margin + 25, yPosition + 5, 3, "F");

                    // Recommendation text
                    pdf.setFont("helvetica", "normal");
                    pdf.setFontSize(11);
                    pdf.setTextColor(55, 65, 81);

                    const lines = pdf.splitTextToSize(rec, contentWidth - 50);
                    pdf.text(lines, margin + 35, yPosition + 8);
                    yPosition += lines.length * 12 + 8;
                }

                yPosition += 15;
            };

            // Add all recommendation sections
            const firstColumn = results.recommendations.slice(0, 4);
            const secondColumn = results.recommendations.slice(4, 8);
            const extraRecommendations = results.recommendations.slice(8);

            // Primary Recommendations
            addRecommendationSection(firstColumn, "Primary Health Guidelines", {
                bg: [59, 130, 246],     // Blue-500
                text: [59, 130, 246],   // Blue-500
                bullet: [147, 197, 253] // Blue-300
            });

            // Secondary Recommendations
            addRecommendationSection(secondColumn, "Supplementary Guidelines", {
                bg: [16, 185, 129],     // Emerald-500
                text: [16, 185, 129],   // Emerald-500
                bullet: [110, 231, 183] // Emerald-300
            });

            // Extra Recommendations
            addRecommendationSection(extraRecommendations, "Additional Recommendations", {
                bg: [139, 92, 246],     // Violet-500
                text: [139, 92, 246],   // Violet-500
                bullet: [196, 181, 253] // Violet-300
            });

            // Footer
            const footerY = pdfHeight - 30;
            pdf.setDrawColor(229, 231, 235);
            pdf.setLineWidth(0.5);
            pdf.line(margin, footerY - 10, pdfWidth - margin, footerY - 10);

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(8);
            pdf.setTextColor(107, 114, 128);
            pdf.text("This report is generated for informational purposes only. Please consult with a healthcare professional.", margin, footerY);
            pdf.text(`| Confidential Document`, pdfWidth - margin, footerY, { align: 'right' });

            // Download the PDF
            const filename = `health-report-${(results.name || 'patient').replace(/\s+/g, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(filename);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    const [loadingProgress, setLoadingProgress] = useState(0);

    // Add this helper function
    const getLoadingStatus = (progress: number) => {
        if (progress < 20) return "Analyzing health data...";
        if (progress < 40) return "Processing dietary requirements...";
        if (progress < 60) return "Calculating nutritional needs...";
        if (progress < 80) return "Generating meal recommendations...";
        if (progress < 95) return "Finalizing your diet plan...";
        return "Almost ready!";
    };


    const handleDietPlanDownload = async () => {
        setShowDietDialog(true);
    };

    const handleDietFormSubmit = async () => {
        // Validate required fields
        if (!dietPreferences.dietType) {
            alert('Please select your diet type (Vegetarian or Non-Vegetarian)');
            return;
        }
        setShowDietDialog(false);
        setIsLoadingDietPlan(true);
        setShowDownloadComplete(false);
        setLoadingProgress(0);
        const progressInterval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 95) {
                    clearInterval(progressInterval);
                    return 95;
                }
                const increment = Math.random() * 8 + 5; // Random between 2-8
                return Math.min(prev + increment, 100);
            });
        }, 1000);

        try {
            const payload = {
                name: results.name,
                age: results.age,
                gender: results.gender,
                height: results.height,
                weight: results.weight,
                bmi: results.bmi,
                bmr: results.bmr,
                calorieNeeds: results.calorieNeeds,
                activityLevel: results.activityLevel,
                healthConditions: results.recommendations ? results.recommendations.join(', ') : '',
                dietType: dietPreferences.dietType,
                micronutrientDeficiency: dietPreferences.micronutrientDeficiency,
                allergies: dietPreferences.allergies,
                medicalConditions: dietPreferences.medicalConditions
            };
            await GenerateDietPlanPdf(payload);
            setLoadingProgress(100);

            // Simulate download completion
            setTimeout(() => {
                setIsLoadingDietPlan(false);
                setShowDownloadComplete(true);
                setLoadingProgress(0);

                // Auto-hide the success message after 3 seconds
                setTimeout(() => {
                    setShowDownloadComplete(false);
                }, 3000);
            }, 2000);

        } catch (error) {
            console.error('Error generating diet plan:', error);
            clearInterval(progressInterval);
            setIsLoadingDietPlan(false);
            setLoadingProgress(0);
            alert('Failed to generate diet plan. Please try again.');
        }
    };

    const closeModal = () => {
        setIsLoadingDietPlan(false);
        setShowDownloadComplete(false);
    };

    return (
        <div className="bg-gradient-to-tr from-gray-50 via-white to-emerald-50 p-4 sm:p-8 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600 mt-4">
                        Health Report Summary
                    </h1>
                    <div className="flex justify-center items-center text-sm text-gray-600 mt-2">
                        <User className="w-4 h-4 mr-1" /> Analysis for {results.name}
                    </div>
                </div>

                {/* Download PDF button */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                    <button
                        onClick={handleDownloadPdf}
                        className="bg-blue-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <Download className="w-4 h-4 inline mr-2" />
                        Download PDF
                    </button>
                    <button
                        onClick={handleDietPlanDownload}
                        disabled={isLoadingDietPlan}
                        className="bg-red-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none"
                    >
                        {/* <Heart className="w-4 h-4 inline mr-2" /> */}
                        {isLoadingDietPlan ? 'Generating...' : 'Full Diet Plan'}
                    </button>
                </div>

                {/* Enhanced Diet Plan Questionnaire Dialog */}
                {showDietDialog && (
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
                        role="dialog"
                        aria-labelledby="diet-dialog-title"
                        aria-modal="true"
                    >
                        <div
                            ref={dialogRef}
                            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden transform animate-in zoom-in duration-300"
                        >
                            {/* Header with Gradient */}
                            <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 sm:p-8">
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                                <button
                                    onClick={closeDietDialog}
                                    className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    aria-label="Close dialog"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="relative z-10 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                                        {/* <Sparkles className="w-8 h-8 text-white" /> */}
                                    </div>
                                    <h3 id="diet-dialog-title" className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                        Personalized Diet Plan
                                    </h3>
                                    <p className="text-white/90 text-sm sm:text-base">
                                        Let&apos;s create something amazing together
                                    </p>
                                </div>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                                <div className="space-y-6">
                                    {/* Diet Type with Enhanced Cards */}
                                    <div className="space-y-4">
                                        <label className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                                            <Shield className="w-5 h-5 mr-2 text-emerald-600" />
                                            Are you Vegetarian or Non-Vegetarian? *
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {[
                                                { value: 'vegetarian', label: 'Vegetarian', icon: '🌱', color: 'emerald' },
                                                { value: 'non-vegetarian', label: 'Non-Vegetarian', icon: '🍗', color: 'orange' }
                                            ].map((option) => (
                                                <label
                                                    key={option.value}
                                                    className={`relative group cursor-pointer ${dietPreferences.dietType === option.value ? 'scale-105' : ''
                                                        } transition-all duration-300`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="dietType"
                                                        value={option.value}
                                                        checked={dietPreferences.dietType === option.value}
                                                        onChange={(e) => {
                                                            console.log('Setting dietType:', e.target.value); // Debug log
                                                            setDietPreferences({
                                                                ...dietPreferences,
                                                                dietType: e.target.value
                                                            });
                                                        }}
                                                        className="sr-only"
                                                        ref={option.value === 'vegetarian' ? firstInputRef : undefined}
                                                    />
                                                    <div
                                                        className={`p-6 rounded-2xl border-2 transition-all duration-300 ${dietPreferences.dietType === option.value
                                                            ? `border-${option.color}-500 bg-${option.color}-50 shadow-lg shadow-${option.color}-200/50`
                                                            : `border-gray-200 bg-white hover:border-${option.color}-300 hover:shadow-md`
                                                            }`}
                                                    >
                                                        <div className="text-center">
                                                            <div
                                                                className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${dietPreferences.dietType === option.value
                                                                    ? `bg-${option.color}-500 text-white`
                                                                    : `bg-gray-100 text-gray-400 group-hover:bg-${option.color}-100 group-hover:text-${option.color}-500`
                                                                    } transition-all duration-300`}
                                                            >
                                                                {option.icon}
                                                            </div>
                                                            <span
                                                                className={`font-semibold ${dietPreferences.dietType === option.value
                                                                    ? `text-${option.color}-700`
                                                                    : 'text-gray-700'
                                                                    }`}
                                                            >
                                                                {option.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Enhanced Text Areas */}
                                    {[
                                        {
                                            label: 'Do you have any micronutrient deficiencies?',
                                            placeholder: 'e.g., Vitamin D, Iron, B12, Calcium deficiency...',
                                            value: dietPreferences.micronutrientDeficiency,
                                            key: 'micronutrientDeficiency',
                                            icon: '💊'
                                        },
                                        {
                                            label: 'Do you have any food allergies or intolerances?',
                                            placeholder: 'e.g., Nuts, Dairy, Gluten, Shellfish...',
                                            value: dietPreferences.allergies,
                                            key: 'allergies',
                                            icon: '⚠️'
                                        },
                                        {
                                            label: 'Any specific medical conditions we should consider?',
                                            placeholder: 'e.g., Diabetes, Hypertension, Thyroid issues...',
                                            value: dietPreferences.medicalConditions,
                                            key: 'medicalConditions',
                                            icon: '🏥'
                                        }
                                    ].map((field) => (
                                        <div key={field.key} className="space-y-2">
                                            <label className="block text-base font-semibold text-gray-800 flex items-center">
                                                <span className="text-lg lg:text-xl mr-2">{field.icon}</span>
                                                {field.label}
                                            </label>
                                            <div className="relative">
                                                <textarea
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        console.log(`Setting ${field.key}:`, e.target.value); // Debug log
                                                        setDietPreferences({
                                                            ...dietPreferences,
                                                            [field.key]: e.target.value
                                                        });
                                                    }}
                                                    placeholder={field.placeholder}
                                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 resize-none hover:border-gray-300 bg-gray-50/50 focus:bg-white"
                                                    rows={3}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 sm:p-8 bg-gray-50/50 border-t border-gray-100">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={closeDietDialog}
                                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        aria-label="Cancel diet plan"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDietFormSubmit}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        aria-label="Generate diet plan"
                                    >
                                        <Sparkles className="w-4 h-4 inline mr-2" />
                                        Generate Diet Plan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Loading/Success Modal */}
                {(isLoadingDietPlan || showDownloadComplete) && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform animate-in zoom-in duration-300 overflow-hidden">
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200 z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {isLoadingDietPlan && (
                                <div className="p-8 sm:p-12 text-center">
                                    {/* Static Loading Icon */}
                                    <div className="relative mb-8">
                                        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                                            <Clock className="w-10 h-10 text-white" />
                                        </div>
                                    </div>

                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                                        Creating Your Diet Plan
                                    </h3>
                                    <p className="text-gray-600 mb-6 text-sm sm:text-base">
                                        Our AI is analyzing your preferences and health data...
                                    </p>

                                    {/* Real Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-4">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${loadingProgress}%` }}
                                        ></div>
                                    </div>

                                    {/* Progress Text */}
                                    <div className="text-sm text-gray-600 mb-2">
                                        {loadingProgress.toFixed(2)}% Complete
                                    </div>

                                    {/* Dynamic Status Text */}
                                    <div className="text-xs text-gray-500 flex items-center justify-center">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        {getLoadingStatus(loadingProgress)}
                                    </div>
                                </div>
                            )}

                            {showDownloadComplete && (
                                <div className="p-8 sm:p-12 text-center">
                                    {/* Enhanced Success Animation */}
                                    <div className="relative mb-8">
                                        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                                            <CheckCircle className="w-10 h-10 text-white" />
                                        </div>
                                        <div className="absolute inset-0 w-20 h-20 mx-auto bg-green-400 rounded-full animate-ping opacity-20"></div>
                                    </div>

                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                                        Success! 🎉
                                    </h3>
                                    <p className="text-gray-600 mb-6 text-sm sm:text-base">
                                        Your personalized diet plan has been generated and downloaded successfully.
                                    </p>

                                    <div className="flex items-center justify-center text-sm text-emerald-600 bg-emerald-50 rounded-full py-2 px-4 inline-flex">
                                        <Download className="w-4 h-4 mr-2" />
                                        File saved to Downloads folder
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div ref={reportRef}>
                    {/* Health Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* BMI */}
                        <div className={`rounded-2xl p-6 shadow-lg bg-gradient-to-br ${getBMIBgColor(results.bmi.value)} transform hover:scale-105 transition-all duration-300`}>
                            <div className="flex items-center justify-between">
                                <div className="bg-white p-2 rounded-xl shadow-sm">{getBMIIcon(results.bmi.value)}</div>
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
                        <div className="rounded-2xl p-6 shadow-lg bg-gradient-to-br from-purple-100 to-purple-200 transform hover:scale-105 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div className="bg-white p-2 rounded-xl shadow-sm">
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
                        <div className="rounded-2xl p-6 shadow-lg bg-gradient-to-br from-orange-100 to-orange-200 transform hover:scale-105 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div className="bg-white p-2 rounded-xl shadow-sm">
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

                    {/* Recommendations Section */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mt-10">
                        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 px-6 sm:px-8 py-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-white">
                                Personalized Recommendations
                            </h2>
                            <p className="text-blue-100 mt-1 text-sm sm:text-base">Tailored health guidance for your wellness journey</p>
                        </div>

                        <div className="p-6 sm:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                                {/* First Column */}
                                <div className="space-y-6">
                                    {firstColumn.map((rec, idx) => (
                                        <div key={idx} className={idx === 0 ? "mb-8" : ""}>
                                            {idx === 0 ? (
                                                <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                                        <span className="text-white font-bold text-lg">1</span>
                                                    </div>
                                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                                        {rec.replace(/^[-•\d.]+\s*/, '').replace(/\*+/g, '')}
                                                    </h3>
                                                </div>
                                            ) : (
                                                <div className="flex items-start gap-4 group hover:bg-gray-50 rounded-lg p-3 transition-colors">
                                                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                                                        {idx}
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors text-sm sm:text-base">
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
                                                <div className="flex items-center gap-3 pb-4 border-b-2 border-emerald-100">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                                        <span className="text-white font-bold text-lg">2</span>
                                                    </div>
                                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                                        {rec.replace(/^[-•\d.]+\s*/, '').replace(/\*+/g, '')}
                                                    </h3>
                                                </div>
                                            ) : (
                                                <div className="flex items-start gap-4 group hover:bg-gray-50 rounded-lg p-3 transition-colors">
                                                    <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                                                        {idx}
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors text-sm sm:text-base">
                                                        {rec.replace(/^[-•\d.]+\s*/, '')}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Extra Recommendations */}
                            {extraRecommendations.length > 0 && (
                                <div className="mt-12">
                                    {extraRecommendations.map((rec, idx) => (
                                        <div key={idx} className={idx === 0 ? "mb-8" : ""}>
                                            {idx === 0 ? (
                                                <div className="flex justify-center pb-4 border-b-2 border-emerald-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                                            <span className="text-white font-bold text-lg">3</span>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-gray-800 text-center">
                                                            {rec.replace(/^[-•\d.]+\s*/, '').replace(/\*+/g, '')}
                                                        </h3>
                                                    </div>
                                                </div>
                                            ) : (
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
                            )}

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="flex items-center justify-center text-sm text-gray-500">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Generated on {new Date().toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}