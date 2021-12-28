const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");
const configs = require("../../configuration/settings.json");

module.exports = {
  name: "smart",
  category: "fun",
  description: "Shows how smart the user is",
  usage: "smart <@user>",
  run: async (client, message, args) => {
    if (message.author.bot) return;

    function getUserFromMention(mention) {
      const matches = mention.match(/^<@!?(\d+)>$/);
      if (!matches) return;
      const id = matches[1];

      return client.users.cache.get(id);
    }

    let msg = [
      "Senpai~ you're not as smart as I thought you were!",
      "Teehee~",
      "Woah there, senpai~",
      "Senpai~",
      "Marvellous choice, senpai~",
      "You're so silly senpai~",
      "I've got you covered, senpai~",
      "Haha, senpai~",
      "As smart as me?",
    ];

    let response = msg[Math.floor(Math.random() * msg.length)];

    const smart = Math.round(Math.random() * 100);
    const smartIndex = Math.floor(smart / 10);
    const smartLevel =
      "🧠".repeat(smartIndex) + " / " + emojis.Brain.repeat(10 - smartIndex);

    if (args[0]) {
      const user = getUserFromMention(args[0]);

      const er = new Discord.MessageEmbed()
        .setTitle(configs.missing_title_fun + emojis.Hmm)
        .setDescription(
          "```" +
            "Senpai~ I can't figure out how smart no one is, silly. \n Please mention a valid member." +
            "```"
        )
        .setColor(colors.info)
        .setTimestamp()
        .setFooter("Requested by " + message.member.user.tag);
      if (!user)
        return message.member.reply({ embeds: [er] }).then((msg) => {
          setTimeout(() => msg.delete(), 15000);
        });

      let avatarEmbed = new Discord.MessageEmbed()
        .setColor(colors.info)
        .setTitle(emojis.Info + " " + response)
        .setTimestamp()
        .setDescription(
          "**" +
            "Senpai <@!" +
            message.member.user.id +
            ">~" +
            "<@!" +
            user.id +
            ">'s smartness is `" +
            smart +
            " IQ`" +
            "!** \n" +
            smartLevel +
            ""
        )
        .setFooter("Requested by " + message.member.user.tag);

      message.member.reply({ embeds: [avatarEmbed] });
    } else {
      let avatarEmbed = new Discord.MessageEmbed()
        .setColor(colors.info)
        .setTitle(emojis.Info + " " + response)
        .setDescription(
          "**" +
            "Senpai~ your smartness is ** `" +
            smart +
            "IQ` **!** \n " +
            smartLevel +
            ""
        )
        .setTimestamp()
        .setFooter("Requested by " + message.member.user.tag);

      message.member.reply({ embeds: [avatarEmbed] });
    }
  },
};
