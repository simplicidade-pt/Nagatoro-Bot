const Discord = require("discord.js");
const colors = require("../../configuration/colors.json");

module.exports = {
  name: "avatar" || "av",
  category: "fun",
  description: "Get a users avatar",
  usage: "avatar <@user>",
  run: async (client, message, args) => {
    if (message.author.bot) return;
    const Target = message.mentions.users.first()

    if (Target) {
      let avatarEmbed = new Discord.MessageEmbed()
        .setColor(colors.info)
        .setTitle("Your avatar:")
        .setImage(Target.author.displayAvatarURL({ dynamic: true }))
        .setFooter("Requested by " + message.member.user.tag)
        .setTimestamp();
      message.reply({ embeds: [avatarEmbed] });
    } else {
      let avatarEmbed = new Discord.MessageEmbed()
        .setColor(colors.info)
        .setTimestamp()
        .setTitle(message.member.user.name + "'s Avatar:")
        .setImage(message.author.displayAvatarURL({ dynamic: true }))
        .setFooter("Requested by " + message.member.user.tag);

      message.reply({ embeds: [avatarEmbed] });
    }
  },
};
