self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js');

let pyodideReadyPromise = (async () => {
    self.pyodide = await loadPyodide();
})();

self.onmessage = async function(e) {
    await pyodideReadyPromise;  // Ensure Pyodide is loaded
    const code = e.data.code;
    try {
        let output = await self.pyodide.runPythonAsync(code);
        console.log(output);
        self.postMessage({ result: output });
    } catch (err) {
        console.log("Errror\n\n");
        self.postMessage({ error: err.toString() });
    }
};
