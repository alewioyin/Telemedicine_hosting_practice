
const bookAppointment = document.querySelector('.bookAppointments');
const bookSpecificDoctorAppointment = document.querySelector('.bookSpecificDoctorAppointments');
const opacity = document.querySelector('.opacity');
const rescheduleAppointments = document.querySelector('.rescheduleAppointments');
const uploadpictures = document.querySelector('.uploadpictures');
const changePassword = document.querySelector('.changePassword');
const logoutConfirmation = document.querySelector('.logoutConfirmation');
const inputs = document.querySelectorAll('.form-control');
const message = document.querySelectorAll('.message');
const notificationDisplay = document.querySelector('.notificationDisplay');


/* CANCEL FUNCTION */
    function cancel() {
        rescheduleAppointments.style.display = 'none';
        bookAppointment.style.display = 'none';
        bookSpecificDoctorAppointment.style.display = 'none';
        uploadpictures.style.display = 'none';
        changePassword.style.display = 'none';
        logoutConfirmation.style.display = 'none';
        cancelConfirmation.style.display = 'none';
        deleteConfirmation.style.display = "none";
        notificationDisplay.style.display = "none";
        opacity.style.display = 'none';

        /* Cancel button to remove both the error input border and message */
        message.forEach(function  (key) {
            key.style.display = 'none';
        });

        inputs.forEach(function (input) {
            input.classList.remove('errors');
        });

        /* Cancel button to show the contents back */
        searchResultContainer.style.display = "none";
};

// SHOW APPOINTMENT FORM FUNCTION
    function showAppointmentForm() {
        bookAppointment.style.display = 'flex';
        opacity.style.display = 'block';
    };

//UPLOAD PROFILE PICS FUNCTION
    function uploadProfilePics() {
        uploadpictures.style.display = 'flex';
        opacity.style.display = 'block';
    };

//CHANGE PASSWORD FORM DISPLAY FUNCTION
    function changePasswordForm() {
        changePassword.style.display = 'flex';
        opacity.style.display = 'block';
    };

//DELETE PATIENT FUNCTION
    function deletePatient() {
    deleteConfirmation.style.display = "flex";
    opacity.style.display = 'block';
}

const viewMore = document.querySelector('.viewMore');

viewMore.addEventListener('click', () => {
    profileContent.style.display = 'flex';
    dashboardContent.style.display = 'none';
});

        

// SHOW EACH NAV SECTION WHEN CLICKED
const dashboardContent = document.getElementById('dashboardContent');
const appointmentsContent = document.getElementById('appointmentContent');
const findDoctorContent = document.getElementById('findDoctorContent');
const healthCenterContent = document.getElementById('healthCenterContent');
const profileContent = document.getElementById('profileContent');

function dashboardNav() {
    dashboardContent.style.display = 'flex';
    appointmentsContent.style.display = 'none';
    findDoctorContent.style.display = 'none';
    healthCenterContent.style.display = 'none';
    profileContent.style.display = 'none';
};

function appointmentsNav() {
    dashboardContent.style.display = 'none';
    appointmentsContent.style.display = 'flex';
    findDoctorContent.style.display = 'none';
    healthCenterContent.style.display = 'none';
    profileContent.style.display = 'none';
};

function findDoctorNav() {
    dashboardContent.style.display = 'none';
    appointmentsContent.style.display = 'none';
    findDoctorContent.style.display = 'flex';
    healthCenterContent.style.display = 'none';
    profileContent.style.display = 'none';
};

function healthCenterNav() {
    dashboardContent.style.display = 'none';
    appointmentsContent.style.display = 'none';
    findDoctorContent.style.display = 'none';
    healthCenterContent.style.display = 'flex';
    profileContent.style.display = 'none';
};

function logout() {
    logoutConfirmation.style.display = 'flex';
    opacity.style.display = 'block';
};

function profileContentNav() {
    dashboardContent.style.display = 'none';
    appointmentsContent.style.display = 'none';
    findDoctorContent.style.display = 'none';
    healthCenterContent.style.display = 'none';
    profileContent.style.display = 'flex';
};

 

//ADD THE ACTIVE COLOR WHEN EACH NAV IS CLICKED
    const navs = document.querySelectorAll('.nav');
    navs.forEach((nav, index) => {
        nav.addEventListener('click', () => {
            navs.forEach(nav => nav.classList.remove('active'));

            navs[index].classList.add('active');
        })
    });

//NOTIFICATION FUNCTIONS FOR NOTIFICATION BELL
    const notificationBell = document.querySelector('.notificationBell');
    const notificationMsgList = document.querySelector('.notificationMsgList');
    const showNotification = document.querySelector('.showNotification');
    const notificationCount = document.getElementById('notificationCount');
    const notificationCountContainer = document.querySelector('.notificationCountContainer');
    const noNotification = document.querySelector('.noNotification');
    const notificationBtn = document.getElementById('notificationBtn');

    notificationBell.addEventListener('click', () => {
        notificationDisplay.style.display = 'flex';
        opacity.style.display = 'block';
        getNotification();
    });

    document.addEventListener('DOMContentLoaded', getNotification);  
    async function getNotification() {
        try {
            const response = await fetch('/telemedicine/api/notifications/patientNotifications', {
                method: 'GET',
        });
        
        const notifications = await response.json();
        if (response.status === 200) {
            const unreadNotificationCount = notifications.length; 

            if (unreadNotificationCount > 0 ) {
                notificationCountContainer.style.display = 'flex';
                notificationCount.textContent = unreadNotificationCount;
                noNotification.style.display = 'none';
                showNotification.style.display = 'flex';
            } else {
                notificationCountContainer.style.display = 'none';
                noNotification.style.display = 'flex';
                showNotification.style.display = 'none';
            };

            notificationMsgList.innerHTML = notifications
                .map(n => `<li data-id="${n.id}" class="${n.is_read ? 'read' : 'unread'}">${n.message}</li>`)
                .join('');            
        
        } else {
                notificationCountContainer.style.display = 'none';
                noNotification.style.display = 'flex';
                showNotification.style.display = 'none';
        }

        } catch (error) {
            console.error(error);
        }  
    };

    //MARK ALL AS READ BUTTON FUNCTION
    notificationBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/telemedicine/api/notifications/markAllAsRead', {
                method: 'PUT',
            });
            
            await response.json();

            if (response.status === 200) {
                notificationCountContainer.style.display = 'none';
                noNotification.style.display = 'flex';
                showNotification.style.display = 'none';
                notificationMsgList.innerHTML = "";
                getNotification();
            } 
        } catch (error) {
            console.error(error);
        };
    });


