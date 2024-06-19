function runPythonCode() {
    const code = document.getElementById("pythonCode").value;
    const worker = new Worker('worker.js');
    
    const timeout = setTimeout(() => {
        worker.terminate();
        document.getElementById("output").innerText = "Error: Execution timed out.";
    }, 5000); 

    worker.onmessage = function(e) {
        clearTimeout(timeout);
        if (e.data.result) {
            document.getElementById("output").innerText = e.data.result;
        } else if (e.data.error) {
            document.getElementById("output").innerText = e.data.error;
        }
    };

    worker.postMessage({ code: code });
}

document.querySelector("button").addEventListener("click", runPythonCode);
