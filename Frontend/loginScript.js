const API_BASE = (() => {
    const host = window.location && window.location.hostname ? window.location.hostname : 'localhost';
    return `http://${host}:5001`;
})();

const loginUrl = `${API_BASE}/api/login/`;
const loginForm = document.getElementById('loginForm');


loginForm.addEventListener('submit', async (e) =>{
    
    e.preventDefault();

    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');
    const username = (usernameInput?.value || '').trim();
    const password = (passwordInput?.value || '').trim();

    loginData = {username,password}

    try{

        const  response = await fetch(loginUrl,{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(loginData),
            credentials: 'include',
        });
        if(response.ok){
            // Get token from response and store in localStorage
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            
            // Wait a moment to ensure cookie is set before redirect
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (usernameInput) usernameInput.value = '';
            if (passwordInput) passwordInput.value = '';

            window.location.href = 'home.html';
        }
        else{
            alert ('Login Unsuccesful')
        }
    }catch(error){
        alert(`An error occured : ${error.message}`);

    }

});
