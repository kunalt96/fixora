import { useState, useEffect, useCallback, useMemo } from 'react';

function App() {
  const [errors, setErrors] = useState([]);
  const [analyses, setAnalyses] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedError, setSelectedError] = useState(null);
  const [search, setSearch] = useState("");

  const filteredErrors = useMemo(() => {
    return errors.filter(err =>
      err.message.toLowerCase().includes(search.toLowerCase()) ||
      err.url.toLowerCase().includes(search.toLowerCase())
    );
  }, [errors, search]);

  useEffect(() => {
    fetch('http://localhost:4000/api/errors')
      .then((res) => res.json())
      .then((data) => setErrors(data))
      .catch((err) => console.error("failed to fetch errors", err));
  }, []);

  const analyzeError = useCallback(async (err) => {
    setSelectedError(err);
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-6">Fixora Dashboard</h1>
        <input
          type="text"
          placeholder="Search errors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
        />
        {filteredErrors.length === 0 && (
          <p className="text-gray-400">No errors found</p>
        )}

        <div className="space-y-4">
          {filteredErrors.map((err) => (
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
        </div>
      </div>
      {selectedError && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-900 text-white p-6 rounded-xl w-[500px] border border-gray-700">

            <h2 className="text-xl font-bold mb-4">
              AI Debug Analysis
            </h2>

            {loading ? (
              <p className="text-gray-400">Analyzing...</p>
            ) : (
              analyses && (
                <div className="space-y-3 text-sm">
                  <p><b>Explanation:</b> {analyses.explanation}</p>
                  <p><b>Fix:</b> {analyses.fix}</p>
                  <p><b>Confidence:</b> {analyses.confidence}</p>
                </div>
              )
            )}

            <button
              onClick={() => {
                setSelectedError(null);
                setAnalyses(null);
              }}
              className="mt-4 px-4 py-2 bg-red-600 rounded"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </>
  );
}

export default App;