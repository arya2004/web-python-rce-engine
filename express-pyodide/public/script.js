let worker;
let timeout;

function initializeWorker() {
    worker = new Worker('worker.js');
    
    worker.onmessage = function(e) {
        clearTimeout(timeout);
        
        console.log("return val:",e.data);

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

        if(document.getElementById("output").innerText == ""){
            document.getElementById("output").innerText = "Time Limit Exceeded"
        }
        // Reinitialize the worker after termination

        initializeWorker();
    }, 1000); // Set timeout to 1 second
    
    document.getElementById("output").innerText = ""

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
