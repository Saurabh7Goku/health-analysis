"use client"
import HealthForm from './components/HealthForm';
import HealthResults from './components/HealthResults';
import { useState, useEffect } from 'react';

export interface HealthResults {
  name: string;
  bmi: { value: number; interpretation: string };
  bmr: number;
  calorieNeeds: number;
  recommendations: string[];
}

export default function Home() {
  const [results, setResults] = useState<HealthResults | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use useEffect to watch for results changes and open modal
  useEffect(() => {
    if (results) {
      setIsModalOpen(true);
    }
  }, [results]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <HealthForm setResults={setResults} results={results} />
      </div>

      {/* iOS-style Modal Overlay */}
      {results && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-5xl max-h-[95vh] mx-4">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 animate-in fade-in slide-in-from-bottom-4">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Scrollable Content */}
              <div className="max-h-[95vh] overflow-y-auto scrollbar-hide">
                <HealthResults results={results} onClose={closeModal} />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}