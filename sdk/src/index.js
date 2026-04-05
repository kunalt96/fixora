export function init({ apiURL, apiKey }) {
  if (!apiURL || !apiKey) {
    console.error("Fixora: APP URL or APIKEY  is required.");
    return;
  }

  // JS Errors
  window.onerror = function (message, source, lineno, colno, error) {
    sendError({
      message,
      stack: error?.stack || "",
      url: window.location.href
    });
  };

  // Promise / async errors
  window.onunhandledrejection = function (event) {
    sendError({
      message: event.reason?.message || "Unhandled Promise Rejection",
      stack: event.reason?.stack || "",
      url: window.location.href
    });
  };
  function sendError(errorData) {
    fetch(`${apiURL}/errors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey || "anonymous"
      },
      body: JSON.stringify(errorData)
    }).catch(() => {
      console.error("Fixora: Failed to send error");
    });
  }
  console.log("Fixora initialized and Ready to USE");
}
