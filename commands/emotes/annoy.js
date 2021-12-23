const Discord = require("discord.js");
const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "annoy",
  category: "Fun",
  description: "Annoy a user",
  usage: "annoy <@user>",
  run: async (client, message) => {
    if (message.author.bot) return;
    if (talkedRecently.has(message.author.id)) {
      const er = new Discord.MessageEmbed()
        .setColor(colors.error)
        .setTitle("Woah there, calm down senpai!")
        .setDescription(
          emojis.Sip +
            "Please wait  **5 seconds** **before using the command again!"
        )
        .setTimestamp()
        .setFooter(
          configs.prefix +
            "hug" +
            " | " +
            "Requested by " +
            message.member.user.tag
        );

      return message.channel.send({ embeds: [er] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });
    } else {
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        talkedRecently.delete(message.author.id);
      }, 5000);
    }

    const er2 = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle(configs.missing_title_emotes + emojis.Hmm)
      .setDescription(
        "You can't annoy no one silly, please mention a valid member."
      )
      .setTimestamp()
      .setFooter(
        configs.prefix +
          "annoy" +
          " | " +
          "Requested by " +
          message.member.user.tag
      );

    let member = message.mentions.users.first();

    if (!member) return message.channel.send({ embeds: [er2] });

    let gifs = [
      "https://media1.tenor.com/images/bab2ff05e786e8201d53637229b068ca/tenor.gif?itemid=20766201",
      "https://media1.tenor.com/images/5b4fb3d455f75bd4ec16df71590f482e/tenor.gif?itemid=21480317",
      "https://media1.tenor.com/images/1b70c4ae2fa8584684b5a4de7e138b20/tenor.gif?itemid=21111285",
      "https://media1.tenor.com/images/73e84131de01aa531fc3598cac034bf4/tenor.gif?itemid=21332141",
      "https://c.tenor.com/clgZWwUN_LwAAAAC/nagatoro-bully.gif",
      "https://c.tenor.com/7huC9ySUwnoAAAAC/suzumiya-haruhi-kyon.gif",
      "https://c.tenor.com/nRKOOicoT8YAAAAC/anime-poke.gif",
      "https://c.tenor.com/G5u3bfszOPMAAAAC/anime-picking-nose.gif",
      "https://c.tenor.com/HPlp78w2otYAAAAC/poke-anime.gif",
      "https://c.tenor.com/7iV_gBGrRAUAAAAC/boop-poke.gif",
      "https://c.tenor.com/1YMrMsCtxLQAAAAC/anime-poke.gif",
      "https://c.tenor.com/gMqsQ1wwbhgAAAAC/anime-poke.gif",
      "https://c.tenor.com/7huC9ySUwnoAAAAC/suzumiya-haruhi-kyon.gif",
      "https://c.tenor.com/t6ABAaRJEA0AAAAC/oreimo-ore-no-im%C5%8Dto-ga-konna-ni-kawaii-wake-ga-nai.gif",
      "https://c.tenor.com/OBA3ce3nPyMAAAAC/kawaii-poke.gif",
      "https://c.tenor.com/NjIdfk7i3bsAAAAC/poke-poke-poke.gif",
      "https://c.tenor.com/jNx0V84WbqkAAAAC/anime-anime-poke.gif",
      "https://c.tenor.com/gcXVjd955uIAAAAC/anime.gif",
      "https://c.tenor.com/7EkFRiLUn34AAAAC/poke-anime.gif",
    ];

    let responses = ["cutely annoyed", "annoyed", "is being mean to"];
    let titles = [
      "Senpai~ I could use some attention too you know...",
      "Awww, you're so cute~ senpai!",
      "Senpai~ what are you doing?",
      "Teehee~",
      "Woah there, senpai~",
      "Heehee~",
      "Senpai~ I think you're taking it too far...",
    ];

    let response = gifs[Math.floor(Math.random() * gifs.length)];
    let msg = responses[Math.floor(Math.random() * responses.length)];
    let t = titles[Math.floor(Math.random() * titles.length)];

    await message.channel;

    const embed = new Discord.MessageEmbed()
      .setColor(colors.info)
      .setTitle(t)
      .setDescription(
        "**" +
          "<@!" +
          message.member.user +
          ">" +
          " " +
          msg +
          " " +
          "<@!" +
          member +
          ">" +
          "**" +
          " " +
          emojis.Hype
      )
      .setImage(response)
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);
    message.channel.send({ embeds: [embed] });
  },
};
