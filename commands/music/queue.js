const Discord = require("discord.js");
const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

const player = require("../../handlers/player");

module.exports = {
  name: "queue",
  category: "music",
  description: "Returns server song queue",
  usage: "queue",
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
    if (!queue?.playing)
      return message.channel.send({
        content: "No songs are currently playing",
      });

    const currentTrack = queue.current;
    const tracks = queue.tracks.slice(0, 10).map((m, i) => {
      return `${i + 1}. [**${m.title}**](${m.url}) - ${m.requestedBy.tag}`;
    });

    const songQueue = new Discord.MessageEmbed()
      .setColor(colors.success)
      .setTitle("Senpai~ Here's your song queue!" + " " + emojis.Giggle)
      .setDescription(
        `${tracks.join("\n")}${
          queue.tracks.length > tracks.length
            ? `\n...${
                queue.tracks.length - tracks.length === 1
                  ? `${queue.tracks.length - tracks.length} more track`
                  : `${queue.tracks.length - tracks.length} more tracks`
              }`
            : ""
        }`
      )
      .addField(
        emojis.Tag + "Currently Playing",
        `[**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy.tag}`,
        true
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    return message.channel.send({ embeds: [songQueue] });
  },
};
