const Discord = require("discord.js");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping", 
  description: "Gives you information on how fast the Bot is", 
  cooldown: 1,
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],
  options: [
		// {"StringChoices": { name: "ping", description: "test", required: true, choices: ["ping"]}}
  ],
  run: async (client, interaction) => {
    try{
		const { member, channelId, guildId, applicationId, 
		        commandName, deferred, replied, ephemeral, 
				options, id, createdTimestamp 
		} = interaction; 
		const { guild } = member;
			await interaction.reply({content: `test`, ephemeral: true});
      interaction.editReply({embeds: [new MessageEmbed()
        .setColor(colors.info)
        .setTitle("Pong! :ping_pong:")
        .setDescription(
          `**Time took:** __**${
            Date.now() - message.createdTimestamp
          }**__ **ms**` + emojis.Hype
        )
        .setTimestamp()
    ]});
    } catch (e) {
        console.log(String(e.stack))
    }
  }
}