require("dotenv").config()

const chalk = require("chalk")

const Discord = require("discord.js")
const client = new Discord.Client({
    disableEveryone: true
})

const Twitter = require("twitter")

const twitter = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});


client.on("ready", () => {
    console.log(chalk.cyan(`[client] Zalogowano jako ${client.user.tag}`))

    const filter = msg => msg.channel.id == "566197088132792348"
    const channel = client.channels.cache.get("566197088132792348")

    const collector = new Discord.MessageCollector(channel, filter)

    function send(message) {
        message = `LATEST UPDATE\n${message}`
        twitter.post('statuses/update', {
            status: message
        }, function (error, tweet, response) {
            if (error) {
                console.log(chalk.red(`[error] ${error.toString()}`))
            }
        })
    }

    collector.on("collect", msg => {
        send(msg.embeds[0].description.slice(11).replace("(", "").replace(msg.embeds[0].url, "").replace(") ", "").replace(" - Spajciuch", ""))
    })

})

client.login(process.env.TOKEN)