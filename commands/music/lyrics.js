const Discord = require("discord.js");
const lyricsFinder = require("lyrics-finder");

const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

const player = require("../../handlers/player");

module.exports = {
  name: "lyrics",
  category: "music",
  description: "Displays the songs lyrics",
  usage: "lyrics",
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

      return message.channel.reply({ embeds: [er] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });
    } else {
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        talkedRecently.delete(message.author.id);
      }, 5000);
    }

    const queue = player.getQueue(message.guildId);
    const errq = new Discord.MessageEmbed()

      .setColor(colors.info)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription("Silly senpai~ there is nothing playing.")
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!queue)
      return message.channel.reply({ embeds: [errq] }).catch(console.error);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.current.title, "");
      if (!lyrics)
        lyrics =
          `Senpai~ I found no lyrics for ${queue.current.title} ` + emojis.Sip;
    } catch (error) {
      lyrics = `No lyrics found for "${queue.current.title}"`;
    }

    let lyricsEmbed = new Discord.MessageEmbed()
      .setAuthor(`Senpai~ Here's your lyrics For ${queue.current.title}`)
      .setDescription("```" + lyrics + "```")
      .setColor(colors.info)
      .setFooter("Requested by " + message.member.user.tag)
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = lyricsEmbed.description.substr(0, 2046) + "```";
    return message.channel.reply({ embeds: [lyricsEmbed] }).catch(console.error);
  },
};
