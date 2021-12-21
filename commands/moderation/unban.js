const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const configs = require("../../configuration/settings.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "unban",
  category: "moderation",
  description: "Unbans a member",
  usage: "unban <Id>",
  run: async (client, message, args) => {
    if (message.author.bot) return;

    const err = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        `Silly senpai~ you don't have permission to unban members. (**BAN_MEMBERS**)`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!message.member.permissions.has("BAN_MEMBERS"))
      return message.channel.send({ embed: err }).then((msg) => {
        setTimeout(() => message.delete(), 15000);
      });

    let userID = args[0];

    const invalidmember = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        `Silly senpai~ you need to mention a valid member of this server.`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!userID)
      return message.reply({ embed: invalidmember }).then((msg) => {
        setTimeout(() => message.delete(), 15000);
      });

    message.guild.fetchBans().then((bans) => {
      if (bans.size == 0) return;
      let bUser = bans.find((b) => b.user.id == userID);
      if (!bUser) return;
      message.guild.members.unban(bUser.user);
      message.react("✅");
    });

    const responsable_mod = message.member;
    const channel_occured = message.channel;

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided";

    var logembed = new Discord.MessageEmbed()
      .setColor(colors.log)
      .setTimestamp()
      .setAuthor(" ➜ Action || Unban", responsable_mod.user.displayAvatarURL())
      .addField("Moderator:", responsable_mod, true)
      .addField("Target:", "<@!" + userID + ">", true)
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
    logchannel.send({ embed: logembed });
  },
};
