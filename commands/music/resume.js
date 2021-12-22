const { MessageEmbed } = require("discord.js");
const talkedRecently = new Set();

const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");
const configs = require("../../configuration/settings.json");

module.exports = {
  name: "resume",
  category: "music",
  description: "Resumes the current song",
  usage: "resume",
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
            "resume" +
            " | " +
            "Requested by " +
            message.member.user.tag
        );

      return message.channel.send({ embeds: er }).then((msg) => {
        setTimeout(() => message.delete(), 15000);
      });
    } else {
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        talkedRecently.delete(message.author.id);
      }, 5000);
    }

    const channel = message.member.voice.channel;
    if (!channel)
      return message.channel.send({
        content: "You must Join a voice channel before using this command!",
      });
    let queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.channel.send(
        new MessageEmbed()
          .setTitle(configs.err_title_music + " " + emojis.Sip)
          .setDescription(":x: There are no songs playing in this server")
          .setColor(colors.error)
          .setTimestamp()
          .setFooter("Requested by " + message.member.user.tag)
      );
    if (queue.playing == true)
      return message.channel.send(
        new MessageEmbed()
          .setTitle(configs.err_title_music + " " + emojis.Sip)
          .setDescription("Senpai~ I can't resume what's already playing")
          .setColor(colors.error)
          .setTimestamp()
          .setFooter("Requested by " + message.member.user.tag)
      );
    queue.connection.dispatcher.resume();
    message.react("▶");
    queue.playing = true;
    return message.channel.send(
      new MessageEmbed()
        .setTitle("**Senpai, I've resumed your music!**")
        .setDescription(
          emojis.Hype +
            " I've resumed your music in ```" +
            message.member.voice.channel.name +
            "```"
        )
        .setColor(colors.info)
        .setTimestamp()
        .setFooter("Requested by " + message.member.user.tag)
    );
  },
};
