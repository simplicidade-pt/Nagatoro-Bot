const Discord = require("discord.js");
const talkedRecently = new Set();

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "cat",
  category: "Pictures",
  description: "Shows a random image of cats",
  usage: "cat",
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

      return message.channel.send({ embeds: er }).then((msg) => {
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

    const request = require("request");
    request.get(
      "http://thecatapi.com/api/images/get?format=src&type=png",
      {},
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const embed = new Discord.MessageEmbed()

            .setColor(colors.info)
            .setTitle(responsemsg)
            .setDescription(
              "*Didn't appear? " +
                emojis.Arrow +
                " [Click me](" +
                response.request.uri.href +
                ") " +
                emojis.Sip +
                "*"
            )
            .setTimestamp()
            .setFooter("Requested by " + message.member.user.tag)
            .setImage(response.request.uri.href);

          message.channel.send({ embeds: embed });
        } else {
          console.log(error);
        }
      }
    );
  },
};
