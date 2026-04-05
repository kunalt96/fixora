import { useState, useEffect, useCallback, useMemo } from 'react';

function App() {
  const [errors, setErrors] = useState([]);
  const [apiKey, setApiKey] = useState(localStorage.getItem('fixora_api_key') || "");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [generatedApiKey, setGeneratedApiKey] = useState("");
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
    if (!apiKey) return;
    fetch('http://localhost:4000/api/errors', {
      headers: {
        'x-api-key': apiKey
      }
    })
      .then((res) => res.json())
      .then((data) => setErrors(data))
      .catch((err) => console.error("failed to fetch errors", err));
  }, [apiKey]);

  const analyzeError = useCallback(async (err) => {
    setSelectedError(err);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
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
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">Fixora</h1>
              <span className="text-gray-400 text-sm">
                AI Error Intelligence
              </span>
            </div>
            <button
              onClick={async () => {
                try {
                  const res = await fetch("http://localhost:4000/api/generate-apiKey");
                  const data = await res.json();
                  setGeneratedApiKey(data.apiKey);
                  setShowApiKeyModal(true);
                  localStorage.setItem("fixora_api_key", data.apiKey);
                  setApiKey(data.apiKey);
                } catch (err) {
                  console.error(err);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition"
            >
              Generate API Key
            </button>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search errors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-6 px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
          />

          {/* ERROR LIST */}
          {filteredErrors.length === 0 && (
            <p className="text-gray-400">No errors found</p>
          )}

          <div className="space-y-4">
            {filteredErrors.map((err) => (
              <div
                key={err.id}
                onClick={() => setSelectedError(err)}
                className="bg-gray-800 p-4 rounded-xl border border-gray-700 cursor-pointer hover:border-blue-500 transition"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-red-400">
                    {err.message}
                  </h2>

                  <span className="text-xs bg-red-500 px-2 py-1 rounded">
                    Error
                  </span>
                </div>

                <div className="mt-2 text-sm text-gray-300">
                  <p className="text-red-400 font-bold">
                    {err.count} occurrences
                  </p>
                  <p className="truncate">URL: {err.url}</p>
                  <p>
                    Last Seen:{" "}
                    {new Date(err.lastSeen).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        {selectedError && (
          <div className="fixed right-0 top-0 h-full w-[400px] bg-gray-900 border-l border-gray-700 p-5 overflow-y-auto">

            <h2 className="text-xl font-bold mb-4 text-blue-400">
              Error Details
            </h2>

            <p className="mb-2">
              <b>Message:</b> {selectedError.message}
            </p>

            <p className="mb-2">
              <b>Count:</b> {selectedError.count}
            </p>

            <p className="mb-2">
              <b>URL:</b> {selectedError.url}
            </p>

            <p className="mb-4 text-sm text-gray-400">
              Last Seen:{" "}
              {new Date(selectedError.lastSeen).toLocaleString()}
            </p>

            <button
              onClick={() => analyzeError(selectedError)}
              className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Explain & Fix
            </button>

            <button
              onClick={() => setSelectedError(null)}
              className="mt-3 w-full py-2 bg-gray-700 rounded"
            >
              Close
            </button>
          </div>
        )}

        {/* MODAL */}
        {analyses && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-gray-900 text-white p-6 rounded-xl w-[500px] border border-gray-700">

              <h2 className="text-xl font-bold mb-4 text-green-400">
                AI Debug Analysis
              </h2>

              {loading ? (
                <p className="text-gray-400">Analyzing...</p>
              ) : (
                <div className="space-y-3 text-sm">
                  <p><b>Cause:</b> {analyses.cause}</p>
                  <p><b>Explanation:</b> {analyses.explanation}</p>
                  <p><b>Fix:</b> {analyses.fix}</p>
                  <p><b>Confidence:</b> {analyses.confidence}</p>
                </div>
              )}

              <button
                onClick={() => setAnalyses(null)}
                className="mt-4 px-4 py-2 bg-red-600 rounded"
              >
                Close
              </button>

            </div>
          </div>
        )}

        {showApiKeyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)] p-8 rounded-2xl w-[450px] text-center">
              <div className="mx-auto bg-green-500/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <span className="text-green-500 text-xl font-bold">✔</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 ml-1">API Key Generated!</h2>
              <p className="text-sm text-gray-400 mb-6">Please copy this key and keep it safe. It is required to authenticate your Fixora SDK and cannot be viewed again.</p>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6 flex items-center justify-between">
                <code className="text-[#4ade80] font-mono tracking-wider break-all">{generatedApiKey}</code>
                <button
                  onClick={() => navigator.clipboard.writeText(generatedApiKey)}
                  className="ml-4 text-gray-400 hover:text-white transition"
                  title="Copy to clipboard"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              <button
                onClick={() => setShowApiKeyModal(false)}
                className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-semibold transition"
              >
                I've copied it securely
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;