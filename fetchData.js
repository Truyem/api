const fs = require('fs');
const axios = require('axios');

const endpoints = {
    health: '/api/health',
    leaderboards: '/api/leaderboards',
    players: '/api/players',
    skills: '/api/skills'
};

const getBaseUrl = () => {
    const baseUrl = process.argv[2] || process.env.BASE_URL;

    if (!baseUrl) {
        console.error('A base URL must be provided as an argument or through the BASE_URL environment variable.');
        process.exit(1);
    }

    return baseUrl;
};

const createClient = (baseURL) => {
    try {
        return axios.create({ baseURL });
    } catch (error) {
        console.error(`Invalid base URL provided: ${error.message}`);
        process.exit(1);
    }
};

const fetchData = async () => {
    const baseURL = getBaseUrl();
    const client = createClient(baseURL);
    let hasError = false;

    for (const [key, endpoint] of Object.entries(endpoints)) {
        try {
            const response = await client.get(endpoint);
            fs.writeFileSync(`${key}.json`, JSON.stringify(response.data, null, 2));
            console.log(`Fetched and saved ${key}.json`);
        } catch (error) {
            hasError = true;
            console.error(`Error fetching ${key} from ${baseURL}${endpoint}: ${error.message}`);
        }
    }

    if (hasError) {
        process.exit(1);
    }
};

fetchData();
