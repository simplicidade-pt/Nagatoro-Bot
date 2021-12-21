const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const configs = require("../../configuration/settings.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "createchannel",
  category: "moderation",
  description: "Creates a channel",
  usage: "createchannel <type> <name>",
  run: async (client, message, args, level) => {
    if (message.author.bot) return;
    const err = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTimestamp()
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        emojis.Sip +
          `Silly senpai~ you don't have permission to create channels. (**MUTE_MEMBERS**)`
      )
      .setFooter("Requested by " + message.member.user.tag);

    if (!message.member.permissions.has("MUTE_MEMBERS"))
      return message.channel.send({ embed: err }).then((msg) => {
        setTimeout(() => message.delete(), 15000);
      });

    try {
      const errname = new Discord.MessageEmbed()

        .setColor(colors.error)
        .setTimestamp()
        .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
        .setDescription(
          emojis.Sip +
            "** Senpai~ you need to specify a name for the channel!** ```Usage: n!createchannel <voice,text> <name>```"
        )
        .setFooter("Requested by " + message.member.user.tag);

      const errtype = new Discord.MessageEmbed()

        .setColor(colors.error)
        .setTimestamp()
        .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
        .setDescription(
          emojis.Sip +
            "** Senpai~ you need to specify a channel type!** ```Usage: n!createchannel <voice,text> <name>```"
        )
        .setFooter("Requested by " + message.member.user.tag);

      if (!args[1])
        return message.channel.send({ embed: errname }).then((msg) => {
          setTimeout(() => message.delete(), 15000);
        });

      if (!args[0])
        return message.channel.send({ embed: errtype }).then((msg) => {
          setTimeout(() => message.delete(), 15000);
        });

      let success = new Discord.MessageEmbed()
        .setColor(colors.success)
        .setTitle("Successfully created channel")
        .setDescription(
          "Senpai! I've successfully created a `" +
            args[0] +
            "` channel with the name of `" +
            args[1] +
            "`!"
        )
        .setTimestamp()
        .setFooter("Requested by " + message.member.user.tag);

      message.channel.send({ embed: success }).then(() => {
        message.guild.channels
          .create(args[1], {
            type: args[0],
            permissionOverwriteArray: "SEND_MESSAGES",
            reason: "Moderator: " + message.member.user.tag,
          })
          .catch((err) => {
            message.channel.send({
              content: "Whoops, seems like there was an error!",
            });
          });
      });

      let responsable_mod = message.member;

      var logembed = new Discord.MessageEmbed()
        .setColor(colors.log)
        .setTimestamp()
        .setAuthor(
          " ➜ Action || Create Channel",
          responsable_mod.user.displayAvatarURL()
        )
        .addField("Moderator:", responsable_mod, true)
        .addField("Channel Name:", "```" + "#" + args[1] + "```", true)
        .addField("Channel Type: ", "```" + args[0] + "```", true)
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
    } catch (err) {
      message.channel.send("There was an error!\n" + err).catch();
    }
  },
};
