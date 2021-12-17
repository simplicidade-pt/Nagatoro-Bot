const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "avatar",
  category: "fun",
  description: "Get a users avatar",
  usage: "avatar <@user>",
  run: async (client, message, args) => {
    if (message.author.bot) return;

    function getUserFromMention(mention) {
      const matches = mention.match(/^<@!?(\d+)>$/);
      if (!matches) return;
      const id = matches[1];
      return client.users.cache.get(id);
    }

    if (args[0]) {
      const user = getUserFromMention(args[0]);

      let avatarEmbed = new Discord.MessageEmbed()
        .setColor(colors.info)
        .setTitle(emojis.Info + " Avatar:")
        .setImage(user.displayAvatarURL({ dynamic: true }))
        .setDescription("```" + user.tag + "```")
        .setFooter("Requested by " + message.member.user.tag)
        .setTimestamp();

      message.channel.send({ embed: avatarEmbed });
    } else {
      let avatarEmbed = new Discord.MessageEmbed()
        .setColor(colors.info)
        .setTimestamp()
        .setTitle(emojis.Info + " Avatar:")
        .setDescription("```" + message.member.user.tag + "```")
        .setImage(message.author.displayAvatarURL({ dynamic: true }))
        .setFooter("Requested by " + message.member.user.tag);

      message.channel.send({ embed: avatarEmbed });
    }
  },
};
