document.addEventListener("DOMContentLoaded", () => {
    const authorizedMetaMaskId = '0x1843Be0f45204A7344fC1DF8913737c6b5730301';
    const registerSection = document.getElementById('registerSection');
    const doctorForm = document.getElementById('doctorForm');
    const loginForm = document.getElementById('loginForm');
    const patientAccessForm = document.getElementById('patientAccessForm');
    const doctorInfoP = document.getElementById('doctorInfo');

    document.getElementById('registerBtn').addEventListener('click', async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                const doctorAddress = accounts[0];
                console.log('Doctor MetaMask ID:', doctorAddress);

                if (doctorAddress.toLowerCase() !== authorizedMetaMaskId.toLowerCase()) {
                    alert('Unauthorized MetaMask ID.');
                    return;
                }

                registerSection.style.display = 'none';
                doctorForm.style.display = 'block';
            } catch (error) {
                console.error('User denied account access');
            }
        } else {
            alert('MetaMask is not installed. Please install it to use this feature.');
        }
    });

    document.getElementById('submitDoctorBtn').addEventListener('click', () => {
        const name = document.getElementById('doctorName').value;
        const specialty = document.getElementById('doctorSpecialty').value;
        const age = document.getElementById('doctorAge').value;

        if (!name || !specialty || !age) {
            alert('Please fill out all fields.');
            return;
        }

        const doctor = {
            id: authorizedMetaMaskId,
            name,
            specialty,
            age,
            registrationId: generateUniqueId()
        };

        localStorage.setItem('doctor', JSON.stringify(doctor));
        alert(`Doctor registered successfully. Your registration ID is ${doctor.registrationId}`);

        doctorForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    document.getElementById('loginDoctorBtn').addEventListener('click', () => {
        const registrationId = document.getElementById('registrationIdInput').value;
        const storedDoctor = JSON.parse(localStorage.getItem('doctor'));

        if (storedDoctor && storedDoctor.registrationId === registrationId) {
            loginForm.style.display = 'none';
            patientAccessForm.style.display = 'block';
            doctorInfoP.textContent = `Logged in as: ${storedDoctor.name}, ${storedDoctor.specialty}, Age: ${storedDoctor.age}`;
        } else {
            alert('Invalid Registration ID.');
        }
    });

    document.getElementById('requestAccessBtn').addEventListener('click', () => {
        const transactionId = document.getElementById('transactionIdInput').value;
        const storedDoctor = JSON.parse(localStorage.getItem('doctor'));

        requestPermission(transactionId, storedDoctor.id);
    });

    // Function to request permission from the patient
    async function requestPermission(transactionId, doctorId) {
        const patients = JSON.parse(localStorage.getItem('patients') || '{}');
        let patientId = null;

        // Find patient ID by transaction ID
        for (const id in patients) {
            if (patients[id].transactionId === transactionId) {
                patientId = id;
                break;
            }
        }

        if (!patientId) {
            alert('Patient with this transaction ID does not exist.');
            return;
        }

        const patient = patients[patientId];
        const response = confirm(`Doctor ${doctorId} is requesting access to your medical records. Do you approve?`);
        if (response) {
            const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');
            if (!permissions[patientId]) {
                permissions[patientId] = [];
            }
            permissions[patientId].push(doctorId);
            localStorage.setItem('permissions', JSON.stringify(permissions));
            alert('Permission granted.');
            displayDoctorActions(patientId);
        } else {
            alert('Permission denied.');
        }
    }

    // Function to display doctor actions if permission is granted
    function displayDoctorActions(patientId) {
        const patients = JSON.parse(localStorage.getItem('patients') || '{}');
        const patient = patients[patientId];
        const doctorActionsDiv = document.getElementById('doctorActions');

        doctorActionsDiv.innerHTML = `
            <h3>Patient Details</h3>
            <p>ID: ${patientId}</p>
            <p>Name: ${patient.name}</p>
            <p>Age: ${patient.age}</p>
            <p>Medical History: ${patient.medicalHistory.join(', ')}</p>
            <h3>Uploaded Documents</h3>
        `;

        if (patient.documents.length > 0) {
            patient.documents.forEach(document => {
                doctorActionsDiv.innerHTML += `<p><a href="${document.url}" target="_blank">${document.name}</a></p>`;
            });
        } else {
            doctorActionsDiv.innerHTML += `<p>No documents available.</p>`;
        }
    }

    // Function to generate a unique ID
    function generateUniqueId() {
        return 'doc_' + Math.random().toString(36).substr(2, 9);
    }
});
