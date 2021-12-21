const request = require("request");
const Discord = require("discord.js");

const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "dog",
  category: "Pictures",
  description: "Shows a random image of dogs",
  usage: "dog",
  run: async (client, message) => {
    if (message.author.bot) return;

    if (talkedRecently.has(message.author.id)) {
      const er = new Discord.MessageEmbed()
        .setColor(colors.error)
        .setTitle(configs.cooldown)
        .setDescription(
          emojis.Sip +
            "**Please wait ** `10 seconds` ** before using the command again!**"
        )
        .setTimestamp()
        .setFooter("Requested by " + message.member.user.tag);

      return message.channel.send({ embed: er }).then((msg) => {
        setTimeout(() => message.delete(), 15000);
      });
    } else {
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        talkedRecently.delete(message.author.id);
      }, 10000);
    }

    let msg = [
      "All yours, senpai~",
      "Here you go senpai~",
      "Teehee~",
      "Woah there, senpai~",
      "Senpai~",
      "Marvellous choice, senpai~",
      "I've got you covered, senpai~",
      "Hope you enjoy, senpai~",
    ];

    let responsemsg = msg[Math.floor(Math.random() * msg.length)];

    try {
      request(
        { json: true, url: "https://random.dog/woof.json" },
        (err, res, json) => {
          if (err) {
            message.reply("There was an error!");
          } else {
            const embed = new Discord.MessageEmbed()

              .setColor(colors.info)
              .setTitle(responsemsg)
              .setDescription(
                "*Didn't appear? " +
                  emojis.Arrow +
                  " [Click me](" +
                  json.url +
                  ") " +
                  emojis.Sip +
                  "*"
              )
              .setTimestamp()
              .setFooter("Requested by " + message.member.user.tag)
              .setImage(json.url);

            message.channel.send({ embed: embed });
          }
        }
      );
    } catch (err) {
      message.channel.send("There was an error!\n" + err).catch();
    }
  },
};