//CHANGE PROFILE PICTURE FUNCTIONALITY
    const fileInput = document.getElementById('file-input')
    const preview = document.getElementById('preview');
    const profilePics = document.querySelector('.profilePics');

    // Trigger file input when the circle is clicked 
        fileInput.onchange = function() {
            preview.src = URL.createObjectURL(fileInput.files[0]);
        };

    // UPLOAD PICTURE AND LOAD TO THE HEADER IMG
        const uploadDpForm = document.getElementById('uploadDpForm'); 
        uploadDpForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const fileInput = document.getElementById('file-input').files[0];

            if (!fileInput) {
                errorNotification.style.display = 'flex';
                errorFormMessage.textContent = 'Please select a file to upload';
                opacity.style.display = 'block';

                setTimeout( () => {
                    errorNotification.style.display = "none";
                }, 3000);
            }

            const formData = new FormData();
            formData.append('profile_picture', fileInput)

            try {
                const response = await fetch('/telemedicine/api/patients/uploadProfilePicture', {
                    method: 'POST',
                    body: formData,
                })

                const result = await response.json();

                if (response.status === 200) {
                    profilePics.src = result.profile_picture;

                    successNotification.style.display = "flex";
                    successFormMessage.textContent = (`${result.message}`);
                    opacity.style.display = "block";
        
                    setTimeout( () => {
                        successNotification.style.display = "none";
                        opacity.style.display = "none";
                        uploadpictures.style.display = 'none';
                    }, 3000);
                } else {
                    errorNotification.style.display = 'flex';
                    errorFormMessage.textContent = (`${result.message}`);
                    opacity.style.display = "block";
        
                    setTimeout( () => {
                        errorNotification.style.display = "none";
                    }, 3000);
                }
            } catch (error) {
                console.error(error);
            }
        });


//DROP PROFILE FUNCTION
    const profileDropdown = document.querySelector('.dropProfileDown');
    const arrowDown = document.querySelector('.arrowDown');
    arrowDown.addEventListener('click', () => {
        if (profileDropdown.style.display === 'flex') {
            profileDropdown.style.display = 'none';
            arrowDown.style.transform = 'rotate(0deg)';
        } else {
            profileDropdown.style.display = 'flex';
            arrowDown.style.transform = 'rotate(180deg)';
        }
    });

