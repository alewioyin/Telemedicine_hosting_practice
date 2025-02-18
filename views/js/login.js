// ADMIN, DOCTOR AND PATIENT REGISTRATION FORM SWITCHING
const patientForm = document.getElementById('patientForm');
const doctorForm = document.getElementById('doctorForm');
const adminForm = document.getElementById('adminForm');
const patientRoleBtn = document.getElementById('patientRoleBtn');
const doctorRoleBtn = document.getElementById('doctorRoleBtn');
const adminRoleBtn = document.getElementById('adminRoleBtn');


patientRoleBtn.addEventListener( 'click', (e) => {
    e.preventDefault();
    
    patientForm.style.display = 'block'; 
    doctorForm.style.display = 'none';
    adminForm.style.display = 'none';
});
doctorRoleBtn.addEventListener( 'click', (e) => {
    e.preventDefault();
   
    patientForm.style.display = 'none'; 
    doctorForm.style.display = 'block';
    adminForm.style.display = 'none';
});
adminRoleBtn.addEventListener( 'click', (e) => {
    e.preventDefault();
    
    patientForm.style.display = 'none'; 
    doctorForm.style.display = 'none';
    adminForm.style.display = 'block';
});


//SELECTING ROLES FROM ROLES TAB
document.querySelectorAll('.role-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    
        // Update hidden input for role
        document.getElementById('user-role').value = tab.dataset.role;
    });
});


/* PATIENT VALIDATION */
const loginForm = document.getElementById('loginForm');
const patientEmailInput = document.getElementById('patientEmail');
const patientPasswordInput = document.getElementById('patientPassword');
const patientPasswordContainer = document.querySelector('.loginPasswordContainer');
const patientEmailMsg = document.querySelector('.patientEmailMsg');
const patientPasswordMsg = document.querySelector('.patientPasswordMsg');
const successNotification = document.getElementById('successNotification');
const errorNotification = document.getElementById('errorNotification');
const successFormMessage = document.querySelector('.successFormMessage');
const errorFormMessage = document.querySelector('.errorFormMessage');
const bodyOpacity = document.querySelector('.opacity');

 const emailPattern = /^(?!\s*$)([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/


async function loginPatient() {
    const email = document.getElementById('patientEmail').value.trim();
    const password = document.getElementById('patientPassword').value.trim();

    let isValid = true;

    //check email
    if (email === '') {
        patientEmailInput.classList.add('errors');
        patientEmailMsg.textContent = 'Email cannot be empty';
        isValid = false;
    } else {
        patientEmailInput.classList.remove('errors');
        patientEmailMsg.textContent = '';
    };

    //check password
    if (password === '') {
        patientPasswordContainer.classList.add('errors');
        patientPasswordMsg.textContent = 'Password cannot be empty';
        isValid = false;
    }  else {
        patientPasswordContainer.classList.remove('errors');
        patientPasswordMsg.textContent = '';
    };


    if (isValid) {
        const response = await fetch('/telemedicine/api/patients/login', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({ email, password})
        });

        const result = await response.json();
        if (response.status === 200) {
            successNotification.style.display = 'flex';
            successFormMessage.textContent = (`${result.message}, ${result.first_name}`);
            bodyOpacity.style.display = "block";
            /* getPatient(); */
            loginForm.reset();
            
            setTimeout( () => {
                successNotification.style.display = 'none';
                bodyOpacity.style.display = "none";
                window.location.href = '../html/Patient_Dashboard.html';
            }, 3000);

        } else {
            errorNotification.style.display = 'flex';
            errorFormMessage.textContent = (`${result.message}`);
            bodyOpacity.style.display = "block";

            setTimeout( () => {
                errorNotification.style.display = 'none';
                bodyOpacity.style.display = "none";
            }, 3000);
        }
    }
}

//REAL TIME FEEDBACK FOR PATIENT LOGIN
    patientEmailInput.addEventListener('input', () => {
        if (!patientEmailInput.value.trim().match(emailPattern)) {
            patientEmailInput.classList.add('errors');
            patientEmailMsg.textContent = 'Please enter a valid email address';
            
        } else {
            patientEmailInput.classList.remove('errors');
            patientEmailMsg.textContent= '';
        }
    });

    patientPasswordInput.addEventListener('input', () => {
        if (patientPasswordInput.value.length < 8) {
            patientPasswordContainer.classList.add('errors');
            patientPasswordMsg.textContent = 'Password must be at least 8 characters long';
        }  else {
            patientPasswordContainer.classList.remove('errors');
            patientPasswordMsg.textContent = '';
        }
    });



/* DOCTOR VALIDATION */
    const doctorEmailInput = document.getElementById('doctorEmail');
    const loginDocPasswordContainer = document.querySelector('.loginDocPasswordContainer');
    const doctorPasswordInput = document.getElementById('doctorPassword');
    const doctorEmailMsg = document.querySelector('.doctorEmailMsg');
    const doctorPasswordMsg = document.querySelector('.doctorPasswordMsg');
    
    async function doctorLogin() {
        const email = document.getElementById('doctorEmail').value.trim();
        const doctorPassword = document.getElementById('doctorPassword').value.trim();

        let isValid = true;

        //check email
        if (email === '') {
            doctorEmailInput.classList.add('errors');
            doctorEmailMsg.textContent = 'Email cannot be empty';
            isValid = false;
        } else {
            doctorEmailInput.classList.remove('errors');
            doctorEmailMsg.textContent = '';
        };

        //check password
        if (doctorPassword === '') {
            loginDocPasswordContainer.classList.add('errors');
            doctorPasswordMsg.textContent = 'Password cannot be empty';
            isValid = false;
        }  else {
            loginDocPasswordContainer.classList.remove('errors');
            doctorPasswordMsg.textContent = '';
        };

        if (isValid) {
            const response = await fetch('/telemedicine/api/doctors/login', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({ email: email, password: doctorPassword})
            });

            const result = await response.json();
            if (response.status === 200) {
                successNotification.style.display = 'flex';
                successFormMessage.textContent = (`${result.message}, Dr ${result.first_name}`);
                bodyOpacity.style.display = "block";
                /* getDoctor(); */
                loginForm.reset();
                
                setTimeout( () => {
                    successNotification.style.display = 'none';
                    bodyOpacity.style.display = "none";
                }, 3000);
            } else {
                errorNotification.style.display = 'flex';
                errorFormMessage.textContent = (`${result.message}`);
                bodyOpacity.style.display = "block";

                setTimeout( () => {
                    errorNotification.style.display = 'none';
                    bodyOpacity.style.display = "none";
                }, 3000);
            }
        }
    };

    //REAL TIME FEEDBACK FOR PATIENT LOGIN
    doctorEmailInput.addEventListener('input', () => {
        if (!doctorEmailInput.value.trim().match(emailPattern)) {
            doctorEmailInput.classList.add('errors');
            doctorEmailMsg.textContent = 'Please enter a valid email address';
            
        } else {
            doctorEmailInput.classList.remove('errors');
            doctorEmailMsg.textContent= '';
        }
    });

    doctorPasswordInput.addEventListener('input', () => {
        if (doctorPasswordInput.value.length < 8) {
            loginDocPasswordContainer.classList.add('errors');
            doctorPasswordMsg.textContent = 'Password must be at least 8 characters long';
        }  else {
            loginDocPasswordContainer.classList.remove('errors');
            doctorPasswordMsg.textContent = '';
        }
    });



