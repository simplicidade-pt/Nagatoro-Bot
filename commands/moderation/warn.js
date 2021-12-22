const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const configs = require("../../configuration/settings.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "warn",
  category: "moderation",
  description: "Warns a member",
  usage: "warn <@user> <reason>",
  run: async (client, message, args) => {
    if (message.author.bot) return;

    const err = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        emojis.Sip +
          `Silly senpai~ you don't have permission to warn members. (**MANAGE_MESSAGES**)`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
      return message.channel.send({ embeds: err }).then((msg) => {
        setTimeout(() => message.delete(), 15000);
      });

    let server = message.guild.name;
    let dUser = message.guild.members.cache.get(
      message.mentions.users.first().id
    );

    const invalidmember = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        `Silly senpai~ you need to mention a valid member of this server.`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!dUser) return message.channel.send({ embeds: invalidmember });
    let reason = args.join(" ").slice(22);

    var embed = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle("You've recieved a warning!")
      .setDescription(
        emojis.Hmm +
          " You've received a warning from `" +
          server +
          "` with the reason: ```" +
          reason +
          "```"
      )
      .setTimestamp()
      .setFooter("Responsible moderator: " + message.member.user.tag);

    dUser.send({ embeds: embed });

    const suc = new Discord.MessageEmbed()

      .setColor(colors.success)
      .setTitle("Successfully warned!")
      .setDescription(
        "Teehee senpai~ I've successfully warned `" +
          dUser.user.tag +
          "`" +
          " with the reason: ```" +
          reason +
          "```"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    message.channel.send({ embeds: suc });

    const responsable_mod = message.member;
    const channel_occured = message.channel;

    var logembed = new Discord.MessageEmbed()
      .setColor(colors.log)
      .setTimestamp()
      .setAuthor(" ➜ Action || Warn", responsable_mod.user.displayAvatarURL())
      .addField("Moderator:", responsable_mod, true)
      .addField("Target:", dUser, true)
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
    logchannel.send({ embeds: logembed });
  },
};
