const Discord = require("discord.js");
let things = [
  "Of course, you're so silly senpai~",
  "No senpai~ no-",
  "That explains, you've been acting sus this whole time",
  "Senpai~ are you okay?",
  "Of course senpai!",
  "Senpai~ why would you?",
  "Senpai~ what do you think?",
];

const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "ask",
  category: "fun",
  description: "Ask nagatoro any question",
  usage: "ask <question>",
  run: async (client, message) => {
    if (message.author.bot) return;
    let random = things[Math.floor(Math.random() * things.length)];

    var embed = new Discord.MessageEmbed()
      .setTitle(emojis.Giggle + " Nagatoro:")
      .setDescription("```" + random + "```")
      .setColor(colors.info)
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);
    message.reply({ embeds: [embed] });
  },
};
