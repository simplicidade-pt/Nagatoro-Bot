const Discord = require("discord.js");
const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "pat",
  category: "Fun",
  description: "Pat a user",
  usage: "pat <@user>",
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
            "pat" +
            " | " +
            "Requested by " +
            message.member.user.tag
        );

      return message.channel.reply({ embeds: [er] }).then((msg) => {
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
        "You can't pat no one silly, please mention a valid member."
      )
      .setTimestamp()
      .setFooter(
        configs.prefix +
          "pat" +
          " | " +
          "Requested by " +
          message.member.user.tag
      );

    let member = message.mentions.users.first();
    if (!member) return message.channel.reply({ embeds: [er2] });

    let gifs = [
      "https://media1.tenor.com/images/3a53720e404964ad6657f7874bc8c457/tenor.gif?itemid=21711751",
      "https://media1.tenor.com/images/5320ee2011820489729d4963e432b431/tenor.gif?itemid=20766208",
      "https://media1.tenor.com/images/283c8eca2202c1e5bb5c75ac222fc5f6/tenor.gif?itemid=21300317",
      "https://media1.tenor.com/images/5b4fb3d455f75bd4ec16df71590f482e/tenor.gif?itemid=21480317",
      "https://media1.tenor.com/images/9ef78a57f101ceba8b5a223209b5bca1/tenor.gif?itemid=21213656",
      "https://media1.tenor.com/images/e5fff7bc2fc641f8ed0cba92475ea741/tenor.gif?itemid=18243417",
      "https://media1.tenor.com/images/da8f0e8dd1a7f7db5298bda9cc648a9a/tenor.gif?itemid=12018819",
      "https://media1.tenor.com/images/6151c42c94df654b1c7de2fdebaa6bd1/tenor.gif?itemid=16456868",
      "https://media1.tenor.com/images/daa885ec8a9cfa4107eb966df05ba260/tenor.gif?itemid=13792462",
      "https://media1.tenor.com/images/183ff4514cbe90609e3f286adaa3d0b4/tenor.gif?itemid=5518321",
      "https://media1.tenor.com/images/13f385a3442ac5b513a0fa8e8d805567/tenor.gif?itemid=13857199",
      "https://media1.tenor.com/images/4e3a2ff5f9069a939d2ef2289d063bb9/tenor.gif?itemid=19380185",
      "https://media1.tenor.com/images/b1f1b033e98ad4fce9852984367f1840/tenor.gif?itemid=16303815",
      "https://media1.tenor.com/images/7b7cf23988e44d58b662cab127ba7ed0/tenor.gif?itemid=20494475",
      "https://media1.tenor.com/images/fad9a512808d29f6776e7566f474321c/tenor.gif?itemid=16917926",
    ];

    let responses = ["cutely patted", "patted"];
    let titles = [
      "Senpai~ I could use some pats too you know...",
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
          emojis.Sip
      )
      .setTimestamp()
      .setImage(response)
      .setFooter("Requested by " + message.member.user.tag);
    message.channel.reply({ embeds: [embed] });
  },
};
