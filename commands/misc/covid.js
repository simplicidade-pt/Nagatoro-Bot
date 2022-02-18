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
              "Please mention a valid country to search for silly senpai!"
          )
          .setTimestamp()
          .setFooter("Requested by " + message.member.user.tag);
  
        return message.reply({ embeds: [errm] });
      }

    await api.countries({country: specified}).then((body) => {  
    const embed = new Discord.MessageEmbed()

    .setColor(colors.info)
    .setTitle(emojis.Search + " results for " + args.join(" ")+ " :globe:")
    .setDescription("Note: Statistics may differ from other sources")
    .setThumbnail(body.countryInfo.flag)
    .addField("Cases", body.cases, true)
    .addField("Cases Today", body.todayCases, true)
    .addField ("Critical Cases", body.critical, true)
    .addField("Active", body.active, true)
    .addField("Deaths", body.deaths, true)
    .addField("Recovered", body.recovered, true)

    message.reply({ embeds: [embed] });
  });
  },
};
