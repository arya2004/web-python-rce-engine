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
        return;
    }

    // Send final output (if any)
    self.postMessage({ type: 'final_output', content: 'Execution completed.' });
};




// self.onmessage = async (event) => {
//     const { code, indexURL } = event.data;

//     importScripts(`${indexURL}pyodide.js`);

//     let pyodide = await loadPyodide({
//         indexURL: indexURL
//     });

//     // Redirect stdout and stderr to capture print statements
//     pyodide.runPython(`
// import sys
// from io import StringIO
// sys.stdout = sys.stderr = StringIO()
// `);

//     let output = '';

//     // Function to periodically send output back to the main thread
//     function sendOutput() {
//         const currentOutput = pyodide.runPython('sys.stdout.getvalue()');
//         self.postMessage({ type: 'output', content: currentOutput });
//     }

//     // Set interval to periodically send output
//     const outputInterval = setInterval(sendOutput, 100);

//     // Run the Python code in a try-catch block
//     try {
//         pyodide.runPython(code);
//     } catch (err) {
//         clearInterval(outputInterval);
//         self.postMessage({ type: 'error', content: err.toString() });
//         return;
//     }

//     // Clear interval and send final output
//     clearInterval(outputInterval);
//     const finalOutput = pyodide.runPython('sys.stdout.getvalue()');
//     self.postMessage({ type: 'final_output', content: finalOutput });
// };
