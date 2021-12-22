const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

const moment = require("moment");

module.exports = {
  name: "userinfo",
  category: "misc",
  description: "Shows information about a user",
  usage: "userinfo",
  run: async (client, message, args) => {
    if (message.author.bot) return;

    const userMention =
      message.guild.members.cache.get(message.mentions.users.first()).id ||
      message.member.user.id;

    let userinfo = {};
    userinfo.bot = userMention.bot;
    userinfo.createdat = userMention.createdAt;
    userinfo.discrim = userMention.discriminator;
    userinfo.id = userMention.id;
    userinfo.tag = userMention.tag;
    userinfo.uname = userMention.username;
    userinfo.avatar = userMention.avatarURL;
    // userinfo.JointedAt = moment.utc(userMention.joinedAt);

    var myInfo = new Discord.MessageEmbed()
      .addField(
        emojis.Tag + " " + "Username",
        "```" + userinfo.uname + "```",
        true
      )
      .addField(
        emojis.Tag + " " + "Discriminator",
        "```" + userinfo.discrim + "```",
        true
      )
      .addField(
        emojis.Tag + " " + "Client Tag",
        "```" + userinfo.tag + "```",
        true
      )
      .addField(
        emojis.Tag + " " + "Created",
        "```" + userinfo.createdat + "```",
        true
      )
      .addField(
        emojis.Tag + " " + "Guild Join",
        "```" +
          `${moment.utc(userinfo.joinedAt).format("DD/MM/YYYY")}` +
          " " +
          "GMT+0000 (Coordinated Universal Time)" +
          "```",
        true
      )
      .addField(emojis.Tag + " " + "Bot", "```" + userinfo.bot + "```", true)
      .setColor(colors.info)
      .setFooter("Requested by " + message.member.user.tag)
      .setTitle(
        "User Information:" + " " + userinfo.tag + " " + emojis.Verified
      )
      .setTimestamp()
      .setThumbnail(message.member.user.avatarURL({ dynamic: true }));

    message.channel.send({ embeds: myInfo });
  },
};
