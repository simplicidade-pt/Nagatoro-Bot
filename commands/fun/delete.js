const Discord = require("discord.js");
const Canvas = require("canvas");

const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");
const configs = require("../../configuration/settings.json");

module.exports = {
  name: "delete",
  category: "fun",
  description: "Delete a user",
  usage: "delete <@user>",
  run: async (client, message, args) => {
    if (message.author.bot) return;

    let member = message.mentions.users.first();
    const invalidmember = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.missing_title_fun + " " + emojis.Hmm)
      .setDescription(
        "Silly senpai~ you need to mention a valid member of this server."
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!member)
      return message
        .reply({
          embeds: [invalidmember],
          allowedMentions: { repliedUser: false },
        })
        .then((msg) => {
          setTimeout(() => msg.delete(), 15000);
        });

    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext("2d");

    const background = await Canvas.loadImage(
      "https://cdn.discordapp.com/attachments/831022454872211476/851764617423749140/DeleteConfirm.png"
    );
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    const avatar = await Canvas.loadImage(
      message.author.displayAvatarURL({ format: "jpg" })
    );
    context.drawImage(avatar, 170, 70, 150, 150);

    const attachment = new Discord.MessageAttachment(
      canvas.toBuffer(),
      "nagatoro.png"
    );

    message.channel.send({ files: [attachment] });
  },
};
