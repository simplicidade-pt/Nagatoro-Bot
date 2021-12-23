const Discord = require("discord.js");
const { QueryType, Player } = require("discord-player");

const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "play",
  category: "music",
  description: "Plays a song",
  usage: "play <song>",
  run: async (client, message, args) => {
    const player = new Player(client, {
      ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
      },
    });

    player.on("error", (queue, error) => {
      console.log(
        `[${queue.guild.name}] Error emitted from the queue: ${error.message}`
      );
    });

    player.on("connectionError", (queue, error) => {
      console.log(
        `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
      );
    });

    player.on("trackStart", (queue, track) => {
      const trackStart = new Discord.MessageEmbed()
        .setColor(colors.info)
        .setTitle("Senpai~ I've started playing: ")
        .setDescription("```" + track.title + "```")
        .setFooter(
          "Queued by " +
            track.requestedBy +
            " in " +
            queue.connection.channel.name
        )
        .setTimestamp();

      queue.metadata.send({ embeds: [trackStart] });
    });

    player.on("trackAdd", (queue, track) => {
      const trackAdd = new Discord.MessageEmbed()
        .setColor(colors.info)
        .setTitle("Senpai~ A new song has been queued!")
        .setDescription("```" + track.title + "```")
        .setFooter(
          "Queued by " +
            track.requestedBy +
            " in " +
            queue.connection.channel.name
        )
        .setTimestamp();

      queue.metadata.send({ embeds: [trackAdd] });
    });

    player.on("botDisconnect", (queue) => {
      const botDisconnect = new Discord.MessageEmbed()
        .setColor(colors.error)
        .setTitle("Senpai~ I've been disconnected!")
        .setDescription(
          "```" +
            "I was disconnected from the voice channel, queue was cleared!" +
            "```"
        )
        .setTimestamp();

      queue.metadata.send({ embeds: [botDisconnect] });
    });

    player.on("channelEmpty", (queue) => {
      const channelEmpty = new Discord.MessageEmbed()
        .setColor(colors.error)
        .setTitle("Senpai~ Where did everyone go?!")
        .setDescription(
          "```" +
            "Nobody is in the voice channel, I've left the voice channel!" +
            "```"
        )
        .setTimestamp();

      queue.metadata.send({ embeds: [channelEmpty] });
    });

    player.on("queueEnd", (queue) => {
      const queueEnd = new Discord.MessageEmbed()
        .setColor(colors.success)
        .setTitle("Senpai~ I've completed the queue!")
        .setDescription("```" + "I've completed the whole queue!" + "```")
        .setTimestamp();

      queue.metadata.send({ embeds: [queueEnd] });
    });

    if (talkedRecently.has(message.author.id)) {
      const er = new Discord.MessageEmbed()
        .setColor(colors.error)
        .setTitle("Woah there, calm down senpai!")
        .setDescription(
          emojis.Sip +
            "Please wait  ```5 seconds``` before using the command again!"
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

    if (!message.member.voice.channel)
      return message.member.channel.send({
        embeds: [noRequest],
      });

    const searchResult = await player.search(songSearch, {
      requestedBy: message.member.user.tag,
      searchEngine: QueryType.AUTO,
    });

    const queue = await player.createQueue(message.guild, {
      metadata: message.channel,
    });

    if (!queue.connection) await queue.connect(message.member.voice.channel);

    const playEmbed = new Discord.MessageEmbed()
      .setColor(colors.success)
      .setTitle(`Senpai~ I've added your song to the queue! ` + emojis.Giggle)
      .addField(
        emojis.Tag + " " + "Requested By",
        "```" + message.member.user.tag + "```",
        true
      )
      .addField(
        emojis.Tag + " " + "Requested Song",
        "```" + songSearch + " " + "```",
        true
      );

    message.channel.send({ embeds: [playEmbed] });

    searchResult.playlist
      ? queue.addTracks(searchResult.tracks)
      : queue.addTrack(searchResult.tracks[0]);

    if (!queue.playing) await queue.play();
  },
};