const Discord = require("discord.js");
const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

const player = require("../../handlers/player");

module.exports = {
  name: "resume",
  category: "music",
  description: "Plauses the current song",
  usage: "pause",
  run: async (client, message, args) => {
    if (talkedRecently.has(message.author.id)) {
      const er = new Discord.MessageEmbed()
        .setColor(colors.error)
        .setTitle("Woah there, calm down senpai!")
        .setDescription(
          emojis.Sip +
            "Please wait  `5 seconds` before using the command again!"
        )
        .setTimestamp()
        .setFooter(
          configs.prefix +
            "play" +
            " | " +
            "Requested by " +
            message.member.user.tag
        );

      return message.reply({ embeds: [er] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });
    } else {
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        talkedRecently.delete(message.author.id);
      }, 5000);
    }

    const queue = player.getQueue(message.guildId);
    const noQueue = new Discord.MessageEmbed()
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription(
        "Silly~ There is no song currently playing in this server!"
      )
      .setColor(colors.error)
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!queue?.playing)
      return message.reply({
        embeds: [noQueue],
      });

    queue.setPaused(false);

    const resumeembed = new Discord.MessageEmbed()
      .setTitle("Senpai, I've resumed your music!" + emojis.Giggle)
      .setColor(colors.success)
      .setDescription(
        "I've resumed your music in `" +
          message.member.voice.channel.name +
          "`!"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    return message.reply({ embeds: [resumeembed] });
  },
};
