const fs = require('fs');
const axios = require('axios');

const endpoints = {
    health: '/api/health',
    leaderboards: '/api/leaderboards',
    players: '/api/players',
    skills: '/api/skills'
};

const fetchData = async () => {
    for (const [key, endpoint] of Object.entries(endpoints)) {
        try {
            const response = await axios.get(endpoint);
            fs.writeFileSync(`${key}.json`, JSON.stringify(response.data, null, 2));
            console.log(`Fetched and saved ${key}.json`);
        } catch (error) {
            console.error(`Error fetching ${key}: ${error.message}`);
        }
    }
};

fetchData();