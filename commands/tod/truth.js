const { MessageEmbed } = require("discord.js");

const colors = require("../../configuration/colors.json");

module.exports = {
  name: "truth",
  category: "settings",
  description: "Sets the channel that moderation actions will be logged in.",
  usage: `modlog <#channel>`,
  run: async (client, message) => {
    let question =
      client.truths[Math.floor(Math.random() * client.truths.length)];
    const embed = new MessageEmbed()
      .setTitle("Senpai~")
      .setDescription(question)
      .setColor(colors.success);
    message.channel.send({ embed: embed });
  },
};
