const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");
const configs = require("../../configuration/settings.json");

module.exports = {
  name: "kick",
  category: "moderation",
  description: "Kicks a member",
  usage: "kick <@user> <reason>",
  run: async (client, message, args) => {
    if (message.author.bot) return;

    const err = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        emojis.Sip +
          ` Silly senpai~ you don't have permission to kick members. (**KICK_MEMBERS**)`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!message.member.hasPermission("KICK_MEMBERS"))
      return message.channel.send({ embed: err }).then((msg) => {
        msg.delete({ timeout: 15000 });
      });

    const server = message.guild.name;
    let member = message.guild.member(message.mentions.users.first());

    const invalidmember = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        `Silly senpai~ you need to mention a valid member of this server.`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!member)
      return message.reply({ embed: invalidmember }).then((msg) => {
        msg.delete({ timeout: 15000 });
      });

    if (member.id == message.author.id) {
      return message.react("❌");
    }

    const kickable = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setTimestamp()
      .setDescription(`Senpai~ I cannot kick this user. ` + emojis.Sip)
      .setFooter("Requested by " + message.member.user.tag);

    if (!member.kickable)
      return message.channel.send({ embed: kickable }).then((msg) => {
        msg.delete({ timeout: 15000 });
      });

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided";

    const kickmsg = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle("You've been kicked!")
      .setDescription(
        emojis.Hmm +
          " You've been kicked from from `" +
          server +
          "` with the reason: ```" +
          reason +
          "```"
      )
      .setTimestamp()
      .setFooter("Responsible moderator: " + message.member.user.tag);

    member.send({ embed: kickmsg });
    await member.kick("Moderator: " + message.member.user.tag + reason);

    // message.react("✅");

    const responsable_mod = message.member;
    const channel_occured = message.channel;

    var logembed = new Discord.MessageEmbed()
      .setColor(colors.log)
      .setTimestamp()
      .setAuthor(" ➜ Action || Kick", responsable_mod.user.displayAvatarURL())
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

    let logchannel = message.guild.channels.cache.get(settings.logChannelID);
    logchannel.send({ embed: logembed });
  },
};
