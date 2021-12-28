const Discord = require("discord.js");

const emojis = require("../../configuration/emojis.json");
const colors = require("../../configuration/colors.json");

module.exports = {
  name: "membercount",
  category: "misc",
  description: "Shows servers membercount",
  usage: "membercount",
  run: async (client, message) => {
    if (message.author.bot) return;

    const embed = new Discord.MessageEmbed()
      .setColor(colors.info)
      .setTimestamp()
      .setTitle(emojis.Hype + "Here's the servers member count!")
      .setDescription("```" + message.guild.memberCount + "```", true);
    message.reply({ embeds: [embed] });
  },
};
