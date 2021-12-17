const { MessageEmbed } = require("discord.js");

const colors = require("../../configuration/colors.json");

module.exports = {
  name: "dare",
  category: "settings",
  description: "Sets the channel that moderation actions will be logged in.",
  usage: `modlog <#channel>`,
  run: async (client, message, args) => {
    let question =
      client.dares[Math.floor(Math.random() * client.dares.length)];
    const embed = new MessageEmbed()
      .setTitle("Senpai~")
      .setDescription(question)
      .setColor(colors.success);
    message.channel.send(embed);
  },
};
