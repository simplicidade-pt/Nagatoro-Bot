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

    const songTitle = args.slice(0).join(" ");

    if (!message.member.voice.channel)
      return message.member.channel.send({
        content: "join vc you bum",
      });

    const searchResult = await player.search(songTitle, {
      requestedBy: "message.user",
      searchEngine: QueryType.AUTO,
    });

    const queue = await player.createQueue(message.guild, {
      metadata: message.channel,
    });

    if (!queue.connection) await queue.connect(message.member.voice.channel);

    message.channel.send({ content: `test anbabababababab ${songTitle}` });

    searchResult.playlist
      ? queue.addTracks(searchResult.tracks)
      : queue.addTrack(searchResult.tracks[0]);

    if (!queue.playing) await queue.play();
  },
};
