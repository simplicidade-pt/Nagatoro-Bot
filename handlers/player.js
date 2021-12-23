const { Player } = require("discord-player");
const client = require("../server");
const Discord = require("discord.js");

const configs = require("../configuration/settings.json");
const colors = require("../configuration/colors.json");
const emojis = require("../configuration/emojis.json");

const player = new Player(client, {
  ytdlOptions: {
    // quality: "highestaudio",
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
      "Queued by " + track.requestedBy + " in " + queue.connection.channel.name
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
      "Queued by " + track.requestedBy + " in " + queue.connection.channel.name
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

module.exports = player;
