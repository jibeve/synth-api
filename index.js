//News Synth Scrapping API

const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const articles = [];

const newspapers = [
  {
    name: "soundonsound",
    address: "https://www.soundonsound.com/news",
    base: "",
  },
  {
    name: "sonicstate",
    address: "https://sonicstate.com/",
    base: "https://sonicstate.com",
  },
  {
    name: "musicradar",
    address: "https://www.musicradar.com/category/synths",
    base: "",
  },
  {
    name: "synthopia",
    address: "https://www.synthtopia.com/",
    base: "",
  },
  {
    name: "synthanatomy",
    address: "https://www.synthanatomy.com/",
    base: "",
  },
  {
    name: "musewire",
    address: "https://musewire.com/synth-news/",
    base: "",
  },
  {
    name: "gearnews",
    address: "https://www.gearnews.com/zone/synth/",
    base: "",
  },
  {
    name: "engadget",
    address: "https://www.engadget.com/tag/synthesizer/",
    base: "",
  },
  {
    name: "gearjunkies",
    address: "https://www.gearjunkies.com/",
    base: "",
  },
  {
    name: "musitech",
    address: "https://musictech.com/news/",
    base: "",
  },
];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("Korg")', html).each(function () {
      const title = $(this).text(); //this refer to the 'a' tag
      const url = $(this).attr("href");

      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Hello world");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId", (req, res) => {
  const newspaperId = req.params.newspaperId;
  console.log(req.params.nexspaperId)

  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].address;
  const newspaperbase = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $('a:contains("Korg")', html).each( function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspaperbase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT}`);
});
