const fs = require('fs');
const axios = require('axios');

// Base URL của API server
const BASE_URL = 'http://103.161.119.114:19368';

const endpoints = {
    health: '/api/health',
    leaderboards: '/api/leaderboards',
    players: '/api/players',
    skills: '/api/skills'
};

const fetchData = async () => {
    console.log('🚀 Bắt đầu fetch dữ liệu từ API...');
    console.log(`📍 Base URL: ${BASE_URL}`);

    for (const [key, endpoint] of Object.entries(endpoints)) {
        try {
            const fullUrl = BASE_URL + endpoint;
            console.log(`📡 Đang lấy dữ liệu từ: ${fullUrl}`);

            const response = await axios.get(fullUrl, {
                timeout: 10000, // 10 seconds timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            fs.writeFileSync(`${key}.json`, JSON.stringify(response.data, null, 2));
            console.log(`✅ Đã lưu thành công ${key}.json (${JSON.stringify(response.data).length} ký tự)`);
        } catch (error) {
            console.error(`Error fetching ${key}: ${error.message}`);
        }
    }
};

fetchData();
