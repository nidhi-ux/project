document.addEventListener("DOMContentLoaded", () => {
    const patients = JSON.parse(localStorage.getItem("patients") || "{}");
    const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");

    // Predefined transaction IDs
    const predefinedTransactionIds = [
        '0xcc5E978A109e34a52C20A1ec9FbBc8fC81F5BFe8',
        '0x4Aa1ab9F377C076EEB65D6d697BA2e8bC9F309EC',
        '0xAf74116f6b321ca970523c42479acd00FE132564',
        '0x4A1D19733bb93D303847d89771182daaABf0d35e',
        '0x7b42000928e9A6Df139626d4550cD7C75CA93FCF'
    ];

    let web3;

    async function connectMetaMask() {
        if (window.ethereum) {
            try {
                // Request account access if needed
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                // We initialize web3 and set the provider to MetaMask
                web3 = new Web3(window.ethereum);
                console.log('MetaMask connected');
            } catch (error) {
                console.error('User denied account access');
            }
        } else {
            console.error('MetaMask is not installed');
        }
    }

    async function getPatientData(patientId) {
        const patientDetailsDiv = document.getElementById('patientDetails');
        console.log('Getting data for patient ID:', patientId);
        if (patients[patientId]) {
            displayPatientDetails(patientId);
        } else {
            patientDetailsDiv.innerHTML = '<p>Patient does not exist.</p>';
        }
    }

    async function addNewPatient() {
        const newPatientId = document.getElementById("newPatientId").value;
        const name = document.getElementById("newPatientName").value;
        const age = document.getElementById("newPatientAge").value;
        const medicalHistory = document
            .getElementById("newPatientMedicalHistory")
            .value.split(",")
            .map((item) => item.trim());

        // Assign predefined transaction ID based on the number of patients already added
        const transactionId = predefinedTransactionIds[Object.keys(patients).length];

        console.log(
            "Adding new patient with ID:",
            newPatientId,
            "Name:",
            name,
            "Age:",
            age,
            "Medical History:",
            medicalHistory,
            "Transaction ID:",
            transactionId
        );

        if (!newPatientId || !name || !age || !medicalHistory) {
            alert("Please fill in all fields to add a new patient.");
            return;
        }

        // Check if patient ID already exists
        if (patients[newPatientId]) {
            alert("Patient ID already exists. Please use another ID.");
            return;
        }

        // Generate random Ethereum value between 0 and 2
        const ethereumValue = Math.random() * 2;

        patients[newPatientId] = {
            name,
            age,
            medicalHistory,
            documents: [],
            transactionId,
            ethereumValue
        };
        alert("New patient added with ID: " + newPatientId);
        saveData();
        displayPatientDetails(newPatientId);
        displayAllPatients();
    }

    function displayPatientDetails(patientId) {
        const patient = patients[patientId];
        const patientDetailsDiv = document.getElementById('patientDetails');
        console.log('Displaying details for patient ID:', patientId, patient);
        patientDetailsDiv.innerHTML = `
            <h3>Patient Details</h3>
            <p>ID: ${patientId}</p>
            <p>Name: ${patient.name}</p>
            <p>Age: ${patient.age}</p>
            <p>Medical History: ${patient.medicalHistory.join(', ')}</p>
            <p>Transaction ID: ${patient.transactionId}</p>
        `;
        
        // Display uploaded documents
        if (patient.documents.length > 0) {
            patientDetailsDiv.innerHTML += '<h3>Uploaded Documents</h3>';
            patient.documents.forEach(document => {
                patientDetailsDiv.innerHTML += `<p><a href="${document.url}" target="_blank">${document.name}</a></p>`;
            });
        }
    }

    function displayAllPatients() {
        const allPatientsDiv = document.getElementById('allPatients');
        allPatientsDiv.innerHTML = '';
        Object.keys(patients).forEach(patientId => {
            const patient = patients[patientId];
            const patientDiv = document.createElement('div');
            patientDiv.className = 'patient-record';
            patientDiv.innerHTML = `
                <p>ID: ${patientId}</p>
                <p>Name: ${patient.name}</p>
                <p>Age: ${patient.age}</p>
                <p>Medical History: ${patient.medicalHistory.join(', ')}</p>
                <p>Transaction ID: ${patient.transactionId}</p>
            `;
            allPatientsDiv.appendChild(patientDiv);
        });
    }

    function saveData() {
        localStorage.setItem("patients", JSON.stringify(patients));
        localStorage.setItem("permissions", JSON.stringify(permissions));
    }

    document.getElementById('searchPatientBtn').addEventListener('click', () => {
        const patientId = document.getElementById('patientIdInput').value;
        console.log('Search Patient button clicked with ID:', patientId);
        getPatientData(patientId);
    });

    document.getElementById('addPatientBtn').addEventListener('click', () => {
        console.log('Add Patient button clicked');
        addNewPatient();
    });

    document.getElementById('uploadPdfBtn').addEventListener('click', () => {
        const fileInput = document.getElementById('pdfUpload');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const patientId = document.getElementById('patientIdInput').value;
            console.log('Upload PDF button clicked with file:', file.name, 'for patient ID:', patientId);
            if (patients[patientId]) {
                patients[patientId].documents.push({ name: file.name, url: URL.createObjectURL(file) });
                displayPatientDetails(patientId);
                saveData();
            } else {
                alert('Please search for a patient first.');
            }
        } else {
            alert('No file selected');
        }
    });

    connectMetaMask().then(() => {
        // Initial load
        displayAllPatients();
    });
});
