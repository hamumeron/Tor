const express = require("express");
const fetch = require("node-fetch");
const { SocksProxyAgent } = require("socks-proxy-agent");
const cheerio = require("cheerio");

const app = express();
const PORT = 3000;
const torProxy = 'socks5h://127.0.0.1:9050';

app.get("/", (req, res) => {
  res.send(`<form action="/onion">
    <input name="url" placeholder="http://example.onion">
    <button>GO</button></form>`);
});

app.get("/onion", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl || !targetUrl.endsWith(".onion")) {
    return res.status(400).send("有効な .onion アドレスを入力してください");
  }

  try {
    const agent = new SocksProxyAgent(torProxy);
    const response = await fetch(targetUrl, { agent });
    const html = await response.text();
    const $ = cheerio.load(html);

    $("a").each((_, el) => {
      const href = $(el).attr("href");
      if (href && href.endsWith(".onion")) {
        $(el).attr("href", "/onion?url=" + encodeURIComponent(href));
      }
    });

    res.send($.html());
  } catch (err) {
    res.status(500).send("取得失敗: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} で起動中`);
});
