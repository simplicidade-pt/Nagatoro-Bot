const Discord = require("discord.js");
const fetch = require("node-fetch");
const ms = require("ms");

const colors = require("../../configuration/colors.json");
const configs = require("../../configuration/settings.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "timeout",
  category: "moderation",
  description: "Timesout a user",
  usage: "Timeout <user> <time> <reason>",
  run: async (client, message, args) => {
    if (message.author.bot) return;

    const noPermission = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        emojis.Sip +
          ` Silly senpai~ you don't have permission to timeout members. (**KICK_MEMBERS**)`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!message.member.permissions.has(Discord.Permissions.FLAGS.KICK_MEMBERS))
      return message.channel.send({ embeds: [noPermission] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });

    const Target = message.mentions.users.first();
    const Time = args[1];

    const noTime = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        "Silly senpai~ You need to specify a time for me to timeout this user! ```n!Timeout <user> <time> <reason>```"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!Time) return message.channel.send({ embeds: [noTime] });

    const noUser = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        " Silly senpai~ You need to mention a user for me to timeout! ```n!Timeout <user> <time> <reason>```"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!Target) return message.channel.send({ embeds: [noUser] });

    const invalidTime = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        "Silly senpai~ You've specified an invalid time, it must be between `10s` and `28d`! ```n!Timeout <user> <time> <reason>```"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    const milliseconds = ms(Time);
    if (!milliseconds || milliseconds < 10000 || milliseconds > 2419200000) {
      return message.channel.send({ embeds: [invalidTime] });
    }

    let reason = args.slice(2).join(" ");
    if (!reason) reason = "No reason provided";

    await fetch(
      `https://discord.com/api/guilds/${message.guild.id}/members/${Target.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          communication_disabled_until: new Date(
            Date.now() + milliseconds
          ).toISOString(),
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bot ${client.token}`,
        },
      }
    );

    const Success = new Discord.MessageEmbed()
      .setColor(colors.success)
      .setTitle("Successfully timeout!")
      .setDescription(
        "Senpai~ I've successfully timeout `" +
          Target.tag +
          "` for `" +
          Time +
          "`" +
          " with the reason: ```" +
          reason +
          "```"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    message.channel.send({ embeds: [Success] });

    const logEmbed = new Discord.MessageEmbed()
      .setColor(colors.log)
      .setTitle(" ➜ Action || Timeout")
      .addField("Moderator:", "```" + message.member.user.tag + "```", true)
      .addField("Target:", "```" + Target.tag + "```", true)
      .addField("Time:", "```" + Time + "```", true)
      .addField("Reason:", "```" + "reason" + "```", true)
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