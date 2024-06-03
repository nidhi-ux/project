window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const connectedAccount = accounts[0];
            const storedAccount = localStorage.getItem('connectedAccount');
            const doctorAddresses = JSON.parse(localStorage.getItem('doctorAddresses') || '[]');

            if (storedAccount && storedAccount === connectedAccount) {
                alert('Already connected to MetaMask with account: ' + connectedAccount);
            } else {
                localStorage.setItem('connectedAccount', connectedAccount);
                alert('MetaMask connected: ' + connectedAccount);

                if (!doctorAddresses.includes(connectedAccount)) {
                    doctorAddresses.push(connectedAccount);
                    localStorage.setItem('doctorAddresses', JSON.stringify(doctorAddresses));
                }
            }
        } catch (error) {
            console.error(error);
            alert('MetaMask connection failed');
        }
    } else {
        alert('MetaMask is not installed. Please install MetaMask and try again.');
    }
});

document.getElementById('adminBtn').addEventListener('click', () => {
    window.location.href = 'admin.html';
});

document.getElementById('doctorBtn').addEventListener('click', () => {
    window.location.href = 'doctor.html';
});

document.getElementById('patientBtn').addEventListener('click', () => {
    window.location.href = 'patient.html';
});



/*
document.getElementById('registerDoctorBtn').addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            localStorage.setItem('doctorAccount', accounts[0]);
            alert('MetaMask account connected: ' + accounts[0]);
            window.location.href = 'patient.html';
        } catch (error) {
            console.error(error);
            alert('MetaMask connection failed');
        }
    } else {
        alert('MetaMask is not installed. Please install MetaMask and try again.');
    }
});

*/