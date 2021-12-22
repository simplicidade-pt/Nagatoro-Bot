const { MessageEmbed } = require("discord.js");

const colors = require("../../configuration/colors.json");

module.exports = {
  name: "truth",
  category: "tod",
  description: "Truth",
  usage: `truth`,
  run: async (client, message) => {
    let question =
      client.truths[Math.floor(Math.random() * client.truths.length)];
    const embed = new MessageEmbed()
      .setTitle("Senpai~")
      .setDescription(question)
      .setColor(colors.success);
    message.channel.send({ embeds: [embed] });
  },
};
