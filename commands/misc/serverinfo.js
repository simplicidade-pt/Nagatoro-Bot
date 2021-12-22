const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "serverinfo",
  category: "misc",
  description: "Shows Information about the server",
  usage: "serverinfo",
  run: async (client, message) => {
    if (message.author.bot) return;

    function checkDays(date) {
      let now = new Date();
      let diff = now.getTime() - date.getTime();
      let days = Math.floor(diff / 86400000);
      return days + (days == 1 ? " day" : " days") + " ago";
    }

    const embed = new Discord.MessageEmbed()
      .setColor(colors.info)
      .setTitle(
        "Server Information:" + " " + message.guild.name + " " + emojis.Verified
      )
      .setThumbnail(message.guild.iconURL())
      .addField(
        emojis.Tag + " " + "Server Name",
        "```" + message.guild.fetchOwner() + "```",
        true
      )
      .addField(
        emojis.Tag + " " + "Server Id",
        "```" + message.guild.id + "```",
        true
      )
      .addField("Owner", "```" + "-" + "```", true)
      .addField(
        emojis.Tag + " " + "Members",
        "```" + message.guild.memberCount + "```",
        true
      )
      .addField(
        emojis.Tag + " " + "Channels",
        "```" + message.guild.channels.cache.size + "```",
        true
      )
      .addField(
        emojis.Tag + " " + "Roles",
        "```" + message.guild.roles.cache.size + "```",
        true
      )
      .addField(
        emojis.Tag + " " + "Verification Level",
        "```" + message.guild.verificationLevel + "```",
        true
      )
      .addField(
        emojis.Tag + " " + "Creation Date",
        "```" +
          `${message.channel.guild.createdAt
            .toUTCString()
            .substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})` +
          "```",
        true
      )
      .setThumbnail(message.guild.iconURL())
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);
    message.channel.send({ embeds: [embed] });
  },
};
