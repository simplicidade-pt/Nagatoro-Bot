const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const configs = require("../../configuration/settings.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "rps",
  category: "entertainment",
  description: "Rps with the bot",
  usage: "rps <rock/paper/scissors>",
  run: async (client, message, args) => {
    if (message.author.bot) return;

    const err = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.missing_title_fun + emojis.Hmm)
      .setDescription("``` Please select Rock/Paper/Scissors ```")
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    const text = args.slice(0).join(" ");

    if (text.length < 1)
      return message.reply({ embeds: [err] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });

    let choose = ["Rock", "Paper", "Scissors"];
    let result = choose[Math.floor(Math.random() * choose.length)];

    const embed = new Discord.MessageEmbed()
      .setColor(colors.info)
      .setTitle("R/P/S Results")
      .addField(
        "**I chose " + result + "!**",
        "*Senpai~ you chose " + text + "*"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    message.reply({ embeds: [embed] });
  },
};
