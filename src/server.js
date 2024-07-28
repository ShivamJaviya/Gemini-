const PORT = 8000;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

app.post('/gemini2', async (req, res) => {
    try {
        console.log(req.body.history);
        console.log(req.body.message);

        const model = await genAI.getGenerativeModel({ model: "gemini-pro" });

        const chat = model.startChat({
            history: []
        });

        console.log(req?.body, "[BODY]");

        const msg = req.body.message;
        const result = await chat.sendMessage(msg);

        const response = result.response;
        const text = response.text();
        res.send(text);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
