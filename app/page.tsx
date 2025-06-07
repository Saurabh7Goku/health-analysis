"use client"
import HealthForm from './components/HealthForm';
import HealthResults from './components/HealthResults';
import { useState } from 'react';

export default function Home() {
  const [results, setResults] = useState(null);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className=" w-full bg-white shadow-lg rounded-lg p-6">
        {/* <h1 className="text-3xl font-bold text-center mb-6">Health Calculator</h1> */}
        <HealthForm setResults={setResults} results={results} />
        {results && <HealthResults results={results} />}
      </div>
    </main>
  );
}