const wiki = require("wikijs").default();

const colors = require("../../configuration/colors.json");
// const emojis = require("../../configuration/emojis.json");
// const configs = require("../../configuration/settings.json");

module.exports = {
  name: "wiki",
  category: "fun",
  description: "Shows a random wikipedia page",
  usage: "wiki",
  run: async (client, message, args) => {
    if (message.author.bot) return;

    await message.channel.send({
      embed: {
        color: colors.info,
        title: `Searching Wikipedia just for you ⌛`,
        description: `Please stand by...`,
      },
    });
    let result;
    if (!message.suffix) {
      const random = await wiki.random(1);
      result = await wiki.page(random[0]);
    } else {
      const search = await wiki.search(message.suffix, 1);
      if (!search.results.length) {
        return message.channel.send({
          embed: {
            color: colors.error,
            title: "What was that again? 📚🤓",
            description:
              "Even Wikipedia doesn't seem to know what you're talking about.",
            footer: {
              text: "Check for typos or try searching for something else!",
            },
          },
        });
      }
      result = await wiki.page(search.results[0]);
    }
    let description = await result.summary();
    if (description.length < 100) {
      description = await result.content();
    }
    if (description.length > 1950) {
      description = `${description.substring(
        0,
        1950
      )}...\nArticle is too long, click [**here**](${
        result.raw.fullurl
      }) to read more!`;
    }
    const mainImage = await result.mainImage().catch(() => null);
    message.channel.send({
      embed: {
        color: colors.success,
        title: result.raw.title,
        url: result.raw.fullurl,
        description,
        image: {
          url: mainImage,
        },
      },
    });
  },
};
