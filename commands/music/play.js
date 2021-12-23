const Discord = require("discord.js");
const { QueryType } = require("discord-player");

const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

const player = require("../../handlers/player");

module.exports = {
  name: "play",
  category: "music",
  description: "Plays a song",
  usage: "play <song>",
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

      return message.channel.send({ embeds: [er] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });
    } else {
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        talkedRecently.delete(message.author.id);
      }, 5000);
    }

    const songSearch = args.slice(0).join(" ");
    const noRequest = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription(
        "Silly senpai~ You didn't provide me a name of a song to play!"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!songSearch)
      return message.channel.send({
        embeds: [noRequest],
      });

    const noChannel = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription(
        "Silly~ You need to join a voice channel for me to play a song!"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!message.member.voice.channel)
      return message.channel.send({
        embeds: [noChannel],
      });

    const searchResult = await player.search(songSearch, {
      requestedBy: message.member.user,
      searchEngine: QueryType.AUTO,
    });

    const queue = await player.createQueue(message.guild, {
      metadata: message.channel,
    });

    if (!queue.connection) await queue.connect(message.member.voice.channel);

    searchResult.playlist
      ? queue.addTracks(searchResult.tracks)
      : queue.addTrack(searchResult.tracks[0]);

    if (!queue.playing) await queue.play();
  },
};
