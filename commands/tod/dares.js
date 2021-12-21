const { MessageEmbed } = require("discord.js");

const colors = require("../../configuration/colors.json");

module.exports = {
  name: "dare",
  category: "tod",
  description: "Dare",
  usage: `dare`,
  run: async (client, message, args) => {
    let question =
      client.dares[Math.floor(Math.random() * client.dares.length)];
    const embed = new MessageEmbed()
      .setTitle("Senpai~")
      .setDescription(question)
      .setColor(colors.success);
    message.channel.send({ embeds: [embed] });
  },
};
