const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");
const configs = require("../../configuration/settings.json");

const successemoji = "✅";

module.exports = {
  name: "removevc",
  category: "moderation",
  description: "Removes the person from voice chat",
  usage: "removevc <@user>",
  run: async (client, message, args) => {
    const err = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTimestamp()
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setFooter("Requested by " + message.member.user.tag)
      .setDescription(
        `Silly senpai~ you don't have permission to remove users from voice channels. (**MOVE_MEMBERS**)`
      );

    if (!message.member.permissions.has(Discord.Permissions.FLAGS.MOVE_MEMBERS))
      return message.channel.reply({ embeds: [err] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });

    const err1 = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        `Silly senpai~ you need to mention a valid member of this server.`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    const member = message.mentions.users.first();
    if (!member)
      return message.channel.reply({ embeds: [err1] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided";

    const err2 = new Discord.MessageEmbed()

      .setColor("#ff4757")
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(`Silly senpai~ That user/bot isn't in a voice channel.`)
      .setFooter("Requested by " + message.member.user.tag)
      .setTimestamp();

    // message.guild.voiceStates.cache.get(member.id)

    if (!message.guild.voiceStates.cache.get(member.id))
      return message.channel.reply({ embeds: [err2] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });

    message.guild.voiceStates.cache
      .get(member.id)
      .voice.kick()
      .then((member) =>
        message.channel.reply(`${member}`)
      )
      .catch(console.error);
    message.react(successemoji);

    const responsable_mod = message.member.user.tag;
    const channel_occured = message.channel;

    var logembed = new Discord.MessageEmbed()
      .setColor(colors.log)
      .setTitle(" ➜ Action || VC Removal")
      .addField("Moderator:", responsable_mod, true)
      .addField("Target:", member, true)
      .addField("Channel:", channel_occured, true)
      .addField("Reason:", "```" + reason + "```", true)
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
    logchannel.reply({ embeds: [logembed] });
  },
};