// DASHBOARD SERACH 
    const headerSearchBtn = document.querySelector('.bx-search');
    const searchResults = document.querySelector('.results');
    const searchInput = document.querySelector('#search');
    const searchResultContainer = document.querySelector('#search-result');

    headerSearchBtn.addEventListener('click', async() => {
        const searchQuery = document.getElementById('search').value.trim();

        try {
            const response = await fetch(`/telemedicine/api/patients/searchDashboard?searchQuery=${encodeURIComponent(searchQuery)}`, {
                method: 'GET',
            })
        
            const results = await response.json();
            searchResults.innerHTML = '';
        
            if (response.status === 200) {
                results.forEach(result => {
                    const searchResultDisplay = document.createElement('div');
                    searchResultDisplay.className = 'searchResultDisplay';

                    if (result.type === 'doctor') {  
                        searchResultDisplay.innerHTML += `
                            <h3>Doctor Details</h3>
                            <p><strong>Doctor:</strong> Dr. ${result.name || "N/A"}</p>
                            <p><strong>Email:</strong> ${result.detail2 || "N/A"}</p>
                            <p><strong>Phone Number:</strong> ${result.detail3 || "N/A"}</p>
                            <p><strong>Specialization:</strong> ${result.detail4 || "N/A"}</p>
                        `;
                    }

                    if (result.type === 'appointment') {
                        searchResultDisplay.innerHTML = `
                            <h3>Appointment Details</h3>  
                            <p><strong>Doctor:</strong> Dr. ${result.name || "N/A"}</p>
                            <p><strong>Appointment Date:</strong> ${new Date(result.detail2).toDateString()}</p>
                            <p><strong>Appointment Time:</strong> ${result.detail3 || "N/A"}</p>
                            <p class = "searchStatus"><strong>Status:</strong> ${result.detail4 || "N/A"}</p>
                        `
                    }    
                    searchResults.appendChild(searchResultDisplay);
            })
                const  searchStatus = document.querySelector(".searchStatus"); 

                searchStatus.style.textTransform = 'capitalize';
                searchResultContainer.style.display = 'flex';
                opacity.style.display = 'block';

                
            } else {
                errorNotification.style.display = 'flex';
                errorFormMessage.textContent = (`${results.message}`);
                opacity.style.display = 'block';

                setTimeout( () => {
                    errorNotification.style.display = 'none';
                    opacity.style.display = 'none';
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
        }   
    });

/* headerSearchBtn.addEventListener('click', () => {
    const searchInput = document.querySelector('#search').value.trim();

    if (searchInput === 'appointments') {
        appointmentsNav()
        errorNotification.style.display = 'none';
        opacity.style.display = 'none';
        errorFormMessage.textContent = (`${results.message}`);
    } else if(searchInput === 'doctors'){
        findDoctorNav()
    } else if(searchInput === 'book appointment') {
        showAppointmentForm()
    }
}) */


//GET PATIENT DETAILS
    const patientId = document.getElementById('patientId');
    const getFirstName = document.getElementById('first-name');
    const getLastName = document.getElementById('last-name');
    const getEmail = document.getElementById('email');
    const getPhoneNumber = document.getElementById('phone');
    const getDOB = document.getElementById('dob');
    const getGender = document.getElementById('gender');
    const getAddress = document.getElementById('address');
    const editFnameMsg = document.querySelector('.editFnameMsg');
    const editLnameMsg = document.querySelector('.editLnameMsg');
    const editEmailMsg = document.querySelector('.editEmailMsg');
    const editPhoneMsg = document.querySelector('.editPhoneMsg');
    const editDOBMsg = document.querySelector('.editDOBMsg');
    const editGenderMsg = document.querySelector('.editGenderMsg');
    const editAddressMessage = document.querySelector('.editAddressMessage');
    const phonePattern = /^(\+?\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{9,20}$/;
    document.addEventListener('DOMContentLoaded', async () => {
        const patientName = document.querySelectorAll('.patientName');
        const dropdownprofileName = document.querySelector('#profileName');
        async function getPatient() {
            const response = await fetch('/telemedicine/api/patients/individual', {
                method: 'GET'
            })

            const result = await response.json();
            if (response.status === 200) {     
                patientName.forEach(name => {
                    name.textContent = (`${result.first_name}`);
                });
    
                dropdownprofileName.textContent = (`${result.first_name} ${result.last_name}`);

                // Display profile picture
                profilePics.src = result.profile_picture;
                preview.src = result.profile_picture;
                
                // Populate form fields for editing
                getFirstName.value = result.first_name;
                getLastName.value = result.last_name;
                getEmail.value = result.email;
                getPhoneNumber.value = result.phone;
                getDOB.value = new Date(result.date_of_birth).toISOString().split('T')[0];
                getGender.value = result.gender;
                getAddress.value = result.address;
                patientId.value = result.id;

        } else {
                errorNotification.style.display = 'flex';
                errorFormMessage.textContent = (`${result.message}`);
                opacity.style.display = 'block';

                setTimeout( () => {
                    errorNotification.style.display = 'none';
                    opacity.style.display = 'none';
                    
                }, 3000);
            }
        };

        // UPDATE PATIENT DETAILS
        const updatePatientForm = document.querySelector('.profile-info');

        updatePatientForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const updateFirstName = getFirstName.value;
            const updateLastName = getLastName.value;
            const updateEmail = getEmail.value;
            const updatePhoneNumber = getPhoneNumber.value;
            const updateDOB = getDOB.value;
            const updateGender = getGender.value;
            const updateAddress = getAddress.value;

            let isValid = true;

            if (updateFirstName === "" ) {
                getFirstName.classList.add('errors');
                editFnameMsg.style.display = 'block';
                isValid = false;
            } else {
                getFirstName.classList.remove('errors');
                editFnameMsg.style.display = 'none';
            };

            if (updateLastName === "") {
                getLastName.classList.add('errors');
                editLnameMsg.style.display = 'block';
                isValid = false;
            } else {
                getLastName.classList.remove('errors');
                editLnameMsg.style.display = 'none';
            };

            if (updateEmail === "") {
                getEmail.classList.add('errors');
                editEmailMsg.style.display = 'block';
                isValid = false;
            } else {
                getEmail.classList.remove('errors');
                editEmailMsg.style.display = 'none';
            };

            if (updatePhoneNumber === "") {
                getPhoneNumber.classList.add('errors');
                editPhoneMsg.style.display = 'block';
                isValid = false;
            } else if (!getPhoneNumber.value.match(phonePattern)) {
                getPhoneNumber.classList.add('errors');
                editPhoneMsg.style.display = 'block';
                editPhoneMsg.textContent = 'Please enter a valid phone number';
                isValid = false;
            } else {
                getPhoneNumber.classList.remove('errors');
                editPhoneMsg.style.display = 'none';
            };

            if (updateDOB === "") {
                getDOB.classList.add('errors');
                editDOBMsg.style.display = 'block';
                isValid = false;
            } else {
                getDOB.classList.remove('errors');
                editDOBMsg.style.display = 'none';
            };

            if (updateGender === "") {
                getGender.classList.add('errors');
                editGenderMsg.style.display = 'block';
                isValid = false;
            } else {
                getGender.classList.remove('errors');
                editGenderMsg.style.display = 'none';
            };

            if (updateAddress === "") {
                getAddress.classList.add('errors');
                editAddressMessage.style.display = 'block';
                isValid = false;
            } else {
                getAddress.classList.remove('errors');
                editAddressMessage.style.display = 'none';
            };

            if (isValid) {
                try {
                    const response = await fetch(`/telemedicine/api/patients/individual/update`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json'},
                        body: JSON.stringify({ first_name: updateFirstName, last_name: updateLastName, phone: updatePhoneNumber, date_of_birth: updateDOB, gender: updateGender, address: updateAddress })
                    })

                    const result = await response.json();

                    if (response.status === 200) {
                        successNotification.style.display = 'flex';
                        successFormMessage.textContent = (`${result.message}`)
                        opacity.style.display = 'block';

                        setTimeout( () => {
                            successNotification.style.display = 'none';
                            opacity.style.display = 'none';
                            
                        }, 3000);
                    } else {
                        errorNotification.style.display = 'flex';
                        errorFormMessage.textContent = (`${result.message}`)
                        opacity.style.display = 'block';

                        setTimeout( () => {
                            errorNotification.style.display = 'none';
                            opacity.style.display = 'none';
                            
                        }, 3000);
                    }
                } catch (error) {
                    console.error('Error loading patient:', error.message);
                }
            };
        });

        //CHANGE PASSWORD FUNCTION
        const changePasswordContainer = document.querySelector('.changePassword');
        const changePasswordForm = document.getElementById('changePasswordForm');
        const currentPasswordInput = document.getElementById('currentPassword');
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const currentPasswordMsg = document.querySelector('.currentPasswordMsg');
        const newPasswordMsg = document.querySelector('.newPasswordMsg');
        const confirmPasswordMsg = document.querySelector('.confirmPasswordMsg');

        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const currentPassword = currentPasswordInput.value;
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const id = patientId.value;
            console.log(id);

            let isValid = true;

            if (currentPassword === "") {
                currentPasswordInput.classList.add('errors');
                currentPasswordMsg.style.display = 'block';
                isValid = false;
            } else {
                currentPasswordInput.classList.remove('errors');
                currentPasswordMsg.style.display = 'none';
            };

            if (newPassword === "") {
                newPasswordInput.classList.add('errors');
                newPasswordMsg.style.display = 'block';
                isValid = false;
            } else if (newPassword.length < 8) {
                newPasswordInput.classList.add('errors');
                newPasswordMsg.style.display = 'block';
                newPasswordMsg.textContent = 'Password must be at least 8 characters long';
                isValid = false;
            } else {
                newPasswordInput.classList.remove('errors');
                newPasswordMsg.style.display = 'none';
            };

            if (confirmPassword === "") {
                confirmPasswordInput.classList.add('errors');
                confirmPasswordMsg.style.display = 'block';
                isValid = false;
            } else if(newPassword !== confirmPassword) {
                confirmPasswordInput.classList.add('errors');
                confirmPasswordMsg.style.display = 'block';
                confirmPasswordMsg.textContent = 'Passwords do not match';
                isValid = false;
            } else {
                confirmPasswordInput.classList.remove('errors');
                confirmPasswordMsg.style.display = 'none';
            };

            if (isValid) {
                try {
                    const response = await fetch('/telemedicine/api/patients/individual/changePassword', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json'},
                        body: JSON.stringify({ currentPassword: currentPassword, newPassword: newPassword})
                    })

                    const result = await response.json();

                    if (response.status === 200) {
                        successNotification.style.display = "flex"
                        successFormMessage.textContent = (`${result.message}`);
                        opacity.style.display = 'block';
                        changePasswordForm.reset();

                        setTimeout( () => {
                            successNotification.style.display = 'none';
                            opacity.style.display = 'none';
                            changePasswordContainer.style.display = "none";
                        }, 3000);

                    } else {
                        errorNotification.style.display = "flex"
                        errorFormMessage.textContent = (`${result.message}`);
                        opacity.style.display = 'block';

                        setTimeout( () => {
                            errorNotification.style.display = 'none';
                        }, 3000);
                    }
                    
                } catch (error) {
                    console.error('Error loading patient:', error.message);
                }
                
            }
        })

        getPatient();
    });

//REAL FEEDBACK
    getPhoneNumber.addEventListener('input', () => {
        if (!getPhoneNumber.value.match(phonePattern)) {
            getPhoneNumber.classList.add('errors');
            editPhoneMsg.style.display = 'block';
            editPhoneMsg.textContent = 'Please enter a valid phone number';
            
        } else {
            getPhoneNumber.classList.remove('errors');
            editPhoneMsg.style.display = 'none';
            editPhoneMsg.textContent= '';
        }
    });


