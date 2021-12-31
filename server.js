require("http")
  .createServer(async (req, res) => {
    res.statusCode = 200;
    // res.write("welcome");
    res.end();
  })
  .listen(3000, () => console.log("Now listening on port 3000"));

const configs = require("./configuration/settings.json");
const colors = require("./configuration/colors.json");
const emojis = require("./configuration/emojis.json");

const prefix = configs.prefix;

const Discord = require("discord.js");

const { Collection } = require("discord.js");
const { config } = require("dotenv");

const client = new Discord.Client({
  ws: { properties: { $browser: "Discord iOS" } },
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
  ],
  allowedMentions: { parse: ["users", "roles"], repliedUser: true },
});
module.exports = client;

client.mongoose = require("./utils/mongoose");
client.on("ready", () => {
  console.log("Online!");

  client.user.setStatus("available");
  client.queue = new Map();
  client.emojis_status = new Array();

  function getemoji(input) {
    let remaining = "";
    input.on("data", (data) => {
      remaining += data;
      let index = remaining.indexOf("\n");
      while (index > -1) {
        let line = remaining.substring(0, index);
        remaining = remaining.substring(index + 1);
        index = remaining.indexOf("\n");
        client.emojis_status.push(line);
      }
    });
  }

  getemoji(createReadStream("files/emojis.txt"));
  setInterval(function () {
    let statuses = [`nibbling on `];
    let status = statuses[Math.floor(Math.random() * statuses.length)];
    let selectedemoji =
      client.emojis_status[
        Math.floor(Math.random() * client.emojis_status.length)
      ];

    client.user.setPresence({
      activities: [{ name: status + " " + selectedemoji }],
      status: "available",
      url: "https://www.twitch.tv/scxipted",
    });
  }, 30000);
});

// Collections
client.commands = new Collection();
client.aliases = new Collection();

config({
  path: __dirname + "/.env",
});

