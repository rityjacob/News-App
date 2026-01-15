loginUrl = 'http://localhost:5001/api/login/'
const loginForm = document.getElementById('loginForm');


loginForm.addEventListener('submit', async (e) =>{
    
    e.preventDefault();

    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value.trim();

    loginData = {username,password}

    try{

        const  response = await fetch(loginUrl,{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(loginData),
        });
        if(response.ok){
            alert('Logged In!')

            username.value = '';
            password.value = '';

            window.location.href = 'home.html';
        }
        else{
            alert ('Login Unsuccesful')
        }
    }catch(error){
        alert(`An error occured : ${error.message}`);

    }

});
