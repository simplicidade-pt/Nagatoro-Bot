const Discord = require("discord.js");
const api = require('covidapi');

const emojis = require("../../configuration/emojis.json");
const colors = require("../../configuration/colors.json");
const configs = require("../../configuration/settings.json");

module.exports = {
  name: "covid",
  category: "misc",
  description: "Shows covid count",
  usage: "covid",
  run: async (client, message, args) => {
    if (message.author.bot) return;

    const specified = args.join(" ")

    if (!args.length) {
        const errm = new Discord.MessageEmbed()
          .setColor(colors.error)
          .setTitle(configs.missing_title_fun + emojis.Hmm)
          .setDescription(
            emojis.Sip +
              "Which countries statistics did you want me to search for again? \n Please mention a valid country to search for silly senpai!"
          )
          .setTimestamp()
          .setFooter("Requested by " + message.member.user.tag);
  
        return message.reply({ embeds: [errm] });
      }

    const data = await api.countries({country: specified})
    const embed = new Discord.MessageEmbed()

    .setColor(colors.info)
    .setTitle(emojis.Search + " results for " + args.join(" ")+ " :globe:")
    .setDescription("Note: Statistics may differ from other sources")
    .addField("Cases", data.cases.toString(), true)
    .addField("Cases Today", data.todayCases.toString(), true)
    .addField ("Critical Cases", data.critical.toString(), true)
    .addField("Active", data.active.toString(), true)
    .addField("Deaths", data.deaths.toString(), true)
    .addField("Recovered", data.recovered.toString(), true)

    message.reply({ embeds: [embed] });
  },
};
