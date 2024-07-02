self.onmessage = async (event) => {
    const { code, indexURL } = event.data;

    importScripts(`${indexURL}pyodide.js`);

    let pyodide = await loadPyodide();

    // Capture and send stdout and stderr in real-time
    pyodide.setStdout({
        raw: (msg) => {
            self.postMessage({ type: 'aByte', content: msg });
        }
    });

    pyodide.setStderr({
        raw: (msg) => {
            self.postMessage({ type: 'error', content: msg });
        }
    });

    // Run the Python code in a try-catch block
    try {
        await pyodide.runPythonAsync(code);
    } catch (err) {
        self.postMessage({ type: 'error', content: err.toString() });
        
    }

    // Send final output (if any)
    self.postMessage({ type: 'final_output', content: 'Execution completed.' });
};
