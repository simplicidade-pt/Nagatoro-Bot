const Discord = require("discord.js");
const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "slap",
  category: "Fun",
  description: "Slap a user",
  usage: "slap <@user>",
  run: async (client, message) => {
    if (message.author.bot) return;

    if (talkedRecently.has(message.author.id)) {
      const er = new Discord.MessageEmbed()
        .setColor(colors.error)
        .setTitle("Woah there, calm down senpai!")
        .setDescription(
          emojis.Sip +
            "Please wait  `5 seconds` before using the command again!"
        )
        .setTimestamp()
        .setFooter(
          configs.prefix +
            "slap" +
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
        "You can't slap no one silly, please mention a valid member."
      )
      .setTimestamp()
      .setFooter(
        configs.prefix +
          "slap" +
          " | " +
          "Requested by " +
          message.member.user.tag
      );

    let member = message.mentions.users.first();
    if (!member) return message.channel.send({ embeds: [er2] });

    let gifs = [
      "https://media1.tenor.com/images/74db8b0b64e8d539aebebfbb2094ae84/tenor.gif?itemid=15144612",
      "https://media1.tenor.com/images/612e257ab87f30568a9449998d978a22/tenor.gif?itemid=16057834",
      "https://media1.tenor.com/images/9ea4fb41d066737c0e3f2d626c13f230/tenor.gif?itemid=7355956",
      "https://media1.tenor.com/images/4a6b15b8d111255c77da57c735c79b44/tenor.gif?itemid=10937039",
      "https://media1.tenor.com/images/ab6a7690e9b38f2e4ea14d6e0165cf16/tenor.gif?itemid=21406940",
      "https://media1.tenor.com/images/1ae0a42059d8ad64a0345e93313dfc91/tenor.gif?itemid=21281337",
      "https://media1.tenor.com/images/9ef78a57f101ceba8b5a223209b5bca1/tenor.gif?itemid=21213656",
      "https://media1.tenor.com/images/7d0536c496e1be67c15234315c358e6b/tenor.gif?itemid=21427460",
      "https://media1.tenor.com/images/fb17a25b86d80e55ceb5153f08e79385/tenor.gif?itemid=7919028",
      "https://media1.tenor.com/images/e8f880b13c17d61810ac381b2f6a93c3/tenor.gif?itemid=17897236",
      "https://media1.tenor.com/images/6138bdbf998fde7638b8362499ac5427/tenor.gif?itemid=11829035",
      "https://media1.tenor.com/images/f2e22829f9dc2e796d8e9d0590e8076c/tenor.gif?itemid=17223486",
      "https://media1.tenor.com/images/a4640cd4e7d7ba80e0a0b7824a7b639e/tenor.gif?itemid=5299675",
      "https://media1.tenor.com/images/d21e86018af6d2db1a718a717c827b77/tenor.gif?itemid=17423280",
    ];

    let responses = ["slapped", "strongly slapped"];
    let titles = [
      "Senpai~ That was aggressive...",
      "Senpai~ Silly!",
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
      .setTimestamp()
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
          emojis.Hah
      )
      .setImage(response)
      .setFooter("Requested by " + message.member.user.tag);
    message.channel.send({ embeds: [embed] });
  },
};
