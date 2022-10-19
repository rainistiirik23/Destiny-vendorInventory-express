const puppeteer = require('puppeteer')
const { Client, Intents, channel } = require('discord.js');
const { token } = require('./config.json');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js')
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const grabPage = async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://youtube.com')
    const el = await page.$('#contents')
    const buffer = await el.screenshot({ path: `${Date.now()}.png` })

    await browser.close()
    return buffer
}
// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    const exampleEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Some title')
        .setURL('https://discord.js.org/')
        .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
        .setDescription('Some description here')
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        .addFields(
            { name: 'Regular field title', value: 'Some value here' },
            { name: '\u200B', value: '\u200B' },
            { name: 'Inline field title', value: 'Some value here', inline: true },
            { name: 'Inline field title', value: 'Some value here', inline: true },
        )
        .addField('Inline field title', 'Some value here', true)
        .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        //await channel.send(exampleEmbed);
        await interaction.reply('Here is a gun');
    } else if (commandName === 'server') {
        await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
    } else if (commandName === 'user') {
        await interaction.reply('User info.');
    }
});


// Login to Discord with your client's token
client.login(token);
