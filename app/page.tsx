"use client"
import HealthForm from './components/HealthForm';
import HealthResults from './components/HealthResults';
import { useState, useEffect } from 'react';
import { Heart, Stethoscope, Activity, Shield, Users, TrendingUp, AlertTriangle, FileText } from 'lucide-react';

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
  const [showForm, setShowForm] = useState(false);

  // Use useEffect to watch for results changes and open modal
  useEffect(() => {
    if (results) {
      setIsModalOpen(true);
    }
  }, [results]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToForm = () => {
    setShowForm(true);
  };

  const backToHome = () => {
    setShowForm(false);
  };

  // Show Health Form when button is clicked
  if (showForm) {
    return (
      <main className="min-h-screen relative overflow-hidden flex flex-col">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-200/40 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-40 left-20 w-40 h-40 bg-purple-200/25 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 bg-pink-200/35 rounded-full blur-xl animate-bounce"></div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3e%3cpath d='m 60 0 l 0 60 l -60 0 z' fill='none' stroke='%23000000' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")`
          }}></div>
        </div>

        {/* Header Section */}
        <div className="relative z-10 pt-8 pb-4 flex-shrink-0">
          <div className="w-full px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            {/* Heading Section */}
            <div className="flex items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
                  Health Assessment Form
                </h1>
                <p className="text-sm text-gray-600">
                  Complete your health profile for personalized insights
                </p>
              </div>
            </div>

            {/* Button Section */}
            <div className="flex xs:justify-end">
              <button
                onClick={backToHome}
                className="xs:w-1/4 px-4 py-2 bg-white/90 hover:bg-white backdrop-blur-sm text-gray-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2 border border-gray-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </button>
            </div>

          </div>
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12 my-10">
            <h1 className="text-3xl xs:text-base sm:text-2xl lg:text-5xl font-bold text-gray-900 mb-2">
              Health Assessment
            </h1>
            <p className="text-gray-600 text-base sm:text-lg lg:text-xl">
              Get personalized health insights and recommendations
            </p>
          </div>
        </div>


        {/* Form Content */}
        <div className="w-full relative flex-1">
          <div className="w-full max-w-none mx-auto h-full px-4 sm:px-0">
            <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/30 h-full">
              <HealthForm setResults={setResults} results={results} />
            </div>
          </div>
        </div>
        {/* Results Modal */}
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

        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </main>
    );
  }

  // Home Page Content
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-200/40 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-purple-200/25 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-pink-200/35 rounded-full blur-xl animate-bounce"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3e%3cpath d='m 60 0 l 0 60 l -60 0 z' fill='none' stroke='%23000000' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")`
        }}></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 shadow-2xl mb-6">
            <Heart className="text-white w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 mb-4">
            Health Assessment Center
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Get personalized health insights and recommendations based on your body metrics
          </p>
        </div>
      </div>

      {/* Health Icons Floating Animation */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {/* Stethoscope */}
        <div className="absolute top-32 left-16 opacity-10 animate-float">
          <Stethoscope className="w-16 h-16 text-blue-600" />
        </div>

        {/* Activity */}
        <div className="absolute top-48 right-24 opacity-10 animate-float-delayed">
          <Activity className="w-20 h-20 text-emerald-600" />
        </div>

        {/* Shield */}
        <div className="absolute bottom-60 left-32 opacity-10 animate-float">
          <Shield className="w-18 h-18 text-purple-600" />
        </div>

        {/* Users */}
        <div className="absolute bottom-40 right-28 opacity-10 animate-float-delayed">
          <Users className="w-16 h-16 text-pink-600" />
        </div>

        {/* Trending Up */}
        <div className="absolute top-72 left-1/2 transform -translate-x-1/2 opacity-10 animate-float">
          <TrendingUp className="w-14 h-14 text-orange-600" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-4 min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-2xl">
          {/* Health Stats Preview Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-sm font-semibold text-gray-700">BMI Analysis</div>
              <div className="text-xs text-gray-500">Body Mass Index</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-sm font-semibold text-gray-700">BMR Calculation</div>
              <div className="text-xs text-gray-500">Metabolic Rate</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-sm font-semibold text-gray-700">Health Tips</div>
              <div className="text-xs text-gray-500">Personalized</div>
            </div>
          </div>

          {/* Important Caution Card */}
          <div className="bg-amber-50/90 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-amber-200/50 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-800 mb-2">Important Notice</h3>
                <div className="space-y-3 text-amber-700">
                  <p className="leading-relaxed">
                    This health assessment tool generates results based on the information <strong>you provide</strong>.
                    Please ensure you fill the form with <strong>exact and accurate parameters</strong> for reliable calculations.
                  </p>
                  <p className="leading-relaxed">
                    <strong>Do not enter arbitrary or random values</strong> as this will result in inaccurate health assessments
                    that could be misleading.
                  </p>
                  <div className="bg-amber-100/70 rounded-xl p-4 border border-amber-200">
                    <p className="font-semibold text-amber-800 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Medical Disclaimer:
                    </p>
                    <p className="text-sm mt-2 text-amber-700">
                      If you have serious health problems or medical conditions, please consult with a qualified
                      healthcare professional or doctor. This tool is for informational purposes only and should
                      not replace professional medical advice.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Proceed to Form Button */}
            <div className="text-center">
              <button
                onClick={goToForm}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 transform hover:from-blue-600 hover:to-emerald-600"
              >
                <Heart className="w-6 h-6" />
                Start Health Assessment
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <p className="text-sm text-gray-600 mt-3">
                Click to proceed to the health assessment form
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full px-4">
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Professional Analysis</h3>
            <p className="text-sm text-gray-600">Get medically accurate health assessments based on proven formulas</p>
          </div>

          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Personalized Insights</h3>
            <p className="text-sm text-gray-600">Receive tailored recommendations for your unique health profile</p>
          </div>

          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Track Progress</h3>
            <p className="text-sm text-gray-600">Monitor your health journey with comprehensive PDF reports</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}