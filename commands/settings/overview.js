const Guild = require("../../models/guild");
const Discord = require("discord.js");

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "overview",
  category: "settings",
  description: "Shows the servers configurations",
  usage: `overview`,
  run: async (client, message, args) => {
    const err = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        `**Silly senpai~ you don't have permission to view server settings. (MANAGE_GUILD)**`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
      return message.channel.send({ embeds: [err] }).then((msg) => {
        setTimeout(() => message.delete(), 15000);
      });

    const settings = await Guild.findOne(
      {
        guildID: message.guild.id,
      },
      (err, guild) => {
        if (err) console.error(err);
        if (!guild) {
          message.channel.send({ embeds: [err] });
        }
      }
    );

    const success = new Discord.MessageEmbed()
      .setColor(colors.info)
      .setTitle("Configurations" + " " + emojis.Giggle)
      .setDescription(
        `**Hey Senpai~ here's your current server configurations:**`
      )
      .addField(
        emojis.Tag + " Welcome Logs",
        "<#" + settings.welcomechannelId + ">",
        true
      )
      .addField(
        emojis.Tag + " Moderation Logs",
        "<#" + settings.logchannelId + ">",
        true
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    const settingsconfirm = await Guild.findOne(
      {
        guildID: message.guild.id,
      },
      (err, guild) => {
        if (err) console.error(err);
        if (guild) {
          return;
        }
      }
    );
    if (settingsconfirm) message.channel.send({ embeds: success });
  },
};
