let worker;
const decoder = new TextDecoder("utf-8");
let byteArray = [];
let processTimeoutSeconds = 4000 


function initializeWorker() {
    if (worker) {
        worker.terminate();
    }
    worker = new Worker('worker.js');
    currentTime = new Date();
    console.log( currentTime, ":Worker Initialized");
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
        console.log("final output",event.data);
        
        
    } else if (event.data.type === 'error') {
        displayOutput();
        document.getElementById('output').textContent += '\nError: ' + event.data.content;
    
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
            let currentTime = new Date();
            console.log( currentTime, ":Worker Terminated");
            displayOutput();
            currentTime = new Date();
            console.log( currentTime, ":Output Displayed");
            document.getElementById('output').textContent += '\nWorker terminated due to timeout.';
            initializeWorker(); // Reinitialize the worker after timeout
            
        }
    }, processTimeoutSeconds);
}

initializeWorker();


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('runButton').addEventListener('click', runPythonCode);

    // Initialize the worker when the script is loaded
    //initializeWorker();
});
