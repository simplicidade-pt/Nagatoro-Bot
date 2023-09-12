const Discord = require("discord.js");
const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "kiss",
  category: "Fun",
  description: "Kiss a user",
  usage: "kiss <@user>",
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
            "kiss" +
            " | " +
            "Requested by " +
            message.member.user.tag
        );

      return message.reply({ embeds: [er] }).then((msg) => {
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
        "You can't kiss no one silly, please mention a valid member."
      )
      .setTimestamp()
      .setFooter(
        configs.prefix +
          "kiss" +
          " | " +
          "Requested by " +
          message.member.user.tag
      );

    let member = message.mentions.users.first();
    if (!member) return message.reply({ embeds: [er2] });

    let gifs = [
      "https://media1.tenor.com/images/ea9a07318bd8400fbfbd658e9f5ecd5d/tenor.gif?itemid=12612515",
      "https://media1.tenor.com/images/503bb007a3c84b569153dcfaaf9df46a/tenor.gif?itemid=17382412",
      "https://media1.tenor.com/images/7fd98defeb5fd901afe6ace0dffce96e/tenor.gif?itemid=9670722",
      "https://media1.tenor.com/images/1306732d3351afe642c9a7f6d46f548e/tenor.gif?itemid=6155670",
      "https://media1.tenor.com/images/d307db89f181813e0d05937b5feb4254/tenor.gif?itemid=16371489",
      "https://media1.tenor.com/images/ef4a0bcb6e42189dc12ee55e0d479c54/tenor.gif?itemid=12143127",
      "https://media1.tenor.com/images/37633f0b8d39daf70a50f69293e303fc/tenor.gif?itemid=13344412",
      "https://media1.tenor.com/images/ad514e809adc14f0b7722a324c2eb36e/tenor.gif?itemid=14375355",
      "https://media1.tenor.com/images/40711a5b00fcf9918ddef1aa483d993f/tenor.gif?itemid=11737410",
      "https://media1.tenor.com/images/2f23c53755a5c3494a7f54bbcf04d1cc/tenor.gif?itemid=13970544",
      "https://media1.tenor.com/images/32d4f0642ebb373e3eb072b2b91e6064/tenor.gif?itemid=15150255",
      "https://media1.tenor.com/images/efb9940f90e0bdc1f889a2e8763131bb/tenor.gif?itemid=5391560",
      "https://media1.tenor.com/images/d1a11805180742c70339a6bfd7745f8d/tenor.gif?itemid=4883557",
      "https://media1.tenor.com/images/8c73673bce3a7ee43611dbef708373b7/tenor.gif?itemid=4874602",
      "https://media1.tenor.com/images/3dc3bb6e35aa0d090527babe698bfe55/tenor.gif?itemid=14698608",
    ];

    let responses = ["cutely kissed", "kissed"];
    let titles = [
      "Senpai~ I could use some kisses too you know...",
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
    message.reply({ embeds: [embed] });
  },
};
