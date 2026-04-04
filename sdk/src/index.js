export function init({ apiURL }) {
  console.log(apiURL)
  if (!apiURL) {
    console.error("fixora: APP URL is required.");
    return;
  }

  console.log("Fixora initialized");

  window.onerror = function (message, source, lineno, colno, error) {
    console.log(message, source, lineno, colno, error)
    fetch(`${apiURL}/errors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        stack: error ? error.stack : '',
        url: window.location.href
      })
    }).catch((err) => {
      console.error("fixora: failed to send error");
    });
  };
}
