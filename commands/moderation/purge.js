const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const configs = require("../../configuration/settings.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "purge",
  category: "moderation",
  description: "Purges messages",
  usage: "purge <amount>",
  run: async (client, message, args) => {
    if (message.author.bot) return;

    const err = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        `Silly senpai~ you don't have permission to purge messages. (**MANAGE_MESSAGES**)`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    const err1 = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        `Silly senpai~ you need to mention an amount of messages to delete.`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (
      !message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)
    )
      return message.reply({ embeds: [err] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });

    const deleteCount = parseInt(args[0], 10);
    if (!deleteCount || deleteCount < 1 || deleteCount > 1000)
      return message.reply({ embeds: [err1] });

    message.delete().then(
      message.channel.bulkDelete(deleteCount).catch((error) =>
        message.reply({
          content: "Couldn't delete messages because of: " + error,
          allowedMentions: { repliedUser: false },
        })
      )
    );

    var logembed = new Discord.MessageEmbed()
      .setColor(colors.log)
      .setTitle(" ➜ Action || Purge")
      .addField("Moderator:", message.member.user.tag.toString(), true)
      .addField("Channel:", message.channel.toString(), true)
      .addField("Amount:", "```" + deleteCount.toString() + "```", true)
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
