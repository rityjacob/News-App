const https = require('https');
const { URL } = require('url');

const getRSS = async(req,res) =>{
try {
    const rssUrl = "https://www.cbc.ca/webfeed/rss/rss-world";
    const url = new URL(rssUrl);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    };
    
    https.get(options, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode === 200) {
          res.set("Content-Type", "application/xml");
          res.send(data);
        } else {
          res.status(500).json({ error: "Failed to fetch RSS" });
        }
      });
      
    }).on('error', (error) => {
      console.error('RSS fetch error:', error);
      res.status(500).json({ error: "Failed to fetch RSS" });
    });
    
  } catch (e) {
    console.error('RSS controller error:', e);
    res.status(500).json({ error: "Failed to fetch RSS" });
  }
}

module.exports = {getRSS};

