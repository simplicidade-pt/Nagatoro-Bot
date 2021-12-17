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

    if (!message.member.hasPermission("MANAGE_GUILD"))
      return message.channel.send({ embed: err }).then((msg) => {
        msg.delete({ timeout: 15000 });
      });

    const settings = await Guild.findOne(
      {
        guildID: message.guild.id,
      },
      (err, guild) => {
        if (err) console.error(err);
        if (!guild) {
          message.channel.send(err);
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
        "<#" + settings.welcomeChannelID + ">",
        true
      )
      .addField(
        emojis.Tag + " Moderation Logs",
        "<#" + settings.logChannelID + ">",
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
    if (settingsconfirm) message.channel.send({ embed: success });
  },
};
