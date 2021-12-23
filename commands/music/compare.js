console.log(
  `${message.createdAt} | ${message.author.tag} ${message.author} : ${message}`
);

const player = client.player;

if (!message.member.voice.channel)
  return message.channel.send("❌ | **Bạn phải ở trong một kênh nói!**");
if (
  message.guild.me.voice.channel &&
  message.member.voice.channel.id !== message.guild.me.voice.channel.id
)
  return message.channel.send(":x: | **Bạn phải ở cùng kênh nói với Bot!**");

const queue = await player.createQueue(message.guild, {
  metadata: message.channel,
});

try {
  if (!queue.connection) await queue.connect(message.member.voice.channel);
} catch {
  queue.destroy();
  return message.channel.send("❌ | Đã xảy ra lỗi khi tham gia kênh nói!");
}

const searchResult = await player.search(args.join(" "), {
  requestedBy: message.user,
  searchEngine: QueryType.AUTO,
});

if (!searchResult || !searchResult.tracks.length)
  return message.channel.send("❌ | Không tìm thấy nhạc/video");
message.channel.send(
  `⏱ | Đang tải ${searchResult.playlist ? "danh sách phát" : "bài nhạc"}...`
);

if (searchResult.playlist) {
  queue.addTracks(searchResult.tracks);
} else {
  queue.addTrack(searchResult.tracks[0]);
}

if (!queue.playing) await queue.play();
