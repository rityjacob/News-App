
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

    if (!mobno.isInteger){
        e.preventDefault();
    mobError.textContent = "Mobile number must be integer";
    } else {
    mobError.textContent = "";
    }
});


form.addEventListener('click', async (e)=>{
    e.preventDefault();

    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');
    const rePass = document.querySelector('#confirmPassword');
    if(passwordInput !== rePass){
        alert(`Password doesnt match, please reenter`);
        return;
    }
    const emailInput = document.querySelector('#email');
    const mobNoInput = document.querySelector('mobileno');
    const dobInput = document.querySelector('dob');


    const username = usernameInput.value.trim();
    const email = emailInput.vlaue.trim();
    const mobNo = mobNoInput.value.trim();
    const dob = dobInput.vlaue.trim();

    if(!username||password||email||mobNo||dob){
        alert(`All fields are required`);
        return;
    }
    
    formData = {username,password,email,mobNo,dob};

    const apiUrl = 'http://localhost:5001/api/register/'

    try{
        const response = await fetch(apiUrl,{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
        });

        if(response.ok){
            alert(`Registered successfully`);

            usernameInput.value = '';
            passwordInput.value ='';
            rePass.vlaue = '';
            emailInput.value='';
            mobNoInput.value='';
            dobInput.value = '';
        }else{
            alert(`Registration Unsuccesful. Please try again`)
        }

        
    }catch(error){
        alert(`An error occured: ${error.message}`);
    }
});
