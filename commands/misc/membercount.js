const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

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
      .setDescription(
        "**Member Count:**" +
          "```" +
          message.guild.memberCount +
          "```" +
          " server members " +
          emojis.Hype,
        true
      );
    message.channel.send({ embed: embed });
  },
};
