require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildModeration
    ]
});

const config = {
    logChannel: process.env.LOG_CHANNEL_ID
};

client.on('ready', () => {
    console.log(`🤖 Bot ${client.user.tag} gotowy do logowania!`);
});

// Logowanie usuniętych wiadomości
client.on('messageDelete', async message => {
    if (message.author.bot) return;

    const logChannel = client.channels.cache.get(config.logChannel);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle('🗑️ Usunięto wiadomość')
        .setColor('#FF0000')
        .addFields(
            { name: 'Autor', value: `${message.author.tag} (${message.author.id})`, inline: true },
            { name: 'Kanał', value: `${message.channel.name}`, inline: true },
            { name: 'Treść', value: message.content || 'Brak treści' }
        )
        .setFooter({ text: `ID: ${message.id}` })
        .setTimestamp();

    await logChannel.send({ embeds: [embed] });
});

// Logowanie edytowanych wiadomości
client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (oldMessage.author.bot) return;
    if (oldMessage.content === newMessage.content) return;

    const logChannel = client.channels.cache.get(config.logChannel);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle('✏️ Edytowano wiadomość')
        .setColor('#FFA500')
        .addFields(
            { name: 'Autor', value: `${oldMessage.author.tag} (${oldMessage.author.id})`, inline: true },
            { name: 'Kanał', value: `${oldMessage.channel.name}`, inline: true },
            { name: 'Przed', value: oldMessage.content || 'Brak treści', inline: false },
            { name: 'Po', value: newMessage.content || 'Brak treści', inline: false }
        )
        .setFooter({ text: `ID: ${oldMessage.id}` })
        .setTimestamp();

    await logChannel.send({ embeds: [embed] });
});

// Logowanie banów
client.on('guildBanAdd', async (ban) => {
    const logChannel = client.channels.cache.get(config.logChannel);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle('🔨 Zbanowano użytkownika')
        .setColor('#FF0000')
        .addFields(
            { name: 'Użytkownik', value: `${ban.user.tag} (${ban.user.id})`, inline: true },
            { name: 'Powód', value: ban.reason || 'Nie podano', inline: true }
        )
        .setTimestamp();

    await logChannel.send({ embeds: [embed] });
});

// Logowanie odbanowań
client.on('guildBanRemove', async (ban) => {
    const logChannel = client.channels.cache.get(config.logChannel);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle('🔓 Odbanowano użytkownika')
        .setColor('#00FF00')
        .addFields(
            { name: 'Użytkownik', value: `${ban.user.tag} (${ban.user.id})`, inline: true }
        )
        .setTimestamp();

    await logChannel.send({ embeds: [embed] });
});

client.login(process.env.DISCORD_TOKEN);
