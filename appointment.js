// Function to navigate to another page
function navigateTo(page) {
    window.location.href = page;
}

// Function to navigate back to the admin dashboard
function navigateBack() {
    window.location.href = 'admin.html';
}

// Define the initial state
let patients = JSON.parse(localStorage.getItem('patients') || '{}');
let doctors = JSON.parse(localStorage.getItem('doctors') || '{}');
let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
let totalEthereumUsed = JSON.parse(localStorage.getItem('totalEthereumUsed') || '0');
let totalEthereumAvailable = JSON.parse(localStorage.getItem('totalEthereumAvailable') || '100'); // example value

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('appointmentForm')) {
        document.getElementById('appointmentForm').addEventListener('submit', addAppointment);
    }
    if (document.getElementById('numDoctors')) {
        updateStats();
    }
});

// Function to update the stats on the admin dashboard
function updateStats() {
    document.getElementById('numDoctors').textContent = Object.keys(doctors).length;
    document.getElementById('numPatients').textContent = Object.keys(patients).length;
    document.getElementById('totalAppointments').textContent = appointments.length;
    document.getElementById('totalEthereumUsed').textContent = totalEthereumUsed;
    document.getElementById('totalEthereumAvailable').textContent = totalEthereumAvailable;
}

// Function to add an appointment
function addAppointment(event) {
    event.preventDefault();
    
    const patientId = document.getElementById('patientId').value;
    const speciality = document.getElementById('speciality').value;
    const doctor = document.getElementById('doctor').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    
    const newAppointment = {
        patientId,
        speciality,
        doctor,
        date,
        time
    };
    
    appointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    // Update patient and doctor records with the new appointment
    if (patients[patientId]) {
        if (!patients[patientId].appointments) {
            patients[patientId].appointments = [];
        }
        patients[patientId].appointments.push(newAppointment);
    }
    
    if (doctors[doctor]) {
        if (!doctors[doctor].appointments) {
            doctors[doctor].appointments = [];
        }
        doctors[doctor].appointments.push(newAppointment);
    }
    
    localStorage.setItem('patients', JSON.stringify(patients));
    localStorage.setItem('doctors', JSON.stringify(doctors));
    
    alert('Appointment added successfully');
    navigateBack();
}
