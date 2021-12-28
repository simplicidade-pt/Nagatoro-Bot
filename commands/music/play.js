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

      return message.channel.reply({ embeds: [er] }).then((msg) => {
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
      return message.channel.reply({
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
      return message.channel.reply({
        embeds: [noChannel],
      });

    const searchResult = await player.search(songSearch, {
      requestedBy: message.member.user,
      searchEngine: QueryType.AUTO,
    });

    const notFound = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription(
        "Hmm, I couldn't quite find the song you requested for; try playing another one!"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!searchResult || !searchResult.tracks.length)
      return message.channel.reply({ embeds: [notFound] });

    const queue = player.createQueue(message.guild, {
      metadata: message.channel,
    });

    const errorPlaying = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription(
        "There was an error with your request, please try again later!"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    try {
      if (!queue.connection) await queue.connect(message.member.voice.channel);
    } catch {
      queue.destroy();
      return message.channel.reply({ embeds: [errorPlaying] });
    }
    if (searchResult.playlist) {
      queue.addTracks(searchResult.tracks);
    } else {
      queue.addTrack(searchResult.tracks[0]);
    }

    if (!queue.playing) await queue.play();
  },
};
