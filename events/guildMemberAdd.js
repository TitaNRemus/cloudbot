module.exports = async(client, member) => {
try {
  let guild = member.guild;
  let guildData = await client.data.getGuildDB(guild.id); 
  if(!guildData.addons.welcome.enabled) return; 

  let welcomeChannel = await client.tools.resolveChannel(guildData.addons.welcome.channel, guild);
  if(!welcomeChannel) return;

  let welcomeMsg = (guildData.addons.welcome.message === null || guildData.addons.welcome.message === "" || guildData.addons.welcome.message === " ") ? "Welcome {user.ping} to {guild.name}!" : guildData.addons.welcome.message; // Get the custom message or use the preset one

  let finalMsg = await welcomeMsg
    .replace("{user.ping}", `${member.user}`)
    .replace("{user.name}", `${member.user.username}`)
    .replace("{user.id}", `${member.user.id}`)
    .replace("{user.tag}", `${member.user.tag}`)
    .replace("{guild.name}", `${guild.name}`)
    .replace("{guild.id}", `${guild.id}`)
    .replace("{guild.totalUser}", `${guild.members.cache.size}`);
    return welcomeChannel.send(finalMsg) 

} catch (e) {
    console.log(e);
}

};
