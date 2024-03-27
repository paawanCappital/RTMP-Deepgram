const dotenv = require('dotenv');
const { createClient } = require('@deepgram/sdk');
dotenv.config();

const deepgram = createClient(process.env.DEEPGRAM_API_KEY)

module.exports = deepgram;
