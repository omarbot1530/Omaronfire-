const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const PAGE_TOKEN = process.env.PAGE_TOKEN;

app.post("/webhook", async (req, res) => {
  let msg = req.body.entry[0].messaging[0];
  if (!msg.message || !msg.message.text) return res.sendStatus(200);

  let text = msg.message.text;
  let sender = msg.sender.id;

  if (text.startsWith("!slot")) {
    let bet = parseInt(text.split(" ")[1]) || 100;

    const fruits = ["🍎","🍊","🥝","🍓"];
    let r = [
      fruits[Math.floor(Math.random()*4)],
      fruits[Math.floor(Math.random()*4)],
      fruits[Math.floor(Math.random()*4)]
    ];

    let win = r[0] === r[1] && r[1] === r[2];

    let reply = win
      ? `🎉 You won ${bet*3}$\n[ ${r.join(" | ")} ]`
      : `😢 You lost ${bet}$\n[ ${r.join(" | ")} ]`;

    await axios.post(`https://graph.facebook.com/v17.0/me/messages?access_token=${PAGE_TOKEN}`, {
      recipient: { id: sender },
      message: { text: reply }
    });
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Slot Bot Running"));
