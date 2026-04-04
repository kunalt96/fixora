import { useEffect, useState } from "react";

function App() {
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/errors")
      .then((res) => res.json())
      .then((data) => setErrors(data));
  }, []);

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
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;