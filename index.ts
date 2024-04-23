import express from 'express';
import Discord, { GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const client = new Discord.Client({
    intents: [
        GatewayIntentBits.GuildMembers
    ]
});

client.login(process.env.TOKEN);

app.use((req, res, next) => {
    if (!req.headers.authorization) return res.status(401).json({ error: "Unauthorized"});
    
    const token = req.headers.authorization.slice(7);

    if (token != process.env.KEY) return res.status(401).json({ error: "Unauthorized"});    

    next();
});

app.use((req, res, next) => {
    if (client.readyAt) {
        next();
    } else {
        res.status(503).send({ error: 'Bot is not yet ready.' });
    }
});

app.get('/channels/:channelId', async (req, res) => {
    const channelId = req.params.channelId;

    try {
        const channel = await client.channels.fetch(channelId);

        if (channel) {
            res.json(channel);
        } else {
            res.status(404).json({ error: 'Channel not found' });
        }
    } catch (err) {
        res.status(404).json({ error: 'Channel not found' });
    }
});

app.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await client.users.fetch(userId);

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(404).json({ error: 'User not found' });
    }
});

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
