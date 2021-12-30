const Discord = require("discord.js");
const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

const player = require("../../handlers/player");

module.exports = {
  name: "skip",
  category: "music",
  description: "Skips a song",
  usage: "skip",
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

    const noSong = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription("Silly senpai~ There is no music currently being played!")
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    const queue = player.getQueue(message.guildId);
    if (!queue?.playing)
      return message.reply({
        embeds: [noSong],
      });

    queue.skip();

    const Skipped = new Discord.MessageEmbed()
      .setColor(colors.success)
      .setTitle("Senpai~" + emojis.Hype)
      .setDescription("I've successfully skipped the song, next song it is!")
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    message.reply({ embeds: [Skipped] });
  },
};
