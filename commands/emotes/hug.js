const Discord = require("discord.js");
const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "hug",
  category: "Fun",
  description: "Hug a user",
  usage: "hug <@user>",
  run: async (client, message) => {
    if (message.author.bot) return;

    if (talkedRecently.has(message.author.id)) {
      const er = new Discord.MessageEmbed()
        .setColor(colors.error)
        .setTitle("Woah there, calm down senpai!")
        .setDescription(
          emojis.Sip +
            "**Please wait**  ```5 seconds``` **before using the command again!**"
        )
        .setTimestamp()
        .setFooter(
          configs.prefix +
            "hug" +
            " | " +
            "Requested by " +
            message.member.user.tag
        );

      return message.channel.send({ embed: er }).then((msg) => {
        msg.delete({ timeout: 15000 });
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
        "**You can't hug no one silly, please mention a valid member.**"
      )
      .setTimestamp()
      .setFooter(
        configs.prefix +
          "hug" +
          " | " +
          "Requested by " +
          message.member.user.tag
      );

    let member = message.guild.member(message.mentions.users.first());
    if (!member) return message.channel.send({ embed: er2 });

    let gifs = [
      "https://media1.tenor.com/images/1d94b18b89f600cbb420cce85558b493/tenor.gif?itemid=15942846",
      "https://media1.tenor.com/images/d90bb447bb3886ec1ae3c8095d614917/tenor.gif?itemid=12887232",
      "https://media1.tenor.com/images/e58eb2794ff1a12315665c28d5bc3f5e/tenor.gif?itemid=10195705",
      "https://media1.tenor.com/images/6db54c4d6dad5f1f2863d878cfb2d8df/tenor.gif?itemid=7324587",
      "https://media1.tenor.com/images/94989f6312726739893d41231942bb1b/tenor.gif?itemid=14106856",
      "https://media1.tenor.com/images/daffa3b7992a08767168614178cce7d6/tenor.gif?itemid=15249774",
      "https://media1.tenor.com/images/969f0f462e4b7350da543f0231ba94cb/tenor.gif?itemid=14246498",
      "https://media1.tenor.com/images/ee3c3831a62667dc84ec4149a1651d8b/tenor.gif?itemid=14924015",
      "https://media1.tenor.com/images/df8b87203442db2c2af2a806eb7153d4/tenor.gif?itemid=16300141",
      "https://media1.tenor.com/images/aa04a0093e2ef93922d3d88e12b70561/tenor.gif?itemid=12887276",
      "https://media1.tenor.com/images/bb841fad2c0e549c38d8ae15f4ef1209/tenor.gif?itemid=10307432",
      "https://media1.tenor.com/images/074d69c5afcc89f3f879ca473e003af2/tenor.gif?itemid=4898650",
      "https://media1.tenor.com/images/4aa41fac755715a687f68a6319d885eb/tenor.gif?itemid=16300139",
      "https://media1.tenor.com/images/506aa95bbb0a71351bcaa753eaa2a45c/tenor.gif?itemid=7552075",
      "https://media1.tenor.com/images/4d89d7f963b41a416ec8a55230dab31b/tenor.gif?itemid=5166500",
      "https://media1.tenor.com/images/44b4b9d5e6b4d806b6bcde2fd28a75ff/tenor.gif?itemid=9383138",
      "https://media1.tenor.com/images/c1058ebe89313d50dfc878d38630036b/tenor.gif?itemid=13976210",
      "https://media1.tenor.com/images/460c80d4423b0ba75ed9592b05599592/tenor.gif?itemid=5044460",
      "https://media1.tenor.com/images/d19bfd9ba90422611ec3c2d835363ffc/tenor.gif?itemid=18374323",
      "https://media1.tenor.com/images/28c68322664d3e513098d9dc42f538e3/tenor.gif?itemid=17392376",
      "https://media1.tenor.com/images/ee3c3831a62667dc84ec4149a1651d8b/tenor.gif?itemid=14924015",
      "https://media1.tenor.com/images/7edded2757934756fdc240019d956cb3/tenor.gif?itemid=16403937",
      "https://media1.tenor.com/images/86e217b0915b3368d48eedeba0d8b68c/tenor.gif?itemid=13221036",
      "https://media1.tenor.com/images/0176cf63194d148375b36a295d8d975d/tenor.gif?itemid=16095203",
      "https://media1.tenor.com/images/7e30687977c5db417e8424979c0dfa99/tenor.gif?itemid=10522729",
      "https://media1.tenor.com/images/5ccc34d0e6f1dccba5b1c13f8539db77/tenor.gif?itemid=17694740",
      "https://media1.tenor.com/images/7db5f172665f5a64c1a5ebe0fd4cfec8/tenor.gif?itemid=9200935",
    ];

    let responses = ["cutely hugged", "hugged"];
    let titles = [
      "Senpai~ I could use some hugs too you know...",
      "Awww, you're so cute~ senpai!",
      "Senpai~ what are you doing?",
      "Teehee~",
      "Woah there, senpai~",
      "Heehee~",
      "Senpai~ I think you're taking it a step further...",
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
          emojis.Giggle
      )
      .setTimestamp()
      .setImage(response)
      .setFooter("Requested by " + message.member.user.tag);
    message.channel.send({ embed: embed });
  },
};
