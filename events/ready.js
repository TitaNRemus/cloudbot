module.exports = async(client) => {
try {

  client.user.setPresence({ activity: { name: 'Seni', type: "WATCHING" }, status: "online" });
  client.logger.ready(`[Bilgi] ${client.user.tag} İsmi İle Giriş Yapıldı.`);

} catch (e) {
    console.log(e);
}

};
