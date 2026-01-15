const Parser = require('rss-parser');
const parser = new Parser();

const FEEDS = {
    bbc_world: "https://feeds.bbci.co.uk/news/world/rss.xml",
    bbc_int: "https://feeds.bbci.co.uk/news/rss.xml?edition=int",
    gnews_breaking_world: "https://news.google.com/rss/search?q=breaking+world+news&hl=en-CA&gl=CA&ceid=CA:en",
};

const getRSS = async(req,res) =>{
    try{
        const key = req.query.feed || "bbc_world";
        const url = FEEDS[key];

        if (!url) return res.status(400).json({ error: "Unknown feed" });

        const feed = await parser.parseURL(url);
        const items = (feed.items || []).slice(0, 15).map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      source: feed.title,
    }));

    return res.json({ feed: feed.title, items });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load RSS" });
  }

}

