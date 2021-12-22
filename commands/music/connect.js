const Discord = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "connect",
  category: "music",
  description: "Connects the bot to a voice channel",
  usage: "connect",
  run: async (client, message, args, ops) => {
    if (message.author.bot) return;

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
            "connect" +
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

    const err0 = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription(
        "Senpai~ I can't join you if you're not in the voice channel."
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!message.member.voice.channel) {
      return message.channel.send({ embeds: [err0] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });
    }

    const err = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription(
        "Senpai~ I'm already in your voice channel; don't you see me? ```" +
          message.member.voice.channel.name +
          "```"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (message.guild.me.voice.channel) {
      return message.channel.send({ embeds: [err] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });
    }

    const channel = message.member.voice.channel;
    const success = new Discord.MessageEmbed()
      .setColor(colors.success)
      .setTitle("Connected " + emojis.Hype)
      .setDescription(
        "Senpai~ I've successfully connected to ```" +
          message.member.voice.channel.name +
          "```"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.member.guild.id,
      adapterCreator: message.channel.guild.voiceAdapterCreator,
    });

    message.channel.send({ embeds: [success] });
  },
};
