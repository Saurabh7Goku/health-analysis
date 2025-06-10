import { z } from 'zod';
import jsPDF from 'jspdf';

// types.ts
export interface HealthResults {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: string;
  bmi: { value: number; interpretation: string };
  bmr: number;
  calorieNeeds: number;
  activityLevel: 'sedentary' | 'lightly' | 'moderately' | 'very';
  recommendations: string[];
}
  
  export const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    age: z.number().min(1).max(120),
    gender: z.enum(['male', 'female']),
    height: z.number().min(50).max(300),
    weight: z.number().min(10).max(500),
    activityLevel: z.enum(['sedentary', 'lightly', 'moderately', 'very']),
    healthConditions: z.string().optional(),
  });
  
  export type FormData = z.infer<typeof schema>;
  
  export interface HealthResults {
    name: string;
    bmi: {
      value: number;
      interpretation: string;
    };
    bmr: number;
    calorieNeeds: number;
    recommendations: string[];
  }
  
  export interface HealthFormProps {
    results: HealthResults | null;
    setResults: React.Dispatch<React.SetStateAction<HealthResults | null>>;
  }

  export interface HealthPayload {
    name: string
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
  
    // For Diet Planner Only
    dietType: string; 
    micronutrientDeficiency: string; 
    allergies: string; 
    medicalConditions: string;
  }

  async function fetchDietPlan(payload: HealthPayload): Promise<string> {
    const response = await fetch('/api/diet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch diet plan');
    }
  
    const data = await response.json();
    return data.dietPlan; // The diet plan text returned by your API
  }
  
  export const GenerateDietPlanPdf = async (payload: HealthPayload) => {
    try {
      const response = await fetchDietPlan(payload);
      console.log('Generate pdf: '+ payload)
  
      if (!response || typeof response !== "string") {
        console.error("❌ Invalid response from fetchDietPlan:", response);
        return;
      }
  
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // A4 dimensions and margins
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margins = {
        top: 25,
        bottom: 25,
        left: 20,
        right: 20
      };
      
      const contentWidth = pageWidth - margins.left - margins.right;
      // const contentHeight = pageHeight - margins.top - margins.bottom;
      
      let y = margins.top;
      const lineHeight = 7;
      const sectionSpacing = 12;
      const paragraphSpacing = 5;
  
      // Color scheme
      const colors = {
        primary: [41, 128, 185] as const,    // Blue
        secondary: [52, 152, 219] as const,  // Light blue
        accent: [46, 204, 113] as const,     // Green
        text: [44, 62, 80] as const,         // Dark gray
        lightText: [127, 140, 141] as const  // Light gray
      };
  
      // Add header/title styling
      const addHeader = (title: string) => {
        pdf.setFillColor(...colors.primary);
        pdf.rect(margins.left, y - 5, contentWidth, 15, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.text(title, margins.left + 5, y + 5);
        
        y += 20;
        pdf.setTextColor(...colors.text);
      };
  
      // Add decorative line
      const addDivider = () => {
        pdf.setDrawColor(...colors.secondary);
        pdf.setLineWidth(0.5);
        pdf.line(margins.left, y, margins.left + contentWidth, y);
        y += 8;
      };
  
      // Check if new page is needed
      const checkNewPage = (requiredSpace = 20) => {
        if (y + requiredSpace > pageHeight - margins.bottom) {
          pdf.addPage();
          y = margins.top;
          return true;
        }
        return false;
      };
  
      // Enhanced text wrapping function
      const wrapText = (text: string, maxWidth: number, fontSize: number) => {
        pdf.setFontSize(fontSize);
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
  
        words.forEach(word => {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const testWidth = pdf.getTextWidth(testLine);
          
          if (testWidth > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });
        
        if (currentLine) {
          lines.push(currentLine);
        }
        
        return lines;
      };
  
      // Enhanced markdown rendering
      const renderMarkdownLine = (line: string) => {
        // Main heading (##)
        if (line.startsWith("## ")) {
          checkNewPage(25);
          
          if (y > margins.top + 20) {
            y += sectionSpacing;
            addDivider();
          }
          
          const title = line.replace(/^## /, "");
          pdf.setFillColor(...colors.accent);
          pdf.rect(margins.left, y - 3, contentWidth, 12, 'F');
          
          pdf.setTextColor(255, 255, 255);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(16);
          pdf.text(title, margins.left + 5, y + 5);
          
          y += 18;
          pdf.setTextColor(...colors.text);
          return;
        }
  
        // Sub heading (###)
        if (line.startsWith("### ")) {
          checkNewPage(20);
          y += paragraphSpacing;
          
          const title = line.replace(/^### /, "");
          pdf.setTextColor(...colors.primary);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(14);
          pdf.text(title, margins.left, y);
          
          y += lineHeight + 3;
          pdf.setTextColor(...colors.text);
          return;
        }
  
        // Sub-sub heading (####)
        if (line.startsWith("#### ")) {
          checkNewPage(15);
          y += paragraphSpacing;
          
          const title = line.replace(/^#### /, "");
          pdf.setTextColor(...colors.secondary);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(12);
          pdf.text(title, margins.left, y);
          
          y += lineHeight + 2;
          pdf.setTextColor(...colors.text);
          return;
        }
  
        // List items
        if (line.startsWith("- ") || line.startsWith("* ")) {
          checkNewPage(10);
          
          const content = line.replace(/^[-*] /, "");
          const bulletX = margins.left + 5;
          const textX = margins.left + 12;
          
          // Bullet point
          pdf.setFillColor(...colors.accent);
          pdf.circle(bulletX, y - 1, 1, 'F');
          
          // Wrap and render list item text
          const wrappedLines = wrapText(content, contentWidth - 12, 11);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(11);
          
          wrappedLines.forEach((wrappedLine, index) => {
            if (index > 0) checkNewPage(8);
            renderFormattedText(wrappedLine, textX, y);
            if (index < wrappedLines.length - 1) y += lineHeight;
          });
          
          y += lineHeight + 2;
          return;
        }
  
        // Regular paragraph
        if (line.trim()) {
          checkNewPage(15);
          
          const wrappedLines = wrapText(line, contentWidth, 11);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(11);
          
          wrappedLines.forEach((wrappedLine, index) => {
            if (index > 0) checkNewPage(8);
            renderFormattedText(wrappedLine, margins.left, y);
            if (index < wrappedLines.length - 1) y += lineHeight;
          });
          
          y += lineHeight + 3;
        }
      };
  
      // Enhanced text formatting with bold/italic support
      const renderFormattedText = (text: string, x: number, currentY: number) => {
        const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
        const parts = text.split(regex);
        
        let currentX = x;
        pdf.setTextColor(...colors.text);
  
        parts.forEach(part => {
          if (!part) return;
          
          if (part.startsWith("**") && part.endsWith("**")) {
            // Bold text
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(...colors.primary);
            const cleanText = part.slice(2, -2);
            pdf.text(cleanText, currentX, currentY);
            currentX += pdf.getTextWidth(cleanText);
          } else if (part.startsWith("*") && part.endsWith("*")) {
            // Italic text
            pdf.setFont("helvetica", "italic");
            pdf.setTextColor(...colors.secondary);
            const cleanText = part.slice(1, -1);
            pdf.text(cleanText, currentX, currentY);
            currentX += pdf.getTextWidth(cleanText);
          } else if (part.startsWith("`") && part.endsWith("`")) {
            // Code text
            pdf.setFont("courier", "normal");
            pdf.setTextColor(...colors.lightText);
            const cleanText = part.slice(1, -1);
            pdf.text(cleanText, currentX, currentY);
            currentX += pdf.getTextWidth(cleanText);
          } else {
            // Normal text
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(...colors.text);
            pdf.text(part, currentX, currentY);
            currentX += pdf.getTextWidth(part);
          }
        });
      };
  
      // Add document title
      addHeader(`Personalized Diet Plan`);
      
      // Add generation date
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(10);
      pdf.setTextColor(...colors.lightText);
      pdf.text(`Generated on: ${currentDate}`, margins.left, y);
      pdf.text(payload.name, pageWidth - margins.right, y, { align: "right" });
      y += 15;
      
      // Process content
      const lines = response.split('\n');
      
      lines.forEach(line => {
        if (line.trim() === "") {
          y += paragraphSpacing / 2;
        } else {
          renderMarkdownLine(line.trim());
        }
      });
  
      // Add footer to all pages
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        
        // Footer line
        pdf.setDrawColor(...colors.secondary);
        pdf.setLineWidth(0.3);
        pdf.line(margins.left, pageHeight - margins.bottom + 5, 
                 margins.left + contentWidth, pageHeight - margins.bottom + 5);
        
        // Page number
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...colors.lightText);
        pdf.text(`Page ${i} of ${pageCount}`, 
                 margins.left + contentWidth - 20, pageHeight - margins.bottom + 12);
        
        // Footer text
        pdf.text("Personalized Diet Plan", margins.left, pageHeight - margins.bottom + 12);
      }
  
      // Save with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      pdf.save(`Diet_Plan_${timestamp}.pdf`);
      
      console.log("✅ Diet plan PDF generated successfully!");
      
    } catch (err) {
      console.error("❌ Failed to generate diet plan PDF:", err);
    }
  };