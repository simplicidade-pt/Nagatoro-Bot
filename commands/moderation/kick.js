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

    if (!message.member.permissions.has(Discord.Permissions.FLAGS.KICK_MEMBERS))
      return message.reply({ embeds: [err] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });

    const server = message.guild.name;
    let Target = message.mentions.users.first();

    const invalidmember = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        `Silly senpai~ you need to mention a valid member of this server.`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!Target)
      return message
        .reply({
          embeds: [invalidmember],
          allowedMentions: { repliedUser: false },
        })
        .then((msg) => {
          setTimeout(() => msg.delete(), 15000);
        });

        const kickSelf = new Discord.MessageEmbed()
        .setColor(colors.error)
        .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
        .setDescription(
          "Sorry senpai~ You can't kick yourself!"
        )
        .setTimestamp()
        .setFooter("Requested by " + message.member.user.tag);
  
    if (Target.id == message.author.id) return message.reply({ embeds: [kickSelf] })

    let reason = args.slice(1).join(" ");
    const maxLength = new Discord.MessageEmbed()
    .setColor(colors.error)
    .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
    .setDescription(
      "Sorry senpai~ Please make sure your reason is below `512` characters!"
    )
    .setTimestamp()
    .setFooter("Requested by " + message.member.user.tag);
  if (reason.length > 512) return message.reply({ embeds: [maxLength] })
  if (!reason) reason = "No reason was provided.";

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

      Target.send({ embeds: [kickmsg] });
      Target.kick("Moderator: " + message.member.user.tag + " / Reason: " + reason);

    // message.react("✅");

    var logEmbed = new Discord.MessageEmbed()
      .setColor(colors.log)
      .setTitle(" ➜ Action || Kick")
      .addField("Moderator:", message.member.user.tag, true)
      .addField("Target:", "<@!" + Target.id + ">", true)
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
    logchannel.send({ embeds: [logEmbed] });
  },
};