// VALIDATE INPUT FIELDS
    /* NOTIFICATION VARIABLES */
    const successNotification = document.getElementById('successNotification');
    const errorNotification = document.getElementById('errorNotification');
    const successFormMessage = document.querySelector('.successFormMessage');
    const errorFormMessage = document.querySelector('.errorFormMessage');
        /* BOOK APPOINTMENT FORM VALIDATION */
    const bookAppointmentForm = document.getElementById('bookAppointmentForm');
    const bookAppointmentDocInput = document.getElementById('doctorName');
    const bookAppointmentDateInput = document.getElementById('appointmentDate');
    const bookAppointmentTimeInput = document.getElementById('appointmentTime');
    const appointmentDoctorMsg = document.querySelector('.message');
    const appointmentDateMsg = document.querySelector('.appointmentDateMsg');
    const appointmentTimeMsg = document.querySelector('.appointmentTimeMsg');

    bookAppointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        bookAppointmentBtn
        bookAppointmentForm.reset();
    });
    async function bookAppointmentBtn() {
        const doctorName = document.getElementById('doctorName').value.trim();
        const bookAppointmentDate = document.getElementById('appointmentDate').value.trim();
        const bookAppointmentTime = document.getElementById('appointmentTime').value.trim();
        const status = document.getElementById('status').value.trim();

        let isValid = true;

        if (doctorName === '') {
            bookAppointmentDocInput.classList.add('errors');
            appointmentDoctorMsg.style.display = 'block';
            isValid = false;
        
        } else {
            bookAppointmentDocInput.classList.remove('errors');
            appointmentDoctorMsg.style.display = 'none';
        };

        if (bookAppointmentDate === '') {
            bookAppointmentDateInput.classList.add('errors');
            appointmentDateMsg.style.display = 'block';
            isValid = false;
        
        } else {
            bookAppointmentDateInput.classList.remove('errors');
            appointmentDateMsg.style.display = 'none';
        };

        if (bookAppointmentTime === '') {
            bookAppointmentTimeInput.classList.add('errors');
            appointmentTimeMsg.style.display = 'block';
            isValid = false;
        
        } else {
            bookAppointmentTimeInput.classList.remove('errors');
            appointmentTimeMsg.style.display = 'none';
        };

        if (isValid) {
            const response = await fetch('/telemedicine/api/appointments/bookAppointment', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ doctor_id: doctorName, appointment_date: bookAppointmentDate, appointment_time: bookAppointmentTime, status})
                })
        
                const result = await response.json();
        
                if (response.status === 200) {
                    successNotification.style.display = 'flex';
                    successFormMessage.textContent = (`${result.message}`);
                    opacity.style.display = "block";
                    fetchAppointment();

                    setTimeout( () => {
                        successNotification.style.display = 'none';
                        bookAppointment.style.display= "none";
                        opacity.style.display = "none";
                    }, 3000);

                } else {
                    errorNotification.style.display = 'flex';
                    errorFormMessage.textContent = (`${result.message}`);

                    setTimeout( () => {
                        errorNotification.style.display = 'none';
                        opacity.style.display = "none";
                    }, 3000);
                }
        }
    };

//LOAD DOCTORS TO THE SELECT ELEMENT
document.addEventListener('DOMContentLoaded', async () => {  
    async function getDoctor() {
        const doctorInput = document.getElementById('doctorName');
        try {
            const response = await fetch('/telemedicine/api/doctors/allDoctors', {
                method: "GET"
            });

            const doctors = await response.json();

            if (response.status ===  200) {
                doctors.forEach(doctor => {
                    const option = document.createElement('option');
                    option.value = doctor.id;
                    option.textContent = `${doctor.first_name} ${doctor.last_name}`;

                    doctorInput.appendChild(option);
                })
            } else {
                errorNotification.style.display = 'flex';
                errorFormMessage.textContent = (`${doctors.message}`);
                opacity.style.display = 'block';

                setTimeout( () => {
                    errorNotification.style.display = 'none';
                    opacity.style.display = 'none';
                }, 3000);
            }
    
            
        } catch (error) {
            console.error('Error loading doctors:', error.message);
        }
    };

    getDoctor();
});



//SHOW APPOINTMENT HISTORY
const showDoctorName = document.querySelector('.historyAppointmentDoctorName');
const showAppointmentDate = document.querySelector('.historyAppointmentDate');
const showAppointmentTime = document.querySelector('.historyAppointmentTime');
const showStatus = document.querySelector('.historyStatus');
const noAppointment = document.querySelector('.noAppointment');
const profileNoAppointment = document.querySelector('.profileNoAppointment');
const appointmentHistoryShow = document.querySelector('.appointmentHistoryShow');
const profileAppointmentHistoryShow = document.querySelector('.profileAppointmentHistoryShow');

document.addEventListener('DOMContentLoaded', async () => {
    fetchAppointmentHistory();
});

async function fetchAppointmentHistory() {
    try {
        const response = await fetch('/telemedicine/api/appointments/appointmentHistory/patient', {
            method: 'GET',
        });
    
        const appointments = await response.json();
        
        const profileAppointmentDetails = document.querySelector('.profileAppointmentDetails');
        
        profileAppointmentDetails.innerHTML ='';
    
        if (response.status === 200 && appointments.length > 0) {
            appointmentHistoryShow.style.display = 'flex';
            noAppointment.style.display = 'none';
            profileAppointmentHistoryShow.style.display = 'flex';
            profileNoAppointment.style.display = 'none';
    
            appointments.forEach(appoint => {
                /* PROFILE APPOINTMENT HISTORY */
                const tr = document.createElement('tr');
    
                tr.innerHTML = `
                    <td>${appointments.indexOf(appoint) + 1}</td>
                    <td>${appoint.first_name} ${appoint.last_name}</td>
                    <td>${new Date(appoint.appointment_date).toDateString()}</td>
                    <td>${appoint.appointment_time}</td>
                    <td class="profileStatus">${appoint.status}</td>
                    <td><button type="button" class="deleteBtn" data-appointment-id ="${appoint.id}">Delete</button></td>`;
                    
                    profileAppointmentDetails.appendChild(tr);
    
                    const profileStatus = document.querySelectorAll('.profileStatus');
                    
                    profileStatus.forEach((status) => {
                        status.style.textTransform = 'capitalize';
                        if (status.textContent === 'completed') {
                            status.style.color = 'green';
                        } else {
                            status.style.color ='red';
                        }
                    })
            });
    
    
            /* DASHBOARD APPOINTMENT HISTORY */
            appointments.forEach((appointment) => {
                
                showDoctorName.textContent = ` ${appointment.first_name} ${appointment.last_name}`;
                showAppointmentDate.textContent = `${new Date(appointment.appointment_date).toDateString()}`;
                showAppointmentTime.textContent =   `${(appointment.appointment_time)}`;
                showStatus.textContent = appointment.status;
                showStatus.style.textTransform = 'capitalize';
        
                if (appointment.status === 'completed') {
                    showStatus.style.color = 'green';
                    
                } else {
                    showStatus.style.color = 'red';
                }  
            });
    
            // Add event listeners for cancel buttons
            const deleteBtn = document.querySelectorAll('.deleteBtn');
            const deleteMsg = document.querySelector('.deleteMsg');
            deleteBtn.forEach(btn => {
                btn.addEventListener('click',  (event) => {
                    const appointmentId = event.target.dataset.appointmentId;

                    cancelConfirmation.style.display="flex";
                    deleteMsg.textContent = "Are you sure you want to delete this appointment?"
                    opacity.style.display="block";
                    cancelAppointmentBtn.forEach(deleteBtn => {
                        deleteBtn.addEventListener('click',  () => {
                            deleteAppointment(appointmentId);
                            cancelConfirmation.style.display="none";
                            opacity.style.display="none";
                        });
                    })
                   
                });
            });
    
        } else {
            noAppointment.style.display = 'block';
            noAppointment.textContent = (`${appointments.message}`);
            appointmentHistoryShow.style.display = 'none';
    
            profileNoAppointment.style.display = 'block';
            profileNoAppointment.textContent = (`${appointments.message}`);
            profileAppointmentHistoryShow.style.display = 'none';
        }
    } catch (error) {
        console.error('Error cancelling appointment:', error);
    }
}


