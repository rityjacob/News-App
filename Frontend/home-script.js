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

const handleLogout = async () => {
    try {
        // Clear the cookie by setting it to expire
        document.cookie = 'access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        // Redirect to login page
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
        // Still redirect even if there's an error
        window.location.href = 'login.html';
    }
};

document.addEventListener("DOMContentLoaded", () => {
    setupCategoryRibbon();
    loadXMLFeed(DEFAULT_CATEGORY);
    
    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
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