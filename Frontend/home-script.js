loadXMLFeed = () => {
    const url = "http://localhost:5001/api/rssfeed";
    fetch(url, {credentials: 'include'})
    .then(async response => {
        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to load RSS feed');
            }
            throw new Error(`HTTP ${response.status}: Failed to load RSS feed`);
        }
        return response.text();
    })
    .then(data => {
        let parser = new DOMParser();
        let xml = parser.parseFromString(data,"application/xml");
        displayNews(xml);
    })
    .catch(error => {
        console.error('Error:', error);
        if (error.message.includes('not authenticated') || error.message.includes('400')) {
            alert('Please log in to view news feed.');
            window.location.href = 'login.html';
        } else {
            alert(error.message || 'Failed to load news feed.');
        }
    });
}

document.addEventListener("DOMContentLoaded", loadXMLFeed);


function displayNews(x){
    console.log(x);
    
    let list = document.getElementById('item');
    let item = x.getElementsByTagName('item');
    let itemLength = x.getElementsByTagName('item').length;

    console.log(itemLength);
    
    for (let i = 0; i < itemLength; i++) {
    let li = document.createElement('li');
    li.className = 'listItem';

    let title = item[i].getElementsByTagName('title')[0].textContent;
    let link = item[i].getElementsByTagName('link')[0].textContent;

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