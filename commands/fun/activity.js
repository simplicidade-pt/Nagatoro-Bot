const Discord = require("discord.js");

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

const fetch = require("node-fetch");

module.exports = {
  name: "activity",
  category: "settings",
  description: "Start an activity",
  usage: "activity <activity_name>",
  run: async (client, message, args) => {
    const ACTIVITIES = {
      poker: {
        id: "755827207812677713",
        name: "Poker Night",
      },
      betrayal: {
        id: "773336526917861400",
        name: "Betrayal.io",
      },
      youtube: {
        id: "755600276941176913",
        name: "YouTube Together",
      },
      fishington: {
        id: "814288819477020702",
        name: "Fishington.io",
      },
    };

    const channel = message.member.voice.channel;
    const err0 = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription(
        "Senpai~ You need to be in a voice channel to use this command!"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!message.member.voice.channel) {
      return message.member.reply({ embeds: [err0] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });
    }

    const err1 = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription("Senpai~ I need `CREATE_INSTANT_INVITE` permission")
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE"))
      return message.member.reply({ embeds: [err1] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });

    const success0 = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription(
        "Silly senpai~ that's not how it works, usage: ```" +
          configs.prefix +
          "activity <activity>" +
          "```"
      )
      .addField("Poker", "```Play Poker with friends, a card game.```", true)
      .addField(
        "Betrayal",
        "```Play Betrayal.io with friends, an Among us Inspired game.```",
        true
      )
      .addField(
        "Fishington.io",
        "```Play Fishington with friends, a fishing game.```",
        true
      )
      .setFooter("Requested by " + message.member.user.tag)
      .setTimestamp()
      .addField(
        "YouTube",
        "```Watch YouTube Together with your friends.```",
        true
      );

    const activity = ACTIVITIES[args[0] ? args[0].toLowerCase() : null];
    if (!activity) return message.member.reply({ embeds: [success0] });

    /* return message.member.reply(
        `❌ | Correct formats:\n${Object.keys(ACTIVITIES)
          .map(m => `- **${"n?"}activity ${m}**`)
          .join("\n")}`
      );
      */

    const err3 = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription(
        "Senpai~ That was unexpected, I could not start " + activity.name
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
      method: "POST",
      body: JSON.stringify({
        max_age: 86400,
        max_uses: 0,
        target_application_id: activity.id,
        target_type: 2,
        temporary: false,
        validate: null,
      }),
      headers: {
        Authorization: `Bot ${client.token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((invite) => {
        if (invite.error || !invite.code)
          return message.member.reply({ embeds: [err3] }).then((msg) => {
            setTimeout(() => msg.delete(), 15000);
          });

        const success1 = new Discord.MessageEmbed()

          .setColor(colors.success)
          .setTitle("Started Activity " + emojis.Giggle)
          .setDescription(
            "**Senpai~ I've successfully started** `" +
              activity.name +
              "` **in** `" +
              channel.name +
              "` \n" +
              `||<https://discord.gg/${invite.code}>||`
          )
          .setURL(`https://discord.gg/${invite.code}`)
          .setTimestamp()
          .setFooter("Requested by " + message.member.user.tag);

        message.member.reply({ embeds: [success1] });
      })
      .catch((e) => {
        message.member.reply({ embeds: [err3] });
      });
  },
};
