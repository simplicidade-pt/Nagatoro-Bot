const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const configs = require("../../configuration/settings.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "pin",
  category: "fun",
  description: "Pin a message",
  usage: "pin <message>",
  run: async (client, message, args) => {
    if (message.author.bot) return;

    const err = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTimestamp()
      .setTitle(configs.missing_title_moderation + " " + emojis.Sip)
      .setDescription(
        "Silly senpai~ you don't have permission to pin messages. (**MANAGE_MESSAGES**) " +
          emojis.Hmm
      );

    if (
      !message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)
    )
      return message.reply({ embeds: [err] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });

    const text = args.slice(0).join(" ");

    const errm = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle(configs.missing_title_fun + emojis.Sip)
      .setDescription(
        emojis.Hmm + " Senpai~ What message did you want me to pin again?"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!args.length)
      return message.reply({ embeds: [errm] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });

    // message.delete();

    const pinnedembed = new Discord.MessageEmbed()
      .setColor(colors.success)
      .setTitle(":pushpin: Pinned Message")
      .setDescription(text)
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    message.reply({ embeds: [pinnedembed] }).then((msg) => msg.pin());

    var logembed = new Discord.MessageEmbed()
      .setColor(colors.log)
      .setTitle(" ➜ Action || Pin")      
      .addField("Moderator:", message.member.user.tag, true)
      .addField("Channel:", message.channel, true)
      .addField("Message:", "```" + text + "```", true)
      .setTimestamp();

    const Guild = require("../../models/guild");
    const settings = await Guild.findOne(
      {
        guildID: message.guild.id,
      },
      (err, guild) => {
        if (err) return console.error(err);
        if (guild) {
          console.log(guild);
        }
      }
    );

    let logchannel = message.guild.channels.cache.get(settings.logchannelId);
    logchannel.send({ embeds: [logembed] });
  },
};
