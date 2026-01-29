const SUPPORTED_CATEGORIES = new Set(['world', 'politics', 'business', 'health', 'sports','technology','entertainment']);
const DEFAULT_CATEGORY = 'world';

const API_BASE = (() => {
    const host = window.location && window.location.hostname ? window.location.hostname : 'localhost';
    return `http://${host}:5001`;
})();

const setActiveCategoryChip = (category) => {
    const ribbon = document.getElementById('categoryRibbon');
    if (!ribbon) return;

    const chips = ribbon.querySelectorAll('button[data-category]');
    chips.forEach((chip) => {
        const isActive = chip.getAttribute('data-category') === category;
        chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
}

const clearNewsList = () => {
    const list = document.getElementById('item');
    if (list) list.innerHTML = '';
}

const loadXMLFeed = (category = DEFAULT_CATEGORY) => {
    if (!SUPPORTED_CATEGORIES.has(category)) {
        alert('This category is coming soon. For now: World, Politics, Sports, Health.');
        return;
    }

    setActiveCategoryChip(category);
    clearNewsList();

    const url = `${API_BASE}/api/rssfeed?category=${encodeURIComponent(category)}`;
    fetch(url, {credentials: 'include'})
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
        
        // Check for XML parsing errors
        const parserError = xml.querySelector('parsererror');
        if (parserError) {
            throw new Error('Failed to parse XML feed');
        }
        
        displayNews(xml);
    })
    .catch(error => {
        console.error('Error:', error);
        if (error.message.includes('AUTH_ERROR') || error.message.includes('not authenticated')) {
            alert('Please log in to view news feed.');
            window.location.href = 'login.html';
        } else {
            alert(error.message || 'Failed to load news feed.');
        }
    });
}

const setupCategoryRibbon = () => {
    const ribbon = document.getElementById('categoryRibbon');
    if (!ribbon) return;

    ribbon.addEventListener('click', (e) => {
        const btn = e.target && e.target.closest ? e.target.closest('button[data-category]') : null;
        if (!btn) return;

        const category = btn.getAttribute('data-category') || DEFAULT_CATEGORY;
        loadXMLFeed(category);
    });
}

// Decode JWT token to get username
const decodeJWT = (token) => {
    try {
        // JWT tokens have 3 parts separated by dots: header.payload.signature
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        
        // Decode the payload (second part)
        const payload = parts[1];
        // Replace URL-safe characters and add padding if needed
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(atob(base64));
        
        return decoded;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

// Get username from cookie
const getUsername = () => {
    // Try to get token from cookie
    const cookies = document.cookie.split(';');
    let token = null;
    
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'access-token') {
            token = value;
            break;
        }
    }
    
    // If not in cookie, try localStorage (for cross-port scenarios)
    if (!token) {
        token = localStorage.getItem('token');
    }
    
    if (token) {
        const decoded = decodeJWT(token);
        if (decoded && decoded.username) {
            return decoded.username;
        }
    }
    
    return 'User';
};

const handleLogout = async () => {
    try {
        // Clear the cookie by setting it to expire
        document.cookie = 'access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        // Clear localStorage token if present
        localStorage.removeItem('token');
        
        // Redirect to login page
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
        // Still redirect even if there's an error
        window.location.href = 'login.html';
    }
};

const setupUserDropdown = () => {
    const dropdownBtn = document.getElementById('userDropdownBtn');
    const dropdownMenu = document.getElementById('userDropdownMenu');
    const logoutOption = document.getElementById('logoutOption');
    const usernameDisplay = document.getElementById('usernameDisplay');
    
    if (!dropdownBtn || !dropdownMenu || !logoutOption || !usernameDisplay) {
        return;
    }
    
    // Set username
    const username = getUsername();
    usernameDisplay.textContent = username;
    
    // Toggle dropdown on button click
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
        dropdownBtn.classList.toggle('active');
    });
    
    // Close dropdown when clicking logout
    logoutOption.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.remove('show');
        dropdownBtn.classList.remove('active');
        handleLogout();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
            dropdownBtn.classList.remove('active');
        }
    });
};

document.addEventListener("DOMContentLoaded", () => {
    setupCategoryRibbon();
    loadXMLFeed(DEFAULT_CATEGORY);
    setupUserDropdown();
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