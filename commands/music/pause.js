const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "pause",
  category: "music",
  description: "Pauses the current song",
  usage: "pause",
  run: async (client, message) => {
    if (talkedRecently.has(message.author.id)) {
      const er = new Discord.MessageEmbed()
        .setColor(colors.error)
        .setTitle("Woah there, calm down senpai!")
        .setDescription(
          emojis.Sip +
            "**Please wait**  ```5 seconds``` **before using the command again!**"
        )
        .setTimestamp()
        .setFooter(
          configs.prefix +
            "pause" +
            " | " +
            "Requested by " +
            message.member.user.tag
        );

      return message.channel.send({ embed: er }).then((msg) => {
        msg.delete({ timeout: 15000 });
      });
    } else {
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        talkedRecently.delete(message.author.id);
      }, 5000);
    }

    const channel = message.member.voice.channel;
    const err = new Discord.MessageEmbed()

      .setColor(colors.info)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription("Silly senpai~ you're not in a voice channel!")
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!channel) return message.channel.send({ embed: err });
    let queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.channel.send(
        new MessageEmbed()
          .setTitle(configs.err_title_music + " " + emojis.Sip)
          .setDescription("Senpai~ there is nothing playing in this server!")
          .setColor(colors.error)
          .setFooter("Requested by " + message.member.user.tag)
          .setTimestamp()
      );
    if (queue.playing == false)
      return message.channel.send(
        new MessageEmbed()
          .setTitle(configs.err_title_music + " " + emojis.Sip)
          .setDescription("Silly senpai~ the song is already paused!")
          .setColor(colors.error)
          .setFooter("Requested by " + message.member.user.tag)
          .setTimestamp()
      );
    queue.connection.dispatcher.pause();
    message.react("⏸");
    queue.playing = false;
    return message.channel.send(
      new MessageEmbed()
        .setTitle("Senpai, I've paused your music " + emojis.Giggle)
        .setDescription(
          emojis.Hype +
            " I've paused the music in ```" +
            message.member.voice.channel.name +
            "```"
        )
        .setColor(colors.info)
        .setFooter("Requested by " + message.member.user.tag)
        .setTimestamp()
    );
  },
};
