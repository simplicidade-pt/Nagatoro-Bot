const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");
const configs = require("../../configuration/settings.json");

module.exports = {
  name: "love",
  category: "fun",
  description: "Shows a users love for someone",
  usage: "love <@user>",
  run: async (client, message, args) => {
    if (message.author.bot) return;

    function getUserFromMention(mention) {
      const matches = mention.match(/^<@!?(\d+)>$/);
      if (!matches) return;
      const id = matches[1];

      return client.users.cache.get(id);
    }

    let msg = [
      "Senpai~ is it a match?",
      "Teehee~",
      "Woah there, senpai~",
      "Senpai~",
      "Marvellous choice, senpai~",
      "New couple, senpai?",
      "I've got you covered, senpai~",
    ];

    let response = msg[Math.floor(Math.random() * msg.length)];

    const love = Math.round(Math.random() * 100);
    const loveIndex = Math.floor(love / 10);
    const loveLevel =
      emojis.PH.repeat(loveIndex) + " / " + emojis.BH.repeat(10 - loveIndex);

    if (args[0]) {
      const user = getUserFromMention(args[0]);

      const er = new Discord.MessageEmbed()
        .setTitle(configs.missing_title_fun + emojis.Hmm)
        .setDescription(
          "```" +
            "Senpai~ you can't fall in love with no one, silly. \n Please mention a valid member." +
            "```"
        )
        .setColor(colors.info)
        .setFooter("Requested by " + message.member.user.tag);
      if (!user)
        return message.channel.send({ embed: er }).then((msg) => {
          msg.delete({ timeout: 15000 });
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
            " you're ** `" +
            love +
            "%` **in love with " +
            "<@!" +
            user.id +
            ">! ** " +
            " \n" +
            loveLevel +
            ""
        )
        .setFooter("Requested by " + message.member.user.tag);

      message.channel.send({ embed: avatarEmbed });
    } else {
      let avatarEmbed = new Discord.MessageEmbed()
        .setColor(colors.info)
        .setTitle(emojis.Info + " " + response)
        .setDescription(
          "**" +
            "Senpai~ you're** `" +
            love +
            "%` **in love with yourself!** \n " +
            loveLevel +
            ""
        )
        .setTimestamp()
        .setFooter("Requested by " + message.member.user.tag);

      message.channel.send({ embed: avatarEmbed });
    }
  },
};
