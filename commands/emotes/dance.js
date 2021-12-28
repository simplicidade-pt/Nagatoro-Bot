const Discord = require("discord.js");

const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "dance",
  category: "Fun",
  description: "Dance",
  usage: "dance <@user>",
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
            "dance" +
            " | " +
            "Requested by " +
            message.member.user.tag
        );

      return message.member.reply({ embeds: er }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });
    } else {
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        talkedRecently.delete(message.author.id);
      }, 5000);
    }

    let gifs = [
      "https://media1.tenor.com/images/a509cadc5e01b08ef7e5300a6e9ed320/tenor.gif?itemid=21220114",
      "https://media1.tenor.com/images/881ddcc161301af945edd118d2f9ffdf/tenor.gif?itemid=21497553",
      "https://media1.tenor.com/images/2c128db3ffd74efedaa78c63d1e52469/tenor.gif?itemid=21213646",
      "https://media1.tenor.com/images/dd5c3c12a805e7cabd9f496023b3a32b/tenor.gif?itemid=21248936",
      "https://media1.tenor.com/images/97215e107725c10f9ddfceca339a3b7d/tenor.gif?itemid=21496782",
      "https://media1.tenor.com/images/839252c2d263e0c3fca28571c62fa72e/tenor.gif?itemid=21319918",
      "https://media1.tenor.com/images/97514c64332ac4660b16513fed65de84/tenor.gif?itemid=4874892",
      "https://media1.tenor.com/images/42803ed59f21b034f440243557ff2736/tenor.gif?itemid=11049076",
      "https://media1.tenor.com/images/9b89ddf1522e582dad4fd7950f0a62be/tenor.gif?itemid=5646380",
      "https://media1.tenor.com/images/dc24029de47091555c2ecd8ac91d2069/tenor.gif?itemid=13048072",
      "https://media1.tenor.com/images/61cf901b1c520204c5c185d4a4244b78/tenor.gif?itemid=13410605",
      "https://media1.tenor.com/images/7d6f80c8b6ff80c72417d4e56d9bd311/tenor.gif?itemid=21384758",
      "https://media1.tenor.com/images/b76dfba54b3b3df1f74787df0e6bd4f6/tenor.gif?itemid=21035259",
    ];

    let titles = [
      "Senpai~ I can you teach me how to dance?",
      "Awww, you're so cute~ senpai!",
      "Nice dance moves senpai~",
      "Senpai~ what are you doing?",
      "Teehee~",
      "Woah there, senpai~",
      "Heehee~",
      "Senpai~ I think you're taking it a step further...",
    ];

    let response = gifs[Math.floor(Math.random() * gifs.length)];
    let t = titles[Math.floor(Math.random() * titles.length)];

    await message.channel;

    const embed = new Discord.MessageEmbed()
      .setColor(colors.info)
      .setTitle(t)
      .setTimestamp()
      .setImage(response)
      .setFooter("Requested by " + message.member.user.tag);
    message.member.reply({ embeds: [embed] });
  },
};