// Run the command loader
["command"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

let ops = {
  active: {},
};

// Truth or dare
const { createReadStream } = require("fs");

client.truths = new Array();
client.dares = new Array();

function readtruths(input) {
  let remaining = "";
  input.on("data", (data) => {
    remaining += data;
    let index = remaining.indexOf("\n");
    while (index > -1) {
      let line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      index = remaining.indexOf("\n");
      client.truths.push(line);
    }
  });
}

function readdares(input) {
  let remaining = "";
  input.on("data", (data) => {
    remaining += data;
    let index = remaining.indexOf("\n");
    while (index > -1) {
      let line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      index = remaining.indexOf("\n");
      client.dares.push(line);
    }
  });
}

readtruths(createReadStream("./files/truths.txt"));
readdares(createReadStream("./files/dares.txt"));

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  if (
    !message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)
  ) {
    message.reply({
      content:
        'Senpai~ I need the "Embed messages" permissions to work properly, please contact your servers administrators!',
    });
  }

  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if (command) command.run(client, message, args, ops);

  function isCommand(command, message) {
    var command = command.toLowerCase();
    var content = message.content.toLowerCase();
    return content.startsWith(prefix + command);
  }

  process.setMaxListeners(0);

  if (isCommand("help", message)) {
    const embed = new Discord.MessageEmbed()

      .setColor(colors.info)
      .setTitle("Server:" + " " + message.guild.name + " " + emojis.Verified)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setDescription("ㅤ")
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag)

      .addField(
        emojis.Giggle +
          "*Teehee senpai~* My prefix for this server is " +
          "`" +
          configs.prefix +
          "`",
        '*Only server moderators are able to use and view commands in the "Moderation" category.*'
      )

      .addField("ㅤ", emojis.Hah + " __**Public Commands:**__")

      .addField(
        emojis.Tag + "**" + " | Entertainment" + "**",
        "```" + configs.prefix + "cmds entertainment```",
        true
      )

      .addField(
        emojis.Tag + "**" + " | Miscellaneous" + "**",
        "```" + configs.prefix + "cmds miscellaneous```",
        true
      )

      .addField(
        emojis.Tag + "**" + " | Pictures" + "**",
        "```" + configs.prefix + "cmds pictures```",
        true
      )

      .addField(
        emojis.Tag + "**" + " | Activity" + "**",
        "```" + configs.prefix + "cmds activity```",
        true
      )

      .addField(
        emojis.Tag + "**" + " | Emotes" + "**",
        "```" + configs.prefix + "cmds emotes```",
        true
      )

      .addField(
        emojis.Tag + "**" + " | Music" + "**",
        "```" + configs.prefix + "cmds music```",
        true
      )

      .addField("ㅤ", emojis.Hah + " __**Moderator Commands:**__")

      .addField(
        emojis.Tag + "**" + " | Moderation" + "**",
        "```" + configs.prefix + "cmds moderation```",
        true
      );

    message.reply({ embeds: [embed] });
  }

  if (isCommand("cmds entertainment", message)) {
    let embed = new Discord.MessageEmbed()

      .setColor(colors.info)
      .setTitle(message.guild.name + " " + emojis.Arrow + " Fun")
      .setDescription("ㅤ")
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter("Requested by " + message.member.user.tag)

      .addField(
        emojis.Giggle + " Everyone is able to use commands in this category.",
        "Public category"
      )
      .addField("ㅤ", emojis.Hah + " __**Available Commands:**__")

      .addField(
        emojis.One + "**" + " | Ask" + "**",
        "```" + prefix + "ask```",
        true
      )

      .addField(
        emojis.Two + "**" + " | Avatar" + "**",
        "```" + prefix + "Avatar```",
        true
      )

      .addField(
        emojis.Three + "**" + " | Emojify" + "**",
        "```" + prefix + "emojify```",
        true
      )

      .addField(
        emojis.Four + "**" + " | Love" + "**",
        "```" + prefix + "love```",
        true
      )

      .addField(
        emojis.Five + "**" + "  | Rps" + "**",
        "```" + prefix + "rps```",
        true
      )

      .addField(
        emojis.Six + "**" + " | Smart" + "**",
        "```" + prefix + "smart```",
        true
      )

      .addField(
        emojis.Seven + "**" + " | Anime" + "**",
        "```" + prefix + "anime```",
        true
      )

      .addField(
        emojis.Eight + "**" + " | Wiki" + "**",
        "```" + prefix + "wiki```",
        true
      )

      .addField(
        emojis.Nine + "**" + " | Weather" + "**",
        "```" + prefix + "weather```",
        true
      )

      .addField(
        emojis.One + emojis.Zero + "**" + " | Delete" + "**",
        "```" + prefix + "delete```",
        true
      )

      .addField(
        emojis.One + emojis.One + "**" + " | Delete" + "**",
        "```" + prefix + "truth```",
        true
      )

      .addField(
        emojis.One + emojis.Two + "**" + " | Delete" + "**",
        "```" + prefix + "dare```",
        true
      );

    message.reply({ embeds: [embed] });
  }

  if (isCommand("cmds music", message)) {
    let embed = new Discord.MessageEmbed()

      .setColor(colors.info)
      .setTitle(message.guild.name + " " + emojis.Arrow + " Music")
      .setDescription("ㅤ")
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter("Requested by " + message.member.user.tag)

      .addField(
        emojis.Giggle + " Everyone is able to use commands in this category.",
        "Public category"
      )

      .addField("ㅤ", emojis.Hah + " __**Available Commands:**__")

      .addField(
        emojis.One + "**" + " | Play" + "**",
        "```" + prefix + "play```",
        true
      )

      .addField(
        emojis.Two + "**" + " | Pause" + "**",
        "```" + prefix + "pause```",
        true
      )

      .addField(
        emojis.Three + "**" + " | Resume" + "**",
        "```" + prefix + "resume```",
        true
      )

      .addField(
        emojis.Four + "**" + " | Skip" + "**",
        "```" + prefix + "skip```",
        true
      )

      .addField(
        emojis.Five + "**" + " | Queue" + "**",
        "```" + prefix + "queue```",
        true
      )

      .addField(
        emojis.Six + "**" + " | Lyrics" + "**",
        "```" + prefix + "lyrics```",
        true
      )

      .addField(
        emojis.Seven + "**" + " | Loop" + "**",
        "```" + prefix + "loop```",
        true
      )

      .addField(
        emojis.Eight + "**" + " | NowPlaying" + "**",
        "```" + prefix + "nowplaying```",
        true
      );

    message.reply({ embeds: [embed] });
  }

  if (isCommand("cmds moderation", message)) {
    let embed = new Discord.MessageEmbed()

      .setColor(colors.info)
      .setTitle(message.guild.name + " " + emojis.Arrow + " Moderation")
      .setDescription("ㅤ")
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter("Requested by " + message.member.user.tag)

      .addField(
        emojis.Giggle +
          " Only server moderators are able to use commands in this category, permission required is specified on usage (If lacking permission).",
        "Use `" + prefix + "modlog` to set a logs channel."
      )

      .addField("ㅤ", emojis.Hah + " __**Moderation Commands:**__")

      .addField(
        emojis.One + "**" + " | Ban" + "**",
        "```" + prefix + "ban```",
        true
      )

      .addField(
        emojis.Two + "**" + " | Unban" + "**",
        "```" + prefix + "unban```",
        true
      )

      .addField(
        emojis.Three + "**" + " | Kick" + "**",
        "```" + prefix + "kick```",
        true
      )

      .addField(
        emojis.Four + "**" + " | Purge" + "**",
        "```" + prefix + "purge```",
        true
      )

      .addField(
        emojis.Five + "**" + " | Removevc" + "**",
        "```" + prefix + "removevc```",
        true
      )

      .addField(
        emojis.Six + "**" + "  | Warn" + "**",
        "```" + prefix + "warn```",
        true
      )

      .addField(
        emojis.Seven + "**" + " | Pin" + "**",
        "```" + prefix + "pin```",
        true
      )

      .addField(
        emojis.Eight + "**" + " | TimeOut" + "**",
        "```" + prefix + "timeout```",
        true
      )

      .addField("ㅤ", emojis.Hah + " __**Logging Commands:**__")

      .addField(
        emojis.One + "**" + " | Modlog" + "**",
        "```" + prefix + "modlog```",
        true
      )
      .addField(
        emojis.Two + "**" + " | Welcomelog" + "**",
        "```" + prefix + "welcomelog```",
        true
      )
      .addField(
        emojis.Three + "**" + " | Overview" + "**",
        "```" + prefix + "overview```",
        true
      );

    message.reply({ embeds: [embed] });
  }

  if (isCommand("cmds activity", message)) {
    let embed = new Discord.MessageEmbed()

      .setColor(colors.info)
      .setTitle(message.guild.name + " " + emojis.Arrow + " Activity")
      .setDescription("ㅤ")
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter("Requested by " + message.member.user.tag)
      .addField(
        "Activities is part of a new set of Discord features called activities. Activities can be started in voice channels, to enjoy entertaining games with your friends in sync!",
        "*YouTube Together, Poker Night, Fishington.io, Betrayal.io*"
      )
      .addField("ㅤ", emojis.Hah + " __**Usage:**__")

      .addField(
        emojis.Tag + " Simply join a voice channel of your choice.",
        "ㅤ"
      )

      .addField(
        emojis.Tag +
          " Once you're in a voice channel, use the `" +
          configs.prefix +
          "activity` command to view all available activities.",
        ""
      )

      .addField(
        emojis.Tag +
          " After choosing an available activity from the list, use the `" +
          configs.prefix +
          "activity <activity_name>` command to generate an invite for the chosen activity.",
        ""
      )

      .addField(
        emojis.Tag +
          " Shortly, an activity invite for the chosen activity will be sent in the channel for you and all of your friends to join!",
        ""
      );

    message.reply({ embeds: [embed] });
  }

  if (isCommand("cmds pictures", message)) {
    let embed = new Discord.MessageEmbed()

      .setColor(colors.info)
      .setTitle(message.guild.name + " " + emojis.Arrow + " Pictures")
      .setDescription("ㅤ")
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter("Requested by " + message.member.user.tag)

      .addField(
        emojis.Giggle + " Everyone is able to use commands in this category.",
        "Public category"
      )

      .addField("ㅤ", emojis.Hah + " __**Available Commands:**__")

      .addField(emojis.One + "**" + " | Cat" + "**", "```" + prefix + "cat```")

      .addField(emojis.Two + "**" + " | Dog" + "**", "```" + prefix + "dog```")

      .addField(
        emojis.Three + "**" + " | Food" + "**",
        "```" + prefix + "food```"
      )

      .addField(
        emojis.Four + "**" + " | Meme" + "**",
        "```" + prefix + "meme```"
      );

    message.reply({ embeds: [embed] });
  }

  if (isCommand("cmds miscellaneous", message)) {
    let embed = new Discord.MessageEmbed()

      .setColor(colors.info)
      .setTitle(message.guild.name + " " + emojis.Arrow + " Miscellaneous")
      .setDescription("ㅤ")
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter("Requested by " + message.member.user.tag)

      .addField(
        emojis.Giggle + " Everyone is able to use commands in this category.",
        "Public category"
      )
      .addField("ㅤ", emojis.Hah + " __**Available Commands:**__")

      .addField(
        emojis.One + "**" + " | Ping" + "**",
        "```" + prefix + "ping```",
        true
      )

      .addField(
        emojis.Two + "**" + " | Userinfo" + "**",
        "```" + prefix + "userinfo```",
        true
      )

      .addField(
        emojis.Three + "**" + " | Serverinfo" + "**",
        "```" + prefix + "serverinfo```",
        true
      )

      .addField(
        emojis.Four + "**" + " | Membercount" + "**",
        "```" + prefix + "Membercount```",
        true
      );

    message.reply({ embeds: [embed] });
  }

  if (isCommand("cmds emotes", message)) {
    let embed = new Discord.MessageEmbed()

      .setColor(colors.info)
      .setTitle(message.guild.name + " " + emojis.Arrow + " Emotes")
      .setDescription("ㅤ")
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter("Requested by " + message.member.user.tag)

      .addField(
        emojis.Giggle + " Everyone is able to use commands in this category.",
        "Public category"
      )

      .addField("ㅤ", emojis.Hah + " __**Available Commands:**__")

      .addField(
        emojis.One + "**" + " | Hug" + "**",
        "```" + prefix + "hug```",
        true
      )

      .addField(
        emojis.Two + "**" + " | Kiss" + "**",
        "```" + prefix + "kiss```",
        true
      )

      .addField(
        emojis.Three + "**" + " | Slap" + "**",
        "```" + prefix + "slap```",
        true
      )

      .addField(
        emojis.Four + "**" + " | Dance" + "**",
        "```" + prefix + "dance```",
        true
      )

      .addField(
        emojis.Five + "**" + "  | Annoy" + "**",
        "```" + prefix + "annoy```",
        true
      )

      .addField(
        emojis.Six + "**" + "  | Pat" + "**",
        "```" + prefix + "pat```",
        true
      );

    message.reply({ embeds: [embed] });
  }
});

client.on("guildMemberAdd", async (member) => {
  const Guild = require("./models/guild");
  const settings = await Guild.findOne(
    {
      guildID: member.guild.id,
    },
    (err, guild) => {
      if (err) return console.error(err);
      if (!guild) {
        return;
      }
    }
  );

  if (!settings) return;

  const { CanvasSenpai } = require("canvas-senpai");
  const canva = new CanvasSenpai();
  let data = await canva.welcome(member, {
    link: "https://cdn.discordapp.com/attachments/831022454872211476/850516466977603604/Backgrounddddd.png",
  });

  const attachment = new Discord.MessageAttachment(data, "welcome-image.png");

  let welcomechannel = member.guild.channels.cache.get(
    settings.welcomeChannelID
  );

  welcomechannel.send(
    "Welcome " +
      "<@" +
      member +
      ">, " +
      " to " +
      "**" +
      member.guild.name +
      "** " +
      emojis.Greeting
  );
  welcomechannel.send(attachment);
});

client.mongoose.init();
client.login(process.env.token);