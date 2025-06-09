'use client';

import { useRef } from "react";
import jsPDF from "jspdf";
import {
    Activity,
    Target,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Calendar,
    User
} from 'lucide-react';
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

    // Use the recommendations directly from props instead of fetching
    const recommendations = results.recommendations || [];
    const reportRef = useRef<HTMLDivElement>(null);

    // Split recommendations into two columns of 4 items each
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

    return (
        <div className="bg-gradient-to-tr from-gray-50 via-white to-emerald-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600 mt-4">
                        Health Report Summary
                    </h1>
                    <div className="flex justify-center items-center text-sm text-gray-600 mt-2">
                        <User className="w-4 h-4 mr-1" /> Analysis for {results.name}
                    </div>
                </div>

                {/* Download PDF button */}
                <div className="flex justify-center mb-6 gap-2 sm:gap-8 ">
                    <button
                        onClick={handleDownloadPdf}
                        className="bg-blue-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                        Download PDF
                    </button>
                    <button
                        onClick={() => GenerateDietPlanPdf({
                            age: results.age,
                            gender: results.gender,
                            height: results.height,
                            weight: results.weight,
                            bmi: results.bmi,
                            bmr: results.bmr,
                            calorieNeeds: results.calorieNeeds,
                            activityLevel: results.activityLevel,
                            healthConditions: results.recommendations ? results.recommendations.join(', ') : ''

                        })}
                        className="bg-red-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                        Full Diet Plan
                    </button>
                </div>

                {/* Wrap the entire report content inside this ref */}
                < div ref={reportRef} >
                    {/* Health Metrics Cards */}
                    < div className="grid md:grid-cols-3 gap-6" >
                        {/* BMI */}
                        < div className={`rounded-2xl p-6 shadow-lg bg-gradient-to-br ${getBMIBgColor(results.bmi.value)}`}>
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

                    {/* Recommendations Section */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mt-10">
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
                                                <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                                        <span className="text-white font-bold text-lg">1</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-800">
                                                        {rec.replace(/^[-•\d.]+\s*/, '').replace(/\*+/g, '')}
                                                    </h3>
                                                </div>
                                            ) : (
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
                                                <div className="flex items-center gap-3 pb-4 border-b-2 border-emerald-100">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                                        <span className="text-white font-bold text-lg">2</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-800">
                                                        {rec.replace(/^[-•\d.]+\s*/, '').replace(/\*+/g, '')}
                                                    </h3>
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
