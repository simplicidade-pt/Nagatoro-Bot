const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const configs = require("../../configuration/settings.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "ban",
  category: "moderation",
  description: "Bans a member",
  usage: "ban <@user> <reason>",
  run: async (client, message, args) => {
    if (message.author.bot) return;

    const err = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTimestamp()
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        emojis.Sip +
          `Silly senpai~ you don't have permission to ban members. (**BAN_MEMBERS**)`
      )
      .setFooter("Requested by " + message.member.user.tag);

    if (!message.member.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS))
      return message.reply({ embeds: err }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });

    const server = message.guild.name;
    let member = message.mentions.users.first();
    const invalidmember = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        `Silly senpai~ you need to mention a valid member of this server.`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!member)
      return message
        .reply({
          embeds: [invalidmember],
          allowedMentions: { repliedUser: false },
        })
        .then((msg) => {
          setTimeout(() => msg.delete(), 15000);
        });

    if (member.id == message.author.id) {
      return message.react("❌");
    }

    const bannable = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        `Senpai~ I cannot ban this user, do they have a higher role then me?`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!member.bannable)
      return message.reply({ embeds: [bannable] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided";

    var embed = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle("You've been banned!")
      .setDescription(
        emojis.Hmm +
          " You've been banned from from `" +
          server +
          "` with the reason: ```" +
          reason +
          "```"
      )
      .setTimestamp()
      .setFooter("Responsible moderator: " + message.member.user.tag);

    member.send({ embeds: [embed] });
    await member
      .ban({ reason: "Moderator: " + message.member.user.tag + reason })
      .then(message.react("✅"));

    var logembed = new Discord.MessageEmbed()
      .setColor(colors.log)
      .setTitle(" ➜ Action || Ban")
      .addField("Moderator:", message.member.user.tag, true)
      .addField("Target:", member, true)
      .addField("Channel:", message.channel, true)
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
