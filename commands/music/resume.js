const Discord = require("discord.js");
const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

const player = require("../../handlers/player");

module.exports = {
  name: "pause",
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
            "Please wait  **5 seconds** before using the command again!"
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

    const queue = player.getQueue(message.guildId);
    queue.setPaused(false);

    const resumeembed = new MessageEmbed()
      .setTitle("**Senpai, I've resumed your music!**")
      .setDescription(
        emojis.Hype +
          " I've resumed your music in ```" +
          message.member.voice.channel.name +
          "```"
      )
      .setColor(colors.info)
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    return message.channel.send({ embeds: [resumeembed] });
  },
};
