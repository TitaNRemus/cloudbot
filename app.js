const Discord = require("discord.js");
const config = require("./config.json"),
fs = require("fs"),
util = require("util"),
readdir = util.promisify(fs.readdir),
mongoose = require("mongoose");

const client = new Discord.Client();

client.events = new Discord.Collection();
client.commands = new Discord.Collection();
client.data = require("./database/MongoDB.js");
client.logger = require("./Modules/Logger.js");
client.tools = require("./Modules/Tools.js");

async function startUp(){

//Bütün eventleri başlat.
const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    const eventName = file.split(".")[0];
    client.logger.event(`[Bilgi], Yüklenen Event - ${eventName}`);
    client.on(eventName, event.bind(null, client));
}

//Tüm Komutları Yükle.
let folders = await readdir("./commands/");
folders.forEach(direct =>{
  const commandFiles = fs.readdirSync('./commands/' + direct + "/").filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
      const command = require(`./commands/${direct}/${file}`);
      client.commands.set(command.name, command);
  }
  })

  //Veritabanına Bağlan.
  mongoose.connect(config.mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    
    client.logger.log("[Bilgi], MongoDB Veritabanına Bağlanıldı", "log");
  }).catch((err) => {
   
    client.logger.log("[Hata], MongoDB Veritabanına Bir Hata Nedeni İle Bağlanılamıyor. Hata:"+err, "error");
  });
  client.login(config.token)
}

startUp();


client.on("disconnect", () => client.logger.log("[Hata], Bot Durumu: Bot Bir Neden İle Çevrimdışı Oldu.", "warn"))
    .on("reconnecting", () => client.logger.log("[Uyarı], Bot Durumu: Bot Yeniden Başlatılıyor.", "log"))
    .on("error", (e) => client.logger.log(e, "error"))
    .on("warn", (info) => client.logger.log(info, "warn"));

process.on("unhandledRejection", (err) => {
  console.error(err);
});