/* ADMIN VALIDATION */
    const adminUsernameInput = document.getElementById('username');
    const adminPasswordContainer = document.querySelector('.adminPasswordContainer');
    const adminPasswordInput = document.getElementById('adminPassword');
    const adminUsernameMsg = document.querySelector('.adminUsernameMsg');
    const adminPasswordMsg = document.querySelector('.adminPasswordMsg');

    async function adminLogin() {
        const username = document.getElementById('username').value.trim();
        const adminPassword = document.getElementById('adminPassword').value.trim();

        let isValid = true;

        //check username
        if (username === "") {
            adminUsernameInput.classList.add('errors');
            adminUsernameMsg.textContent = 'Username cannot be empty';
            isValid = false;
        } else {
            adminUsernameInput.classList.remove('errors');
            adminUsernameMsg.textContent = '';
        };

        if (adminPassword === "") {
            adminPasswordContainer.classList.add('errors');
            adminPasswordMsg.textContent = 'Password cannot be empty';
            isValid = false;
        } else {
            adminPasswordContainer.classList.remove('errors');
            adminPasswordMsg.textContent = '';
        };


        if (isValid) {
            const response = await fetch('/telemedicine/api/admin/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password_hash: adminPassword})
            })
    
            const result = await response.json();
    
            if (response.status === 200) {
                successNotification.style.display = 'flex';
                successFormMessage.textContent = (`${result.message}, ${result.username}`);
                bodyOpacity.style.display = "block";
    
                setTimeout( () => {
                    successNotification.style.display = 'none';
                    bodyOpacity.style.display = "none";
                }, 3000);
            } else {
                errorNotification.style.display = 'flex';
                errorFormMessage.textContent = (`${result.message}`);
                bodyOpacity.style.display = "block";
    
                setTimeout( () => {
                    errorNotification.style.display = 'none';
                    bodyOpacity.style.display = "none";
                }, 3000);
            }
        }
    }
    

    //REAL TIME FEEDBACK FOR ADMIN LOGIN
    adminPasswordInput.addEventListener('input', () => {
        if (adminPasswordInput.value.length < 8 ) {
            adminPasswordContainer.classList.add('errors');
            adminPasswordMsg.textContent = 'Password must be at least 8 characters long';
        } else {
            adminPasswordContainer.classList.remove('errors');
            adminPasswordMsg.textContent = '';
        }
    });


    // HIDE AND SHOW PASSWORD
const showHidePasswordAll = document.querySelectorAll ('.hide-show');

showHidePasswordAll.forEach((icon) => {
    icon.addEventListener('click', () => {
        const input = document.querySelector(icon.getAttribute('data-toggle'));
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('bx-show', 'bx-hide');
        } else {
            input.type = 'password';
            icon.classList.replace('bx-hide', 'bx-show');
        }
    });
});