self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js');

let pyodideReadyPromise = (async () => {
    self.pyodide = await loadPyodide();
})();

self.onmessage = async function(e) {
    await pyodideReadyPromise;  // Ensure Pyodide is loaded
    const code = e.data.code;
    //console.log("code: ",code);
    let output;
    let error;
    try {
        output = await self.pyodide.runPythonAsync(code);
        console.log(output);
     
    } catch (err) {
        console.log("Errror\n\n");
        error = err.toString();
    }
    self.postMessage({ result: output , error: error });
};
