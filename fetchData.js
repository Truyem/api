const fs = require('fs');
const axios = require('axios');

const baseUrl = process.env.API_BASE_URL || 'https://api.wiseoldman.net';
const endpoints = {
    health: process.env.API_HEALTH_ENDPOINT || '/api/health',
    leaderboards: process.env.API_LEADERBOARDS_ENDPOINT || '/api/leaderboards',
    players: process.env.API_PLAYERS_ENDPOINT || '/api/players',
    skills: process.env.API_SKILLS_ENDPOINT || '/api/skills'
};

const resolveUrl = (path) => {
    try {
        return new URL(path, baseUrl).toString();
    } catch (error) {
        throw new Error(`Invalid URL generated for path "${path}": ${error.message}`);
    }
};

const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const fetchEndpoint = async (key, endpoint) => {
    const targetUrl = resolveUrl(endpoint);
    const filePath = `${key}.json`;

    try {
        const response = await axios.get(targetUrl, { timeout: 15000 });
        writeJsonFile(filePath, response.data);
        console.log(`Fetched and saved ${filePath}`);
    } catch (error) {
        const status = error.response ? `${error.response.status} ${error.response.statusText}` : null;
        const message = status ? `Request failed with status ${status}` : error.message;
        console.error(`Error fetching ${key} from ${targetUrl}: ${message}`);

        const errorPayload = {
            error: message,
            url: targetUrl,
            fetchedAt: new Date().toISOString()
        };
        if (error.response?.data) {
            errorPayload.details = error.response.data;
        }
        writeJsonFile(filePath, errorPayload);
        console.log(`Saved error details to ${filePath}`);
    }
};

const fetchData = async () => {
    for (const [key, endpoint] of Object.entries(endpoints)) {
        await fetchEndpoint(key, endpoint);
    }
};

fetchData().catch((error) => {
    console.error('Unexpected error while fetching data:', error);
    process.exitCode = 1;
});
