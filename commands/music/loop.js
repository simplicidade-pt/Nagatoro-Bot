const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "loop",
  category: "music",
  description: "Loop the current song",
  usage: "loop",
  run: async (client, message) => {
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
            "loop" +
            " | " +
            "Requested by " +
            message.member.user.tag
        );

      return message.channel.send({ embeds: er }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });
    } else {
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        talkedRecently.delete(message.author.id);
      }, 5000);
    }

    const queue = message.client.queue.get(message.guild.id);
    const err = new Discord.MessageEmbed()

      .setColor(colors.info)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription(
        "Silly senpai~ there is nothing currently playing in this server."
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!queue) return message.channel.send({ embeds: err });

    queue.loop = !queue.loop;
    message.channel.send(
      new MessageEmbed()
        .setTitle("Senpai, I've looped the song " + emojis.Giggle)
        .setColor(colors.info)
        .setTimestamp()
        .setFooter("Requested by " + message.member.user.tag)
        .setDescription(
          "I " +
            (queue.loop == true ? " enabled " : " disabled ") +
            "loop for the current song!"
        )
    );
  },
};
