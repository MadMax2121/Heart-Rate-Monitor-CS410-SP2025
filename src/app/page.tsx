'use client'
import React, { useState, useEffect } from "react";

// Define a type for heart rate data
interface HeartRateData {
  id: number;
  data: any;
  created_at: string;
}

const App = () => {
  const [inputName, setInputName] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [heartRateData, setHeartRateData] = useState<any>(null);
  const [recentRequests, setRecentRequests] = useState<HeartRateData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (inputName.trim() !== "") {
      setSubmittedName(inputName.trim());
    }
  };

  const fetchHeartRateData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/heart-rate");
      const data = await response.json();
      setHeartRateData(data.latest);
      setRecentRequests(data.recentRequests || []);
    } catch (error) {
      console.error("Failed to fetch heart rate data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on initial load when user has submitted their name
  useEffect(() => {
    if (submittedName) {
      fetchHeartRateData();
    }
  }, [submittedName]);

  // Format the timestamp
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full text-black p-4">
      {submittedName ? (
        <>
          <h1 className="text-4xl font-bold">Hello, {submittedName}!</h1>
          <p className="text-lg mt-4">Welcome to your heart rate monitor.</p>

          <button
            onClick={fetchHeartRateData}
            className="bg-green-600 text-white px-4 py-2 rounded mt-4 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Loading...
              </>
            ) : (
              "Load Latest Heart Rate"
            )}
          </button>

          {heartRateData && (
            <div className="mt-4 w-full max-w-xl">
              <h2 className="text-xl font-semibold mb-2">Latest Data</h2>
              <pre className="p-3 bg-gray-100 rounded shadow w-full">
                {JSON.stringify(heartRateData, null, 2)}
              </pre>
            </div>
          )}

          {recentRequests.length > 0 && (
            <div className="mt-6 w-full max-w-xl">
              <h2 className="text-xl font-semibold mb-2">Recent Requests (Last 5)</h2>
              <div className="space-y-3">
                {recentRequests.map((request) => (
                  <div key={request.id} className="p-3 bg-gray-100 rounded shadow">
                    <div className="text-sm text-gray-500 mb-1">
                      Timestamp: {formatTimestamp(request.created_at)}
                    </div>
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(request.data, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
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
