'use client'
import React, { useState } from "react";

const App = () => {
  const [inputName, setInputName] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [heartRateData, setHeartRateData] = useState(null);

  const handleSubmit = () => {
    if (inputName.trim() !== "") {
      setSubmittedName(inputName.trim());
    }
  };

  const fetchHeartRateData = async () => {
    try {
      const response = await fetch("/api/heart-rate");
      const data = await response.json();
      setHeartRateData(data.body);
    } catch (error) {
      console.error("Failed to fetch heart rate data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full text-black p-4">
      {submittedName ? (
        <>
          <h1 className="text-4xl font-bold">Hello, {submittedName}!</h1>
          <p className="text-lg mt-4">Welcome to your heart rate monitor.</p>

          <button
            onClick={fetchHeartRateData}
            className="bg-green-600 text-white px-4 py-2 rounded mt-4"
          >
            Load Latest Heart Rate
          </button>

          {heartRateData && (
            <pre className="mt-4 p-3 bg-gray-100 rounded shadow w-full max-w-xl">
              {JSON.stringify(heartRateData, null, 2)}
            </pre>
          )}
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">What's your name?</h1>
          <input
            type="text"
            className="border border-gray-300 rounded p-2 mb-2"
            placeholder="Enter your full name"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
};

export default App;
