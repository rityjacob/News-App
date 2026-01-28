const dobInput = document.getElementById("dob");
const dobError = document.getElementById("dobError");
const form = document.getElementById("regForm");
const mobno = document.getElementById("mobileno");
const mobError = document.getElementById("mobError");
const regBtn = document.getElementById("regBtn");


// Block future dates
const today = new Date().toISOString().split("T")[0];
dobInput.max = today;

form.addEventListener("submit", function (e) {
    const dob = new Date(dobInput.value);
    const todayDate = new Date();

    let age = todayDate.getFullYear() - dob.getFullYear();
    const monthDiff = todayDate.getMonth() - dob.getMonth();

    const mobValue = mobno.value.trim();
    const isValidMobile = /^\d{10,15}$/.test(mobValue);

    if (
    monthDiff < 0 ||
    (monthDiff === 0 && todayDate.getDate() < dob.getDate())
    ) {
    age--;
    }

    if (age < 10) {
    e.preventDefault();
    dobError.textContent = "Age must be at least 10 years.";
    } else {
    dobError.textContent = "";
    }

    if (!isValidMobile) {
    e.preventDefault();
    mobError.textContent = "Mobile number must contain only digits (10–15).";
    }
});


form.addEventListener('submit', async (e)=>{
    e.preventDefault();

    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();
    const confirmPassword = document.querySelector("#confirmPassword").value.trim();
    const email = document.querySelector("#email").value.trim();
    const mobNo = document.querySelector("#mobileno").value.trim();
    const dob = document.querySelector("#dob").value.trim();

  if (password !== confirmPassword) {
    alert("Password doesn't match, please re-enter");
    return;
  }

  if (!username || !password || !email || !mobNo || !dob) {
    alert("All fields are required");
    return;
  }
    
    formData = {username,password,email,mobno: mobNo,dob};

    const API_BASE = (() => {
        const host = window.location && window.location.hostname ? window.location.hostname : 'localhost';
        return `http://${host}:5001`;
    })();

    const apiUrl = `${API_BASE}/api/register`;

    try{
        const response = await fetch(apiUrl,{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
        });

        if(response.ok){
            alert(`Registered successfully`);

            username.value = '';
            password.value ='';
            confirmPassword.vlaue = '';
            email.value='';
            mobNo.value='';
            dob.value = '';

            window.location.href = "login.html"

        }else{
            alert(`Registration Unsuccesful. Please try again`)
        }

        
    }catch(error){
        alert(`An error occured: ${error.message}`);
    }
});


