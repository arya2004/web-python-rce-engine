let worker;
let timeout;

function initializeWorker() {
    worker = new Worker('worker.js');
    
    worker.onmessage = function(e) {
        clearTimeout(timeout);
        if (e.data.result) {
            displayOutput(e.data.result);
        } else if (e.data.error) {
            displayOutput(e.data.error);
        }
    };
}

function runPythonCode(code) {  
    timeout = setTimeout(() => {
        worker.terminate();
        console.log("Worker terminated cause of timeout");
        // Reinitialize the worker after termination
        initializeWorker();
    }, 1000); // Set timeout to 1 second

    worker.postMessage({ code: code });
}

function displayOutput(output) {
    document.getElementById("output").innerText = output;
}

// Initial worker setup
initializeWorker();

document.querySelector("button").addEventListener("click", () => {
    const code = document.getElementById("pythonCode").value;
    runPythonCode(code);
});
