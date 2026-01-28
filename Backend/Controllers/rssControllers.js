const https = require('https');
const { URL } = require('url');

const getRSS = async(req,res) =>{
try {
    const category = String(req.query.category || 'world').toLowerCase();

    const FEEDS_BY_CATEGORY = {
      world: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
      politics: 'https://www.cbc.ca/webfeed/rss/rss-politics',
      business: 'https://www.cbc.ca/webfeed/rss/rss-business',
      health: 'https://www.cbc.ca/webfeed/rss/rss-health',
      sports: 'https://www.cbc.ca/webfeed/rss/rss-sports',
      technology: 'https://www.cbc.ca/webfeed/rss/rss-technology',
      entertainment:'https://www.cbc.ca/webfeed/rss/rss-arts',
      
    };

    const rssUrl = FEEDS_BY_CATEGORY[category];
    if (!rssUrl) {
      return res.status(400).json({
        error: 'Invalid category. Supported: world, politics, business, health, sports',
      });
    }
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

