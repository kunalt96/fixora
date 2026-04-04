import { useState, useEffect } from 'react';

function App() {
  const [errors, setErrors] = useState([]);
  const [analyses, setAnalyses] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/errors')
      .then((res) => res.json())
      .then((data) => setErrors(data))
      .catch((err) => console.error("failed to fetch errors", err));
  }, []);

  const analyzeError = async (err) => {
    try {
      const res = await fetch("http://localhost:4000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: err.message, stack: err.stack }),
      });
      const data = await res.json();
      setAnalyses(data);
    } catch (error) {
      console.error("Failed to analyze error", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Fixora Dashboard</h1>

      {errors.length === 0 && (
        <p className="text-gray-400">No errors found</p>
      )}

      <div className="space-y-4">
        {errors.map((err) => (
          <div
            key={err.id}
            className="bg-gray-800 p-4 rounded-xl shadow-md border border-gray-700"
          >
            <h2 className="text-lg font-semibold text-red-400">
              {err.message}
            </h2>

            <div className="mt-2 text-sm text-gray-300">
              <p>Count: {err.count}</p>
              <p className="truncate">URL: {err.url}</p>
              <p>
                Last Seen:{" "}
                {new Date(err.lastSeen).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => analyzeError(err)}
              className="mt-3 px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
            >
              Explain & Fix
            </button>
          </div>
        ))}
        {analyses && (
          <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold text-green-400 mb-2">
              AI Analysis
            </h2>

            <p><b>Explanation:</b> {analyses.explanation}</p>
            <p><b>Fix:</b> {analyses.fix}</p>
            <p><b>Confidence:</b> {analyses.confidence}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;