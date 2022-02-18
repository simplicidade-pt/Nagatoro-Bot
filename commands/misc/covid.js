const Discord = require("discord.js");
const api = require('novelcovid');

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
    .setTitle("Note: Statistics may differ from other sources")
    .setDescription(emojis.Search + " Covid19 statistics " + emojis.At + " " + args.join(" "))
    .setThumbnail(body.countryInfo.flag.toString())
    .addField("Cases", "```" + body.cases.toString() + "```", true)
    .addField("Cases Today", "```" + body.todayCases.toString() + "```", true)
    .addField ("Critical Cases", "```" + body.critical.toString() + "```", true)
    .addField("Active", "```" + body.active.toString() + "```", true)
    .addField("Deaths", "```" + body.deaths.toString() + "```", true)
    .addField("Recovered", "```" + body.recovered.toString() + "```", true)
    .setTimestamp()
    .setFooter("Requested by " + message.member.user.tag);

    console.log(body.countryInfo.flag) 
    console.log(body.cases)
    console.log(body.todayCases)
    console.log(body.active)
    console.log(body.critical)
    console.log(body.deaths)
    console.log(body.recovered)

    message.reply({ embeds: [embed] });
  });
  },
};
