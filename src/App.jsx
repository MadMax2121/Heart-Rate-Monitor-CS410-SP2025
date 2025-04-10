import React, { useState } from "react";

const App = () => {
  const [inputName, setInputName] = useState("");
  const [submittedName, setSubmittedName] = useState("");

  const handleSubmit = () => {
    if (inputName.trim() !== "") {
      setSubmittedName(inputName.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full text-black p-4">
      {submittedName ? (
        <>
          <h1 className="text-4xl font-bold">Hello, {submittedName}!</h1>
          <p className="text-lg mt-4">Welcome to your heart rate monitor.</p>
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
