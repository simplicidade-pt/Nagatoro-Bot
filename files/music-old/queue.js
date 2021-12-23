const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "queue",
  category: "music",
  description: "Get the servers queue",
  usage: "queue",
  run: async (client, message) => {
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
            "queue" +
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

    const channel = message.member.voice.channel;
    const err = new Discord.MessageEmbed()

      .setColor(colors.info)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription("Silly senpai~ you're not in a voice channel!")
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!channel) return message.channel.send({ embeds: [err] });
    const queue = message.client.queue.get(message.guild.id);

    var status;
    var np;
    var count = 0;

    if (!queue) status = "Senpai, there is nothing in queue!";
    else
      status = queue.queue
        .map((x) => {
          count += 1;
          return (
            "• " +
            "`" +
            count +
            "" +
            "` | " +
            x.name +
            " - Requested by " +
            `<@${x.requested.id}>`
          );
        })
        .join("\n");
    if (!queue) np = status;
    else np = queue.queue[0].name;
    if (queue) thumbnail = queue.queue[0].thumbnail;
    else thumbnail = message.guild.iconURL();

    let queueembed = new MessageEmbed()
      .setTitle("Senpai, here's your music queue! " + emojis.Hype)
      .setThumbnail(thumbnail)
      .setColor(colors.info)
      .addField("Now Playing", "```" + np + "```", true)
      .setDescription(status)
      .setFooter("Requested by " + message.member.user.tag)
      .setTimestamp();

    message.channel.send({ embeds: [queueembed] });
  },
};
