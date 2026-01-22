const loadXMLFeed = () => {
    const url = "http://localhost:5001/api/rssfeed";
    
    // Get token from localStorage
    const token = localStorage.getItem('access-token');
    
    if (!token) {
        // No token, redirect to login
        window.location.href = 'login.html';
        return;
    }
    
    
    // Set up headers with Authorization
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    
    fetch(url, {
        credentials: 'include',
        headers: headers
    })
    .then(async response => {
        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const err = await response.json();
                const errorMsg = err.error || 'Failed to load RSS feed';
                // Check for authentication errors
                if (response.status === 400 && (errorMsg.includes('not authenticated') || errorMsg.includes('User not authenticated'))) {
                    throw new Error('AUTH_ERROR: ' + errorMsg);
                }
                throw new Error(errorMsg);
            }
            // Check status code for authentication errors
            if (response.status === 400) {
                throw new Error('AUTH_ERROR: User not authenticated');
            }
            throw new Error(`HTTP ${response.status}: Failed to load RSS feed`);
        }
        return response.text();
    })
    .then(data => {
        let parser = new DOMParser();
        let xml = parser.parseFromString(data,"application/xml");
        
        
        const parserError = xml.querySelector('parsererror');
        if (parserError) {
            throw new Error('Failed to parse XML feed');
        }
        
        displayNews(xml);
    })
    .catch(error => {
        console.error('Error:', error);
        if (error.message.includes('AUTH_ERROR') || error.message.includes('not authenticated')) {
            // Clear invalid token and hide user info
            localStorage.removeItem('access-token');
            const usernameElement = document.getElementById('username');
            if (usernameElement) {
                usernameElement.textContent = 'Not logged in';
            }
            alert('Session expired. Please log in again.');
            window.location.href = 'login.html';
        } else {
            alert(error.message || 'Failed to load news feed.');
        }
    });
}

// Decode JWT token to get username
function decodeJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error decoding token:', e);
        return null;
    }
}

// Generate avatar color based on username
function getAvatarColor(username) {
    const colors = [
        'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
        'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    ];
    // Use username to consistently pick a color
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
}

// Display user info in header
function displayUserInfo() {
    const token = localStorage.getItem('access-token');
    if (!token) {
        // No token, redirect to login
        window.location.href = 'login.html';
        return;
    }

    const decoded = decodeJWT(token);
    if (decoded && decoded.username) {
        const usernameElement = document.getElementById('username');
        const avatarElement = document.getElementById('userAvatar');
        
        if (usernameElement) {
            usernameElement.textContent = decoded.username;
        }
        
        if (avatarElement && decoded.username) {
            
            avatarElement.textContent = decoded.username.charAt(0).toUpperCase();
            
            avatarElement.style.background = getAvatarColor(decoded.username);
        }
    }
}

// Setup logout functionality
function setupLogout() {
    const userInfo = document.getElementById('userInfo');
    const logoutMenu = document.getElementById('logoutMenu');
    const logoutButton = document.getElementById('logoutButton');

    if (!userInfo || !logoutMenu || !logoutButton) return;


    userInfo.addEventListener('click', (e) => {
        e.stopPropagation();
        userInfo.classList.toggle('active');
        logoutMenu.classList.toggle('show');
    });

   
    document.addEventListener('click', (e) => {
        if (!userInfo.contains(e.target) && !logoutMenu.contains(e.target)) {
            userInfo.classList.remove('active');
            logoutMenu.classList.remove('show');
        }
    });


    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('access-token');
        window.location.href = 'login.html';
    });
}

document.addEventListener("DOMContentLoaded", () => {
    displayUserInfo();
    setupLogout();
    loadXMLFeed();
});


function displayNews(x){
    console.log(x);
    
    let list = document.getElementById('item');
    if (!list) {
        console.error('Element with id "item" not found');
        return;
    }
    
    let item = x.getElementsByTagName('item');
    let itemLength = x.getElementsByTagName('item').length;

    console.log(itemLength);
    
    for (let i = 0; i < itemLength; i++) {
    let li = document.createElement('li');
    li.className = 'listItem';

    let titleElement = item[i].getElementsByTagName('title')[0];
    let linkElement = item[i].getElementsByTagName('link')[0];
    
    if (!titleElement || !linkElement) {
        continue; // Skip items without title or link
    }
    
    let title = titleElement.textContent;
    let link = linkElement.textContent;

    let descTag = item[i].getElementsByTagName('description')[0];
    let description = descTag ? descTag.textContent : '';

    let media = item[i].getElementsByTagName('media:content')[0];
    let imageUrl = media ? media.getAttribute('url') : '';

    li.innerHTML = `
        ${imageUrl ? `
            <a href="${link}" target="_blank">
                <img src="${imageUrl}" alt="news image">
            </a>
        ` : ''}

        <h3>
            <a href="${link}" target="_blank">${title}</a>
        </h3>

        ${description ? `<p>${description}</p>` : ''}
    `;

    list.appendChild(li);
}

    
}