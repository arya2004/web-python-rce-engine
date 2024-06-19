self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js');

async function loadPyodideAndPackages() {
    self.pyodide = await loadPyodide();
}

self.onmessage = async function(e) {
    const code = e.data.code;
    await loadPyodideAndPackages();
    try {
        let output = await self.pyodide.runPythonAsync(code);
        self.postMessage({ result: output });
    } catch (err) {
        self.postMessage({ error: err.toString() });
    }
};
