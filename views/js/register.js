// ADMIN AND PATIENT REGISTRATION FORM SWITCHING
const patientForm = document.getElementById('patientForm');
const doctorForm = document.getElementById('doctorForm');
const adminForm = document.getElementById('adminForm');
const patientRegBtn = document.getElementById('patientRegBtn');
const doctorRegBtn = document.getElementById('doctorRegBtn');
const adminRegBtn = document.getElementById('adminRegBtn');

patientRegBtn.addEventListener( 'click', (e) => {
    e.preventDefault();

    patientForm.style.display = 'block'; 
    doctorForm.style.display = 'none';
    adminForm.style.display = 'none';   
});
doctorRegBtn.addEventListener( 'click', (e) => {
    e.preventDefault();

    patientForm.style.display = 'none'; 
    doctorForm.style.display = 'block';
    adminForm.style.display = 'none';   
});

adminRegBtn.addEventListener( 'click', (e) => {
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
  
  //FRONTEND VALIDATION
  const registrationForm = document.getElementById('registrationForm');
  const registerBtn = document.getElementById('registerBtn');
  const firstName = document.getElementById('first_name');
  const lastName = document.getElementById('last_name');
  const emailInput = document.getElementById('email');
  const password = document.getElementById('password');
  const patientCPaswword = document.getElementById('cPassword');
  const passwordInput = document.querySelector('.registerPasswordContainer');
  const cPasswordInput = document.querySelector('.registerCPasswordContainer');
  const phoneInput = document.getElementById('phone');
  const dateOfBirth = document.getElementById('date_of_birth');
  const genderInput = document.getElementById('gender');
  const addressInput = document.getElementById('address');
  const roleMessage = document.querySelector('.message');
  const firstNameMessage = document.querySelector('.fNameMessage');
  const lastNameMessage = document.querySelector('.lNameMessage');
  const emailMessage = document.querySelector('.emailMessage');
  const phoneMessage = document.querySelector('.phoneMessage');
  const passwordMessage = document.querySelector('.passwordMessage');
  const cpMessage = document.querySelector('.cpMessage');
  const dobMessage = document.querySelector('.dobMessage');
  const genderMessage = document.querySelector('.genderMessage');
  const addressMessage = document.querySelector('.addressMessage');
  const acceptTermMessage = document.querySelector('.acceptTermMessage');
  const successNotification = document.getElementById('successNotification');
  const errorNotification = document.getElementById('errorNotification');
  const successFormMessage = document.querySelector('.successFormMessage');
  const errorFormMessage = document.querySelector('.errorFormMessage');
  const bodyOpacity = document.querySelector('.opacity');

  const phonePattern = /^(\+?\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{9,20}$/;

  const emailPattern = /^(?!\s*$)([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

  async function registerPatient()  {

        const user_role = document.getElementById('user-role').value.trim();
        const first_name = document.getElementById('first_name').value.trim();
        const last_name = document.getElementById('last_name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const cPassword = document.getElementById('cPassword').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const date_of_birth = document.getElementById('date_of_birth').value;
        const gender = document.getElementById('gender').value.trim();
        const address = document.getElementById('address').value.trim();
    
        let isValid = true;


         //CHECK ROLE
    if (user_role === "") {
        roleMessage.textContent = 'Please select a role to connect';
        isValid = false;
    } else {
        roleMessage.textContent = '';
    }

    //check first name
    if (first_name === '') {
        firstName.classList.add('errors');
        firstNameMessage.textContent = 'First name cannot be empty';
        isValid = false;
  
    } else {
        firstName.classList.remove('errors');
        firstNameMessage.textContent = '';
    }

    //check last name
    if (last_name === '') {
        lastName.classList.add('errors');
        lastNameMessage.textContent = 'last name cannot be empty';
        isValid = false;
    } else {
        lastName.classList.remove('errors');
        lastNameMessage.textContent = '';
    };

    //check email
    if (email === '') {
        emailInput.classList.add('errors');
        emailMessage.textContent = 'Email cannot be empty';
        isValid = false;
    } else {
        emailInput.classList.remove('errors');
        emailMessage.textContent = '';
    };

    //check Phone number
    if (phone === '') {
        phoneInput.classList.add('errors');
        phoneMessage.textContent = 'Phone number cannot be empty';
        isValid = false;

    } else{
        phoneInput.classList.remove('errors');
        phoneMessage.textContent = '';
    };

    //check password
    if (password === '') {
        passwordInput.classList.add('errors');
        passwordMessage.textContent = 'Password cannot be empty';
        isValid = false;
    }  else {
        passwordInput.classList.remove('errors');
        passwordMessage.textContent = '';
    };

    //check confirm password
    if (cPassword  === '') {
        cPasswordInput.classList.add('errors');
        cpMessage.textContent = 'Confirm Password cannot be empty';
        isValid = false;
    } else {
        cPasswordInput.classList.remove('errors');
        cpMessage.textContent = '';
    };

    //check date of birth
    if (date_of_birth === '') {
        dateOfBirth.classList.add('errors');
        dobMessage.textContent = 'Date of birth is required.';
        isValid = false;
    } else {
        dateOfBirth.classList.remove('errors');
        dobMessage.textContent = '';
    };

    //check gender
    if (gender === '') {
        genderInput.classList.add('errors');
        genderMessage.textContent = 'Gender selection is required';
        isValid = false;
    } else {
        genderInput.classList.remove('errors');
        genderMessage.textContent = '';
    };

    //ccheck address
    if (address === '') {
        addressInput.classList.add('errors');
        addressMessage.textContent = 'Address is required';
        isValid = false;
    } else {
        addressInput.classList.remove('errors');
        addressMessage.textContent = '';
    };

    //chek terms and conditions
    if (!checkbox.checked) {
        acceptTermMessage.textContent = 'Kindly accept the terms and conditions';
        isValid = false;
    } else {
        acceptTermMessage.textContent = '';
    };

    //check validation
    if (isValid) {
        // send the data to server
        const response = await fetch('/telemedicine/api/patients/register', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({first_name, last_name, email, password, phone, date_of_birth, gender, address})
        });

        const result = await response.json();

        if (response.status === 200) {
            successNotification.style.display = 'flex';
            successFormMessage.textContent = (`${result.message}`);
            bodyOpacity.style.display = "block";
            registrationForm.reset();

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
  };

//REAL TIME FEEDBACK
  emailInput.addEventListener('input', () => {
    if (!emailInput.value.trim().match(emailPattern)) {
        emailInput.classList.add('errors');
        emailMessage.textContent = 'Please enter a valid email address';
        
    } else {
        emailInput.classList.remove('errors');
        emailMessage.textContent= '';
    }
    });

    
    phoneInput.addEventListener('input', () => {
        if (!phoneInput.value.trim().match(phonePattern)) {
            phoneInput.classList.add('errors');
            phoneMessage.textContent = 'Please enter a valid phone number';
            
        } else {
            phoneInput.classList.remove('errors');
            phoneMessage.textContent= '';
        }
    });

    password.addEventListener('input', () => {
        if (password.value.length < 8) {
            passwordInput.classList.add('errors');
            passwordMessage.textContent = 'Password must be at least 8 characters long';
        }  else {
            passwordInput.classList.remove('errors');
            passwordMessage.textContent = '';
        }
    });

    patientCPaswword.addEventListener('input', () => {
        if (password.value !== patientCPaswword.value) {
            cPasswordInput.classList.add('errors');
            cpMessage.textContent = 'Password does not match';
        }  else {
            cPasswordInput.classList.remove('errors');
            cpMessage.textContent = '';
        }
    });


// DOCTOR FORM VALIDATION
const doctorEmailInput = document.getElementById('doctorEmail');
 const doctorPasswordInput = document.getElementById('doctorPassword');
 const doctorcPasswordInput = document.getElementById('doctorcPassword');
const doctorPasswordContainer = document.querySelector('.registerDocPasswordContainer');
const doctorcPasswordContainer = document.querySelector('.registerDocCPasswordContainer');
const doctorEmailMsg = document.querySelector('.doctorEmailMsg');
const doctorPasswordMsg = document.querySelector('.doctorPasswordMsg');
const doctorcPasswordMsg = document.querySelector('.doctorcPasswordMsg');

async function registerDoctor() {
    const doctorEmailValue = document.getElementById('doctorEmail').value.trim();
    const doctorPasswordValue = document.getElementById('doctorPassword').value.trim();
    const doctorcPasswordValue = document.getElementById('doctorcPassword').value.trim();

    let isValid = true;

    //chheck doctor email
    if (doctorEmailValue === "") {
        doctorEmailInput.classList.add('errors');
        doctorEmailMsg.textContent = 'Email address cannot be empty';
        isValid = false;
    } else {
        doctorEmailInput.classList.remove('errors');
        doctorEmailMsg.textContent = '';
    }

    //check doctor password
    if (doctorPasswordValue === "") {
        doctorPasswordContainer.classList.add('errors');
        doctorPasswordMsg.textContent = 'Password cannot be empty';
        isValid = false;
    } else {
        doctorPasswordContainer.classList.remove('errors');
        doctorPasswordMsg.textContent = '';
    }

    //check doctor confirm password
    if (doctorcPasswordValue === "") {
        doctorcPasswordContainer.classList.add('errors');
        doctorcPasswordMsg.textContent = 'Password cannot be empty';
        isValid = false;
    } else {
        doctorcPasswordContainer.classList.remove('errors');
        doctorcPasswordMsg.textContent = '';
    }


    if (isValid) {
        const response = await fetch('/telemedicine/api/doctors/register', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email:doctorEmailValue,  password: doctorPasswordValue})
        })

        const result = await response.json();

        if (response.status === 200) {
            successNotification.style.display = 'flex';
            successFormMessage.textContent = (`${result.message}`);
            bodyOpacity.style.display = "block";
            registrationForm.reset();

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


//REAL TIME FEEDBACK FOR DOCTOR
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
            doctorPasswordContainer.classList.add('errors');
            doctorPasswordMsg.textContent = 'Password must be at least 8 characters long';
            
        } else {
            doctorPasswordContainer.classList.remove('errors');
            doctorPasswordMsg.textContent = '';
        }
    });

    doctorcPasswordInput.addEventListener('input', () => {
        if (doctorPasswordInput.value !== doctorcPasswordInput.value) {
            doctorcPasswordContainer.classList.add('errors');
            doctorcPasswordMsg.textContent = 'Password does not match';
            
        } else {
            doctorcPasswordContainer.classList.remove('errors');
            doctorcPasswordMsg.textContent = '';
        }
    });





// ADMIN FORM VALIDATION
const usernameInput = document.getElementById('username');
const loginUsernameInput = document.getElementById('loginUsername');
const password_hashInput = document.getElementById('password_hash');
const registerAdminPasswordContainer = document.querySelector('.registerAdminPasswordContainer');
const registerAdminCPasswordContainer = document.querySelector('.registerAdminCPasswordContainer');
const cPassword = document.getElementById('adminCpassword');
const usernameMessage = document.querySelector('.usernameMessage');
const adminPasswordMessage = document.querySelector('.adminPasswordMessage');
const admincpMessage = document.querySelector('.admincpMessage');


async function adminRegistration() {
    const usernameValue = document.getElementById('username').value.trim();
    const password_hashValue = document.getElementById('password_hash').value.trim();
    const cPasswordValue = document.getElementById('adminCpassword').value.trim();
    const roleValue = document.getElementById('role').value;
    let isValid = true;

    
    //check username
    if (usernameValue === "") {
        usernameInput.classList.add('errors');
        usernameMessage.style.display = "block";
        usernameMessage.textContent = "This field is required";
        isValid = false;
    } else {
        usernameInput.classList.remove('errors');
        usernameMessage.style.display = "none";
        usernameMessage.textContent = "";
    }

    //check password
    if (password_hashValue === "") {
        registerAdminPasswordContainer.classList.add('errors');
        adminPasswordMessage.style.display = "block";
        adminPasswordMessage.textContent = "This field is required";
        isValid = false;
    } else {
        registerAdminPasswordContainer.classList.remove('errors');
        adminPasswordMessage.style.display = "none";
        adminPasswordMessage.textContent = "";
    }

    //check confirm password
    if (cPasswordValue === "") {
        registerAdminCPasswordContainer.classList.add('errors');
        admincpMessage.textContent = "Confirm Password cannot be empty.";
        isValid = false;
    } else {
        registerAdminCPasswordContainer.classList.remove('errors');
        admincpMessage.textContent = "";
    }
   

    if (isValid) {
        const response = await fetch('/telemedicine/api/admin/register', {
            method: "POST",
            headers:  {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: usernameValue, password_hash: password_hashValue, role: roleValue})
        })

        const result = await response.json();
        if (response.status === 200) {
            successNotification.style.display = 'flex';
            successFormMessage.textContent = (`${result.message}`);
            bodyOpacity.style.display = "block";
            registrationForm.reset();

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

//REAL TIME FORM VALIDATION FOR ADMIN REGISTRATION
password_hashInput.addEventListener('input', () => {
    if (password_hashInput.value.length < 8) {
        registerAdminPasswordContainer.classList.add('errors');
        adminPasswordMessage.textContent = 'Password must be at least 8 characters long';
    }  else {
        registerAdminPasswordContainer.classList.remove('errors');
        adminPasswordMessage.textContent = '';
    }
});

cPassword.addEventListener('input', () => {
    if (password_hashInput.value !== cPassword.value) {
        registerAdminCPasswordContainer.classList.add('errors');
        admincpMessage.textContent = 'Password does not match';
    }  else {
        registerAdminCPasswordContainer.classList.remove('errors');
        admincpMessage.textContent = '';
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