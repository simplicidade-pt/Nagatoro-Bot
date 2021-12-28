const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");
const configs = require("../../configuration/settings.json");

let selector = "regional_indicator_";
let numbers = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
};

module.exports = {
  name: "emojify",
  category: "fun",
  description: "Emojify a sentence",
  usage: "emojify <sentence>",
  run: (client, message, args) => {
    if (message.author.bot) {
      return;
    }

    const errm = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle(configs.missing_title_fun + emojis.Sip)
      .setDescription(
        emojis.Hmm +
          " Senpai~ What message did you want me to emojify again? \n Please mention a message for me to emojify!"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!args.length)
      return message.member.reply({ embeds: [errm] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });

    let content = args.join(" ");
    let msg = "";
    content.split("").forEach((l) => {
      if (l == " ") {
        msg += "  ";
        return;
      }
      if (!isNaN(l)) {
        msg += `:${numbers[l.toString()]}:`;
      } else {
        msg += `:${selector}${l.toLowerCase()}:`;
      }
    });

    let embed = new Discord.MessageEmbed()
      .setDescription(msg)
      .setColor(colors.info)
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);
    message.member.reply({ embeds: [embed] });
  },
};
