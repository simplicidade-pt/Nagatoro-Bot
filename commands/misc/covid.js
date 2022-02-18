const Discord = require("discord.js");

const emojis = require("../../configuration/emojis.json");
const colors = require("../../configuration/colors.json");

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
    .setTitle(emojis.Search + " results for " + args.join(" "))
    .setDescription("Number of cases may differ from other sources")
    .addField("Cases", countrydata.cases, true)
    .addField("Cases Today", countrydata.todayCases, true)
    .addField ("Critical Cases", countrydata.critical, true)
    .addField("Active", countrydata.active, true)
    .addField("Deaths", countrydata.deaths, true)
    .addField("Recovered", countrydata.recovered, true)

    message.reply({ embeds: [embed] });
  },
};
