const Discord = require("discord.js");
const weather = require("weather-js");

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "weather",
  category: "fun",
  description: "Search for the weather in a specified city",
  usage: "weather <city>",
  run: async (client, message, args) => {
    if (message.author.bot) return;

    weather.find(
      { search: args.join(" "), degreeType: "C" },
      function (err, result) {
        // if (err) message.reply(err);
        //  if (result.length === 0) {
        if (err) {
          const errm = new Discord.MessageEmbed()
            .setColor(colors.error)
            .setTitle(configs.missing_title_fun + emojis.Hmm)
            .setDescription(
              emojis.Hmm +
                `Senpai~ Which place am I looking for again? \n Please mention a valid city.`
            )
            .setTimestamp()
            .setFooter("Requested by " + message.member.user.tag);

          message.reply({ embeds: [errm] }).then((msg) => {
            setTimeout(() => msg.delete(), 15000);
          });
          return;
        }

        var current = result[0].current;
        var location = result[0].location;

        var fl = (current.feelslike * 9) / 5 + 32;
        var temp = (current.temperature * 9) / 5 + 32;

        const embed = new Discord.MessageEmbed()

          .setAuthor("Kon'nichiwa senpai~")
          .setDescription(
            emojis.Search +
              " " +
              `Here's the current weather ` +
              emojis.At +
              ` **${current.observationpoint}**!`
          )
          .setTimestamp()
          .setTitle("Currently: *" + current.skytext + "*")
          .setThumbnail(current.imageUrl)
          .setColor(colors.info)
          .setFooter("Requested by " + message.member.user.tag)

          .addField(
            emojis.Cloud + " Timezone",
            "```" + `UTC${location.timezone}` + "```",
            true
          )
          .addField(
            emojis.Cloud + " Temperature",
            "```" + `${current.temperature}C / ` + temp + "F" + "```",
            true
          )
          .addField(
            emojis.Cloud + " Humidity",
            "```" + `${current.humidity}%` + "```",
            true
          )
          .addField(
            emojis.Cloud + " Winds",
            "```" + current.winddisplay + "```",
            true
          )

          .addField(
            emojis.Cloud + " Feels Like",
            "```" + `${current.feelslike}C / ` + fl + "F" + "```",
            true
          );

        message.reply({ embeds: [embed] });
      }
    );
  },
};
