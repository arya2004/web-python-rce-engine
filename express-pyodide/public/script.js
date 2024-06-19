let worker;
let timeout;

function initializeWorker() {
    worker = new Worker('worker.js');
    
    worker.onmessage = function(e) {
        clearTimeout(timeout);
        if (e.data.result) {
            document.getElementById("output").innerText = e.data.result;
        } else if (e.data.error) {
            document.getElementById("output").innerText = e.data.error;
        }
    };
}

function runPythonCode() {
    const code = document.getElementById("pythonCode").value;
    
    timeout = setTimeout(() => {
        worker.terminate();
        document.getElementById("output").innerText = "Error: Execution timed out.";
        // Reinitialize the worker after termination
        initializeWorker();
    }, 1000); // Set timeout to 1 second

    worker.postMessage({ code: code });
}

// Initial worker setup
initializeWorker();

document.querySelector("button").addEventListener("click", runPythonCode);
