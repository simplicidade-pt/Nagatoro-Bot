const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const talkedRecently = new Set();

const Discord = require("discord.js");

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "lyrics",
  category: "music",
  description: "Searches lyrics for the current song",
  usage: "lyrics",
  run: async (client, message, args, ops) => {
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
            "lyrics" +
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
    const errq = new Discord.MessageEmbed()

      .setColor(colors.info)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription("Silly senpai~ there is nothing playing.")
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!queue)
      return message.channel.send({ embeds: [errq] }).catch(console.error);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.queue[0].name, "");
      if (!lyrics) lyrics = `No lyrics found for ${queue.queue[0].name} `;
    } catch (error) {
      lyrics = `No lyrics found for "${queue.queue[0].name}"`;
    }

    let lyricsEmbed = new MessageEmbed()
      .setAuthor(`Senpai~ here's youyr lyrics For ${queue.queue[0].name}`)
      .setDescription("```" + lyrics + "```")
      .setColor(colors.info)
      .setFooter("Requested by " + message.member.user.tag)
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = lyricsEmbed.description.substr(0, 2046) + "```";
    return message.channel.send({ embeds: [lyricsEmbed] }).catch(console.error);
  },
};
