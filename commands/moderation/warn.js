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

    if (
      !message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)
    )
      return message.reply({ embeds: [err] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });

    let server = message.guild.name;
    let Target = message.mentions.users.first();

    const invalidmember = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        `Silly senpai~ you need to mention a valid member of this server.`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!Target) return message.reply({ embeds: [invalidmember] });
    
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided";

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

    Target.send({ embeds: [embed] }).catch(console.log)

    const success = new Discord.MessageEmbed()

      .setColor(colors.success)
      .setTitle("Successfully warned!")
      .setDescription(
        "Teehee senpai~ I've successfully warned <@!" +
          Target +
          ">" +
          " with the reason: ```" +
          reason +
          "```"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    message.reply({ embeds: [success] });

    var logEmbed = new Discord.MessageEmbed()
      .setColor(colors.log)
      .setTitle(" ➜ Action || Warn")
      .addField("Moderator:", "<@!" + message.member.user.id + ">", true)
      .addField("Warned:", "<@!" + Target.id + ">", true)
      .addField("Reason:", "```" + reason + "```")
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
    logchannel.send({ embeds: [logEmbed] });
  },
};