async function deleteAppointment(appointmentId) {
    try {
        const response = await fetch(`/telemedicine/api/appointments/deleteAppointment/${appointmentId}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (response.status === 200) {
            successNotification.style.display = 'flex';
                successFormMessage.textContent = (`${result.message}`);
                opacity.style.display = 'block';
                fetchAppointmentHistory();

                setTimeout( () => {
                    successNotification.style.display = 'none';
                    opacity.style.display = 'none';
                }, 3000);
        } else {
            errorNotification.style.display = 'flex';
            errorFormMessage.textContent = (`${result.message}`);
            opacity.style.display = 'block';

            setTimeout( () => {
                errorNotification.style.display = 'none';    
                opacity.style.display = 'none';   
            }, 3000);
        }
    } catch (error) {
        console.error( 'Error deleting appointment:', error);
    }
};

//UPCOMING APPOINTMENTS
const noUpcomingAppointment = document.querySelector('.noUpcomingAppointment');
const UpcomingAppointmentContainer = document.querySelector('.upcomingAppointment');
const showUpcomingAppointment = document.querySelector('.showUpcomingAppointment')
const cancelConfirmation = document.querySelector('.cancelConfirmation');




/* VARIABLES TO POPULATE APPOINTMENTS FOR RESCHEDULE */
    const rescheduleDoctorName = document.getElementById('rescheduleDoctorName');
    const rescheduleApointmentDate = document.getElementById('rescheduleApointmentDate');
    const rescheduleAppoitmentTime = document.getElementById('rescheduleAppoitmentTime');
    const appointmentIdInput = document.getElementById('appointmentId');
    const rescheduleDateMsg = document.querySelector('.rescheduleDateMsg');
    const rescheduleTimeMsg = document.querySelector('.rescheduleTimeMsg');
    const rescheduleAppointmentForm = document.getElementById('rescheduleAppointmentForm');
    const cancelAppointmentBtn = document.querySelectorAll('.cancelAppointmentBtn');

document.addEventListener('DOMContentLoaded', async ( ) => {
        //SUBMIT RESCHHEDULE FORM
    rescheduleAppointmentForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const appointmentId = appointmentIdInput.value
            const appointmentDate = rescheduleApointmentDate.value;
            const appointmentTime = rescheduleAppoitmentTime.value;

            let isValid = true;

            if(rescheduleApointmentDate.value === "") {
                rescheduleApointmentDate.classList.add('errors');
                rescheduleDateMsg.style.display = 'block';
                isValid = false;
            } else {
                rescheduleApointmentDate.classList.remove('errors');
                rescheduleDateMsg.style.display = 'none';
            }
        
            if (rescheduleAppoitmentTime.value === "") {
                rescheduleAppoitmentTime.classList.add('errors');
                rescheduleTimeMsg.style.display = 'block';
                isValid = false;
            } else {
                rescheduleAppoitmentTime.classList.remove('errors');
                rescheduleTimeMsg.style.display = 'none';
            }

            if (isValid) {
                try {
                    const response = await fetch(`/telemedicine/api/appointments/rescheduleAppointment/patient`, {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'}, 
                        body: JSON.stringify({ 
                            appointmentId : appointmentId,
                            appointmentDate: appointmentDate, 
                            appointmentTime: appointmentTime })
                    });

                    const result = await response.json();

                    if (response.status === 200) {
                        successNotification.style.display = 'flex';
                        successFormMessage.textContent = (`${result.message}`);
                        rescheduleAppointmentForm.reset();
                        rescheduleAppointments.style.display = 'none';
                        fetchAppointment();
                        

                        setTimeout( () => {
                            successNotification.style.display = 'none';
                            opacity.style.display = 'none'; 
                        }, 3000)
                        
                    } else {
                        errorNotification.style.display = 'flex';
                        errorFormMessage.textContent = (`${result.message}`);
                        opacity.style.display = 'block';
        
                        setTimeout( () => {
                            errorNotification.style.display = 'none';       
                        }, 3000);
                    }
                } catch (error) {
                    console.error('Error rescheduling appointment:', error);
                }
            }

            
        });

    fetchAppointment();
});

//FETCH UPCOMING APPOINTMENT
    async function fetchAppointment()  {
        try {
            const response = await fetch(`/telemedicine/api/appointments/upcomingAppointment/patient`, {
                method: 'GET',
            });

            const upcomingAppointments = await response.json();
            showUpcomingAppointment.innerHTML = "";


            if (response.status === 200) {
                noUpcomingAppointment.style.display ='none';
                UpcomingAppointmentContainer.style.display ='flex';
                
                upcomingAppointments.forEach((appointment) => {
                    const tr = document.createElement('tr');

                    tr.innerHTML = `
                        <td>${appointment.doctorName} </td>
                        <td>${new Date(appointment.appointmentDate).toDateString()}</td>
                        <td>${appointment.appointmentTime}</td>
                        <td> 
                            <button type="button" class="actionButton rescheduleButton" data-appointment-id="${appointment.appointmentId}">Reschedule</button>
                        
                            <button type="button" class="actionButton cancelButton" data-appointment-id="${appointment.appointmentId}">Cancel</button>
                        </td>
                    `;

                    showUpcomingAppointment.appendChild(tr);
                });

            // Add event listeners for reschedule buttons
                const rescheduleBtns = document.querySelectorAll('.rescheduleButton');
                rescheduleBtns.forEach(btn => {
                    btn.addEventListener('click',  (event) => {
                        const appointmentId = event.target.dataset.appointmentId;
                        openRescheduleForm(appointmentId);
                    });
                });

                // Add event listeners for cancel buttons
                const cancelBtns = document.querySelectorAll('.cancelButton');
                cancelBtns.forEach(btn => {
                    btn.addEventListener('click',  (event) => {
                        const appointmentId = event.target.dataset.
                        appointmentId;
                        cancelConfirmation.style.display="flex";
                        opacity.style.display="block";
                        cancelAppointmentBtn.forEach(cancelBtn => {
                            cancelBtn.addEventListener('click',  () => {
                                cancelAppointment(appointmentId);
                                cancelConfirmation.style.display="none";
                                opacity.style.display="none";
                                fetchAppointment();
                            });
                        })
                    
                    });
                });

            } else {
                noUpcomingAppointment.style.display = 'block';
                noUpcomingAppointment.textContent = (`${upcomingAppointments.message}`);
                UpcomingAppointmentContainer.style.display ='none';
                showUpcomingAppointment.style.display = 'none';  
            }
        } catch (error) {
            console.error('Error fetching appointment details:', error);
            errorNotification.style.display = 'flex';
            errorFormMessage.textContent = 'An error occurred while fetching appointment details';
            opacity.style.display = 'block';

            setTimeout( () => {
                errorNotification.style.display = 'none';
                opacity.style.display = 'none';
            }, 3000);
        }
    }

//OPEN RESCHHEDULE FORM
    async function openRescheduleForm(appointmentId){
        try {
            const response = await fetch(`/telemedicine/api/appointments/rescheduleAppointment/patient/${appointmentId}`, {
                method: 'GET',
            });

            const appointment = await response.json();

            if (response.status === 200) {
                appointmentIdInput.value = appointment.appointment_id;
                rescheduleDoctorName.value = appointment.doctorName;
                rescheduleAppointments.style.display = 'flex';
                opacity.style.display = 'block';

            } else {
                errorNotification.style.display = 'flex';
                errorFormMessage.textContent = (`${appointment.message}`);
                opacity.style.display = 'block';

                setTimeout( () => {
                    errorNotification.style.display = 'none';
                    opacity.style.display = 'none';
                }, 3000);
            }
        } catch (error) {
            console.error('Error fetching appointment details:', error);
        }
    }

//CANCEL APPOINTMENT
    async function cancelAppointment(appointmentId) {
        try {
            const response = await fetch(`/telemedicine/api/appointments/cancelAppointment/${appointmentId}`, {
                method: 'PUT',
            });
        
            const result = await response.json();

            if (response.status === 200) {
                successNotification.style.display = 'flex';
                successFormMessage.textContent = (`${result.message}`);
                opacity.style.display = 'block';
                fetchAppointment();
                fetchAppointmentHistory();

                setTimeout( () => {
                    successNotification.style.display = 'none';
                    opacity.style.display = 'none';
                }, 3000);
            } else {
                errorNotification.style.display = 'flex';
                errorFormMessage.textContent = (`${result.message}`);
                opacity.style.display = 'block';

                setTimeout( () => {
                    errorNotification.style.display = 'none';
                    opacity.style.display = 'none';
                }, 3000);
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
        }
    }


//AVAILABLE DOCTORS 
    const bookSpecificDocAppointmentForm = document.getElementById('bookSpecificDocAppointmentForm');
    const availableDoctorsContainer = document.querySelector('.availableDoctors');
    const showAvailableDoctors = document.querySelector('.showAvailableDoctors');
    const doctorPics = document.querySelectorAll('.doctorPics');
    const specificDoctorName  = document.getElementById('specificDoctorName');
    const specificAppointmentDate  = document.getElementById('specificAppointmentDate');
    const specificAppoitmentTime  = document.getElementById('specificAppoitmentTime');
    const specificDocId  = document.getElementById('specificDocId');
    const specificDateMsg = document.querySelector('.specificDateMsg');
    const specificTimeMsg = document.querySelector('.specificTimeMsg');

    const searchDoctorForm = document.querySelector('.searchDoctorForm');
    const searchDoctorInput = document.getElementById('searchDoctorInput');
    const searchAllDoctor = document.querySelector('.searchDoctor');
    const showSearchDoctor = document.querySelector('.showSearchDoctor');

    document.addEventListener('DOMContentLoaded', async () => {
        async function fetchAvailableDoctor() {
            try {
                const response = await fetch('/telemedicine/api/doctors/getAvailableDoctors', {
                    method: 'GET',
                })
        
                const result = await response.json();
                showAvailableDoctors.innerHTML = "";
        
                if (response.status === 200) {
                    result.forEach(availableDoctor => {
                        const showDoctor = document.createElement('div');
                        showDoctor.className = 'showDoctorProfile';
                        showDoctor.innerHTML = `
                            <div class="doctorProfile">
                                <div class="doctorPics"></div>
                                <p><strong> Dr. ${availableDoctor.first_name} ${availableDoctor.last_name} </strong> - ${availableDoctor.specialization}</p>
                            </div>
        
                            <p>${availableDoctor.schedule}</p>

                            <button type="button" class="bookDoctorAppointment" data-doctor-id="${availableDoctor.id}">Book Appointment</button> 
                        `;
                        showAvailableDoctors.appendChild(showDoctor);
                    });

                    const showDoctorAppointment = document.querySelectorAll('.bookDoctorAppointment');
                    showDoctorAppointment.forEach(btn => {
                    btn.addEventListener('click', (event) => {
                            const doctorId = event.target.dataset.doctorId;
                            openSpecificDoctorForm(doctorId);
                        })
                    });
                    
                } else {
                    errorNotification.style.display = 'flex';
                    errorFormMessage.textContent = (`${result.message}`);
                    opacity.style.display = 'block';

                    setTimeout( () => {
                        errorNotification.style.display = 'none';
                        opacity.style.display = 'none';
                    }, 3000);
                }
                
            } catch (error) {
                console.error('Error fetching available doctors:', error);
            }
        };

        async function openSpecificDoctorForm(doctorId) {
                try {
                    const response = await fetch(`/telemedicine/api/doctors/populateSpecificDoctor/${doctorId}`,{
                        method: 'GET',
                    })

                    const result = await response.json();

                    if (response.status === 200) {
                        specificDocId.value = result.id;
                        specificDoctorName.value = `${result.first_name} ${result.last_name}`;
                        bookSpecificDoctorAppointment.style.display = 'flex';
                        opacity.style.display = "block"

                    } else {
                        errorNotification.style.display = 'flex';
                            errorFormMessage.textContent = (`${result.message}`);
                            opacity.style.display = 'block';

                            setTimeout( () => {
                                errorNotification.style.display = 'none';
                                opacity.style.display = 'none';
                            }, 3000);
                    }
                } catch (error) {
                    console.error('Error fetching appointment details:', error);
                }
        };


        async function getAllDoctors() {
            const showAllDoctors = document.querySelector('.showAllDoctors');

            try {
                const response = await fetch('/telemedicine/api/doctors/allDoctors', {
                    method: "GET"
                });

                const doctors = await response.json();
                showAllDoctors.innerHTML = "";

                if (response.status === 200) {
                    doctors.forEach(doctor => {
                        const showAllDoctor = document.createElement('div');
                        showAllDoctor.className = 'showAllDoctorProfile';
                        showAllDoctor.innerHTML = `
                            <div class="allDoctorProfile">
                                <div class="allDoctorPics"></div>
                                <p><strong> Dr. ${doctor.first_name} ${doctor.last_name} </strong> - ${doctor.specialization}</p>
                            </div>
        
                            <p>${doctor.schedule}</p>

                            <button type="button" class="bookDoctorAppointment" data-doctor-id="${doctor.id}">Book Appointment</button> 

                        `;
                        showAllDoctors.appendChild(showAllDoctor);
                    })

                    const showDoctorAppointment = document.querySelectorAll('.bookDoctorAppointment');
                    showDoctorAppointment.forEach(btn => {
                    btn.addEventListener('click', (event) => {
                            const doctorId = event.target.dataset.doctorId;
                            openSpecificDoctorForm(doctorId);
                        })
                    });
                } else {
                    errorNotification.style.display = 'flex';
                    errorFormMessage.textContent = (`${doctors.message}`);
                    opacity.style.display = 'block';

                    setTimeout( () => {
                        errorNotification.style.display = 'none';
                        opacity.style.display = 'none';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        }

        bookSpecificDocAppointmentForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const doctorId = specificDocId.value;
                const status = document.getElementById('specificStatus').value;
                const appointmentDate = specificAppointmentDate.value;
                const appointmentTime = specificAppoitmentTime.value;

                let isValid = true;

                if (appointmentDate=== "") {
                    specificAppointmentDate.classList.add('errors');
                    specificDateMsg.style.display = 'block';
                    isValid = false;
                } else {
                    specificAppointmentDate.classList.remove('errors');
                    specificDateMsg.style.display = 'none';
                }

                if (appointmentTime === "") {
                    specificAppoitmentTime.classList.add('errors');
                    specificTimeMsg.style.display = 'block';
                    isValid = false;
                } else {
                    specificAppoitmentTime.classList.remove('errors');
                    specificTimeMsg.style.display = 'none';
                }

                if (isValid) {
                    try {
                        const response = await fetch('/telemedicine/api/appointments/bookAppointment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                doctor_id: doctorId,
                                status: status,
                                appointment_date: appointmentDate,
                                appointment_time: appointmentTime
                            })
                        });

                        const result = await response.json();
                        if (response.status === 200) {
                            successNotification.style.display = 'flex';
                            successFormMessage.textContent = (`${result.message}`);
                            opacity.style.display = 'block';
                            bookSpecificDocAppointmentForm.reset();
                            bookSpecificDoctorAppointment.style.display = 'none';
                            fetchAppointment();
                            getAllDoctors();

                            setTimeout( () => {
                                successNotification.style.display = 'none';
                                opacity.style.display = 'none';
                            }, 3000);
                        } else {
                            errorNotification.style.display = 'flex';
                            errorFormMessage.textContent = (`${result.message}`);
                            opacity.style.display = 'block';

                            setTimeout( () => {
                                errorNotification.style.display = 'none';
                            }, 3000);
                        }
                    } catch (error) {
                        console.error('Error rescheduling appointment:', error);
                    }
                }
        });

        //SEARCH FOR DOCTOR FUNCTION
        searchDoctorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
    
            const searchDoctorValue = searchDoctorInput.value;

            try {
                const response = await fetch(`/telemedicine/api/doctors/searchDoctor?searchDoctor=${encodeURIComponent(searchDoctorValue)}`, {
                    method: 'GET',
                });
        
                const result = await response.json();
                showSearchDoctor.innerHTML = "";
        
                if (response.status === 200) {
                    result.forEach(doctorSearch => {
                        const searchDoctorDisplay = document.createElement('div');
                        searchDoctorDisplay.className= 'searchDoctorsDisplay';
                        searchDoctorDisplay.innerHTML = `
                        <div class="doctorProfile">
                            <div class="doctorPics"></div>
                            <p><strong> Dr. ${doctorSearch.first_name} ${doctorSearch.last_name} </strong> - ${doctorSearch.specialization}</p>
                        </div>
                
                        <p>${doctorSearch.schedule}</p>
        
                        <button type="button" class="bookDoctorAppointment" data-doctor-id="${doctorSearch.id}">Book Appointment</button> 
                    `;
        
                    searchAllDoctor.style.display = 'flex';
                    showSearchDoctor.appendChild(searchDoctorDisplay);
                    });    
                    
                     //OPEN SPECIFIC DOCTOR FORM
                    const bookDoctorAppointmentBtn = document.querySelectorAll('.bookDoctorAppointment');
                    
                    bookDoctorAppointmentBtn.forEach(doctor => {
                        doctor.addEventListener('click', (event) => {
                            const doctorId = event.target.dataset.doctorId;
                            openSpecificDoctorForm(doctorId);
                        })
                    });
                } else {
                    errorNotification.style.display = 'flex';
                    errorFormMessage.textContent = (`${result.message}`);
                    opacity.style.display = 'block';
                    searchAllDoctor.style.display = 'none';
        
                    setTimeout( () => {
                        errorNotification.style.display = 'none';
                        opacity.style.display = 'none';
                    }, 3000);
                }
            } catch (error) {
                console.error('An error occured while searching for doctor:', error);
            }
        });

        //REMOVE THE SEARCH RESULT IF THE INPUT VALUE IS CLEARED
        searchDoctorInput.addEventListener('input', () => {
            if (!searchDoctorInput.value ) {
                showSearchDoctor.innerHTML = "";
                searchAllDoctor.style.display = 'none';
            }
        });


        fetchAvailableDoctor();
        getAllDoctors();
    });

    const mapMsg = document.querySelector('.mapMsg');
  /*   let map; */
    
    //MAP INTEGRATION USING LEAFLET
/*    document.addEventListener("DOMContentLoaded", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
              
                    // Initialize Leaflet Map
                    const map = L.map("map").setView([latitude, longitude], 13);
      
              // Add OpenStreetMap tiles
                    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                        attribution: "&copy; OpenStreetMap Contributors",
                    }).addTo(map);
            
                    // Add Marker for User's Location
                    L.marker([latitude, longitude])
                        .addTo(map)
                        .bindPopup("You are here!")
                        .openPopup();
                        
                        mapMsg.style.display = 'none';
                        map.locate({ setView: true, maxZoom: 16 });
                        map.on('locationfound', (e) => {
                        map.flyTo([e.latlng.lat, e.latlng.lng], 16);
                        L.marker(e.latlng).addTo(map).bindPopup("Your current location").openPopup();
                        });
                        map.on('locationerror', (e) => {
                        mapMsg.textContent = "Location access denied.";
                        alert("Location access denied.");
                        });  
                },
                (error) => {
                    console.error("Error getting location:", error);
                    mapMsg.textContent = "Please allow location access for the map to work.";
                    alert("Please allow location access for the map to work.");
                },
                { enableHighAccuracy: true }
            );
        } else {
            mapMsg.textContent = "Geolocation is not supported by your browser or this feature is not available.";
            alert("Geolocation is not supported by your browser.");
        }
      }); */
      
    //MAP INTEGRATION USING GOOGLE MAP
   /*  document.addEventListener("DOMContentLoaded", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const myLatlng = new google.maps.LatLng(latitude, longitude);
                    const mapOptions = {
                        zoom: 13,
                        center: myLatlng,
                    };
                    const map = new google.maps.Map(document.getElementById("map"), mapOptions);
                    const marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        title: "You are here!",
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                },
                { enableHighAccuracy: true }
            );
        } else {
            console.error("Geolocation is not supported by your browser.");
        }
    }); */

    document.addEventListener("DOMContentLoaded", () => {
        initDashhboardMap();
        initHospitalMap();
    });
    function initDashhboardMap() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    // Save in sessionStorage for quick access
                    sessionStorage.setItem("latitude", userLocation.lat);
                    sessionStorage.setItem("longitude", userLocation.lng);

                    // Display map
                    const map = new google.maps.Map(document.getElementById("map"), {
                        zoom: 13,
                        center: userLocation
                    });

                    // Add marker
                    new google.maps.Marker({
                        position: userLocation,
                        map: map,
                        title: "Your current location",
                        animation: google.maps.Animation.BOUNCE,
                    });

                },
                (error) => {
                    console.error("Error getting location:", error);
                    mapMsg.textContent = "Please allow location access for the map to work.";
                    alert("Location access denied or unavailable.");
                },
                { enableHighAccuracy: true }
            );
        } else {
            mapMsg.textContent = "Geolocation is not supported by your browser or this feature is not available.";
            alert("Geolocation is not supported by this browser.");
        }
    };

    let map, service,  hospitalLocation
    function initHospitalMap() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    hospitalLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    // Display map
                    map = new google.maps.Map(document.getElementById("locationMap"), {
                        zoom: 13,
                        center: hospitalLocation
                    });
                    // Add marker
                    new google.maps.Marker({
                        position: hospitalLocation,
                        map: map,
                        title: "Your current location",
                        animation: google.maps.Animation.BOUNCE,
                    });

                    service = new google.maps.places.PlacesService(map);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    mapMsg.textContent = "Please allow location access for the map to work.";
                    alert("Location access denied or unavailable.");
                },
                { enableHighAccuracy: true }
            )
        }
    };

        
    //FUNCTION TO SEARCH HOSPITAL BY INPUT
    function searchHospital() {
        const findMyLocation = document.getElementById('locationInput').value;

        let request = {
            query: findMyLocation + " hospital",
            fields: ["name", "formatted_address", "geometry"],
        };

        service.findPlaceFromQuery(request, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                locationMap = new google.maps.Map(document.getElementById('locationMap'), {
                    center: results[0].geometry.location,
                    zoom: 18
                });

                const allHospitalLists = document.querySelector('.allHospitalLists');
                const hospitalList = document.getElementById("hospitalList");
                hospitalList.innerHTML = "";

            
                const place = results[0];
                const li = document.createElement("li");
                    li.innerHTML = `<strong>${place.name}</strong> - 📍 ${place.formatted_address}`;
                    hospitalList.appendChild(li);
                    allHospitalLists.style.display = 'block';
                locationMap.setCenter(place.geometry.location);

                new google.maps.Marker({
                    position: place.geometry.location,
                    map: locationMap,
                    title: place.name,
                    animation: google.maps.Animation.BOUNCE
                });
            } else {
                alert("Hospital not found.");
            }
        });
    };

    //SEARCH NEARBY HOSPITAL BUTTON
    function findNearbyHospitals() {
        const request = {
            location: hospitalLocation,
            radius: 7000,
            type: "hospital"
        };

        if (!service) {
            service = new google.maps.places.PlacesService(map);
        }

        service.nearbySearch(request, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                const allHospitalLists = document.querySelector('.allHospitalLists');
                const hospitalList = document.getElementById("hospitalList");
                hospitalList.innerHTML = "";

                results.forEach(place => {
                    const li = document.createElement("li");
                    li.innerHTML = `<strong>${place.name}</strong> - 📍 ${place.vicinity}`;
                    hospitalList.appendChild(li);
                    allHospitalLists.style.display = 'block';
                    
                    new google.maps.Marker({
                        position: place.geometry.location,
                        map: map,
                        title: place.name
                    });
                });
            } else {
                alert("No nearby hospitals found.");
            }
        });
    };


      

//LOGOUT FUNCTION
    function logOut() { logOutPatient() }
    async function logOutPatient() {
        const response = await fetch('/telemedicine/api/patients/logout', {
            method: 'GET'
        })

        const result = await response.json();
        if (response.status === 200) {
            successNotification.style.display = 'flex';
            successFormMessage.textContent = (`${result.message}`);
            logoutConfirmation.style.display = 'none';
            opacity.style.display = "block";

            setTimeout( () => {
                successNotification.style.display = 'none';
                opacity.style.display = "none";
                window.location.href = '../html/login.html';
            }, 3000);
        
        } else {
            errorNotification.style.display = 'flex';
            errorFormMessage.textContent = (`${result.message}`);
            opacity.style.display = "block";

            setTimeout( () => {
                errorNotification.style.display = 'none';
                opacity.style.display = "none";
            }, 3000);
        }
    };

//DELETE ACCOUNT FUNCTION
    const deleteConfirmation = document.querySelector('.deleteAccountConfirmation'); 
        async function deletePatientAccounts() {
            deleteConfirmation.style.display = 'none';

            try {
                const response = await fetch('/telemedicine/api/patients/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
        
                const result = await response.json();
        
                if (response.status === 200) {
                    successNotification.style.display = "flex";
                    successFormMessage.textContent = (`${result.message}`);
                    opacity.style.display = "block";
        
                    setTimeout( () => {
                        successNotification.style.display = "none";
                        opacity.style.display = "none";
                        window.location.href = '../index.html';
                    }, 3000);
                } else {
                    errorNotification.style.display = "flex";
                    errorFormMessage.textContent = (`${result.message}`);
                    opacity.style.display = "block";
        
                    setTimeout( () => {
                        errorNotification.style.display = "none";
                        opacity.style.display = "none";
                    }, 3000);
                }
            } catch (error) {
                console.error('An error occurred while deleting account:', error);
        } 
            
    };
