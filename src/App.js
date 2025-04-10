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
    <div className="p-6 text-center">
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
            className="border border-gray-300 rounded p-2 mr-2"
            placeholder="Enter your full name"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white rounded px-4 py-2 mt-2"
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
};

export default App;
