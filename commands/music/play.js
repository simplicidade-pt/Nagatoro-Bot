const Discord = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
} = require("@discordjs/voice");

const talkedRecently = new Set();

const ytdl = require("discord-ytdl-core");
const youtubeScraper = require("yt-search");
const yt = require("ytdl-core");

const forHumans = require("../../utils/convert.js");
const configs = require("../../configuration/settings.json");

const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "play",
  category: "music",
  description: "Plays a song",
  usage: "play <song>",
  run: async (client, message, args) => {
    if (talkedRecently.has(message.author.id)) {
      const er = new Discord.MessageEmbed()
        .setColor(colors.error)
        .setTitle("Woah there, calm down senpai!")
        .setDescription(
          emojis.Sip +
            "Please wait  ```5 seconds``` before using the command again!"
        )
        .setTimestamp()
        .setFooter(
          configs.prefix +
            "play" +
            " | " +
            "Requested by " +
            message.member.user.tag
        );

      return message.channel.send({ embeds: [er] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });
    } else {
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        talkedRecently.delete(message.author.id);
      }, 5000);
    }

    const channel = message.member.voice.channel;
    const err1 = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription(
        "Senpai~ Seems like there was an error with your request, please try again."
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    const send = (content) => message.channel.send(content);
    const setqueue = (id, obj) => message.client.queue.set(id, obj);
    const deletequeue = (id) => message.client.queue.delete(id);
    var song;

    const errjoin1 = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription(
        "Senpai~ I don't have permission to join the voice channel!"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    const err2 = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription(
        "Senpai~ I cannot play music if you're not in a voice channel!"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!channel)
      return message.channel.send({ embeds: [err2] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });

    if (!channel.permissionsFor(message.client.user).has("CONNECT"))
      return message.channel.send({ embeds: [errjoin1] });

    if (!channel.permissionsFor(message.client.user).has("SPEAK"))
      return message.channel.send({
        content: "I don't have permission to speak in the voice channel!",
      });

    const query = args.join(" ");
    const err4 = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription(
        "Silly senpai~ You didn't provide me a name of a song to play!"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!query)
      return message.channel.send({ embeds: [err4] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });

    const searching = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle("Senpai~ Give me a moment " + emojis.Giggle)
      .setDescription(
        emojis.Search + " **Searching for ** ```" + args.join(" ") + "```"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    message.channel.send({ embeds: [searching] }).then((msg) => {
      setTimeout(() => msg.delete(), 5000);
    });

    if (query.includes("www.youtube.com")) {
      try {
        const ytdata = await await yt.getBasicInfo(query);
        if (!ytdata) return message.channel.send({ embeds: [err1] });
        song = {
          name: ytdata.videoDetails.title,
          thumbnail:
            ytdata.player_response.videoDetails.thumbnail.thumbnails[0].url,
          requested: message.author,
          videoId: ytdata.videoDetails.videoId,
          duration: forHumans(ytdata.videoDetails.lengthSeconds),
          url: ytdata.videoDetails.video_url,
          views: ytdata.videoDetails.viewCount,
        };
      } catch (e) {
        console.log(e);
        return message.channel.send({ embeds: [err1] });
      }
    } else {
      try {
        const fetched = await (await youtubeScraper(query)).videos;
        if (fetched.length === 0 || !fetched)
          return message.channel.send({ embeds: [err1] });
        const data = fetched[0];
        song = {
          name: data.title,
          thumbnail: data.image,
          requested: message.author,
          videoId: data.videoId,
          duration: data.duration.toString(),
          url: data.url,
          views: data.views,
        };
      } catch (err) {
        console.log(err);
        return message.channel.send({ embeds: [err1] });
      }
    }

    var list = message.client.queue.get(message.guild.id);

    if (list) {
      list.queue.push(song);

      let newq = new Discord.MessageEmbed()
        .setTitle(
          "Senpai~ I've added your song to the queue!" + " " + emojis.Greeting
        )
        .setColor(colors.info)
        .setThumbnail(song.thumbnail)
        .addField(
          emojis.Tag + " " + "Requested By",
          "```" + song.requested.tag + " " + "(User)" + "```",
          true
        )
        .addField(
          emojis.Tag + " " + "Views",
          "```" + song.views + " " + "(YouTube)" + "```",
          true
        )
        .addField(
          emojis.Tag + " " + "Duration",
          "```" + song.duration + "```",
          true
        )
        .addField(
          emojis.Tag + " " + "Song Name",
          "```" + song.name + "```",
          true
        )
        .addField(
          emojis.Tag + " " + "Positioned ",
          "```" + list.queue.length + " " + "(In queue)" + "```",
          true
        )
        .setTimestamp()
        .setFooter("Requested by " + message.member.user.tag);

      return send({ embeds: [newq] });
    }

    const structure = {
      channel: message.channel,
      vc: channel,
      volume: 85,
      playing: true,
      queue: [],
      connection: null,
    };

    setqueue(message.guild.id, structure);
    structure.queue.push(song);

    try {
      const join = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.member.guild.id,
        adapterCreator: message.channel.guild.voiceAdapterCreator,
      });
      structure.connection = join;
      //  structure.connection.voice.setSelfDeaf(true);
      play(structure.queue[0]);
    } catch (e) {
      console.log(e);
      deletequeue(message.guild.id);
      return message.channel.send({ embeds: [err1] }); // error("I couldn't join the voice channel, please check console");
    }

    async function play(track) {
      try {
        const data = message.client.queue.get(message.guild.id);
        if (!track) {
          const errempty = new Discord.MessageEmbed()

            .setColor(colors.error)
            .setTitle(configs.err_title_music + " " + emojis.Sip)
            .setDescription(
              "Senpai~ Your queue seems to be empty, I've disconnected from the voice channel!"
            )
            .setTimestamp()
            .setFooter("Requested by " + message.member.user.tag);

          data.channel.send({ embeds: [errempty] });
          getVoiceConnection(message.guild.id).destroy();
          return deletequeue(message.guild.id);
        }

        data.connection.on("disconnect", () => deletequeue(message.guild.id));

        const source = await ytdl(track.url, {
          filter: "audioonly",
          opusEncoded: true,
        });

        const player = createAudioPlayer(source, {
          type: "opus",
          behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
          },
        });

        player.play();

        player.on("finish", () => {
          var removed = data.queue.shift();
          if (data.loop == true) {
            data.queue.push(removed);
          }
          play(data.queue[0]);
        });

        player.on("error", (error) => {
          console.error(
            "Error:",
            error.message,
            "with track",
            error.resource.metadata.title
          );
        });

        let embedplaying = new Discord.MessageEmbed()
          .setTitle("Senpai~ I'm now playing" + " " + emojis.Greeting)
          .setColor(colors.info)
          .setThumbnail(track.thumbnail)
          .addField(
            emojis.Tag + " " + "Requested By",
            "```" + message.member.user.tag + " " + "(User)" + "```",
            true
          )
          .addField(
            emojis.Tag + " " + "Duration",
            "```" + track.duration + "```",
            true
          )
          .addField(
            emojis.Tag + " " + "Views",
            "```" + track.views + " " + "(YouTube)" + "```",
            true
          )
          .addField(
            emojis.Tag + " " + "Song Name",
            "```" + song.name + "```",
            true
          )
          .setTimestamp()
          .setFooter("Requested by " + message.member.user.tag);

        data.channel.send({ embeds: [embedplaying] });
      } catch (e) {
        console.error(e);
      }
    }
  },
};
