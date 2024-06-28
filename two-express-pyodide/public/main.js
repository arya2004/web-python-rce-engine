document.addEventListener('DOMContentLoaded', () => {
    const decoder = new TextDecoder("utf-8");
    let worker;
    let byteArray = [];

    function initializeWorker() {
        if (worker) {
            worker.terminate();
        }
        worker = new Worker('worker.js');
        byteArray = [];

        worker.onmessage = (event) => {
            handleWorkerMessage(event);
        };
    }

    function handleWorkerMessage(event) {
        if (event.data.type === 'aByte') {
            byteArray.push(event.data.content);
        }
        if (event.data.type === 'final_output') {
            byteArray.push(event.data.content);
            displayOutput();
            initializeWorker(); // Reinitialize the worker after execution
        } else if (event.data.type === 'error') {
            displayOutput();
            document.getElementById('output').textContent += '\nError: ' + event.data.content;
            initializeWorker(); // Reinitialize the worker after execution
        }
    }

    function displayOutput() {
        const byteArray2 = new Uint8Array(byteArray);
        const str = decoder.decode(byteArray2);
        console.log(str);
        document.getElementById('output').textContent = str;
    }

    function runPythonCode() {
        const code = document.getElementById('codeInput').value;

        worker.postMessage({
            code: code,
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/'
        });

        // Terminate the worker if it takes more than 6 seconds
        setTimeout(() => {
            if (worker) {
                worker.terminate();
                displayOutput();
                document.getElementById('output').textContent += '\nWorker terminated due to timeout.';
                initializeWorker(); // Reinitialize the worker after timeout
            }
        }, 5000);
    }

    document.getElementById('runButton').addEventListener('click', runPythonCode);

    // Initialize the worker when the script is loaded
    initializeWorker();
});
