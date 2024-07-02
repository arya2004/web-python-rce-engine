// Define an object to hold the functions
const MyPythonRunner = {
    worker: null,
    decoder: new TextDecoder("utf-8"),
    byteArray: [],
    processTimeoutSeconds: 4000,

    initializeWorker: function() {
        if (this.worker) {
            this.worker.terminate();
        }
        this.worker = new Worker('worker.js');
        let currentTime = new Date();
        console.log(currentTime + ": Worker Initialized");
        this.byteArray = [];

        this.worker.onmessage = (event) => {
            this.handleWorkerMessage(event);
        };
    },

    handleWorkerMessage: function(event) {
        if (event.data.type === 'aByte') {
            this.byteArray.push(event.data.content);
        }
        if (event.data.type === 'final_output') {
            this.byteArray.push(event.data.content);
            this.displayOutput();
            console.log("final output", event.data);
        } else if (event.data.type === 'error') {
            this.displayOutput();
            document.getElementById('output').textContent += '\nError: ' + event.data.content;
        }
    },

    displayOutput: function() {
        const byteArray2 = new Uint8Array(this.byteArray);
        const str = this.decoder.decode(byteArray2);
        console.log(str);
        document.getElementById('output').textContent = str;
    },

    runPythonCode: function(code) {
        this.worker.postMessage({
            code: code,
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/'
        });

        // Terminate the worker if it takes more than 6 seconds
        setTimeout(() => {
            if (this.worker) {
                this.worker.terminate();
                let currentTime = new Date();
                console.log(currentTime + ": Worker Terminated");
                this.displayOutput();
                currentTime = new Date();
                console.log(currentTime + ": Output Displayed");
                document.getElementById('output').textContent += '\nWorker terminated due to timeout.';
                this.initializeWorker(); // Reinitialize the worker after timeout
            }
        }, this.processTimeoutSeconds);
    }
};

// Initialize the worker when the script is loaded
MyPythonRunner.initializeWorker();

// Expose the MyPythonRunner object to be used by the external library (jslib)
window.MyPythonRunner = MyPythonRunner;
