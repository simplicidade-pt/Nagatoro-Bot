const Discord = require("discord.js");
const colors = require("../../configuration/colors.json");

module.exports = {
  name: "avatar",
  category: "fun",
  description: "Get a users avatar",
  usage: "avatar <@user>",
  run: async (client, message, args) => {
    if (message.author.bot) return;

    const Target = message.mentions.users.first() || message.member.user
    let avatarEmbed = new Discord.MessageEmbed()
        .setColor(colors.info)
        .setTitle(Target.username + "'s Avatar")
        .setImage(Target.displayAvatarURL({ size: 4096, format: "png"}))
        .setFooter("Requested by " + message.member.user.tag)
        .setTimestamp();

      message.reply({ embeds: [avatarEmbed] });
  },
};
