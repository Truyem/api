const fs = require('fs');
const axios = require('axios');

// Base URL của API server
const BASE_URL = 'http://103.161.119.206:25087';

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
            console.error(`❌ Lỗi khi lấy dữ liệu ${key}: ${error.message}`);

            // Ghi lỗi vào file để debug
            const errorData = {
                error: error.message,
                endpoint: endpoint,
                timestamp: new Date().toISOString(),
                status: error.response?.status || 'unknown'
            };

            fs.writeFileSync(`${key}_error.json`, JSON.stringify(errorData, null, 2));
            console.log(`📄 Đã ghi thông tin lỗi vào ${key}_error.json`);
        }
    }

    console.log('🎉 Hoàn thành quá trình fetch dữ liệu!');
};

// Kiểm tra xem có tham số --auto không
const isAutoMode = process.argv.includes('--auto');

// Nếu chạy tự động, sẽ lặp lại mỗi 1 phút
if (isAutoMode) {
    console.log('🔄 Chế độ tự động: Lặp lại mỗi 1 phút');

    const runEvery = (minutes) => {
        fetchData();
        setTimeout(() => runEvery(minutes), minutes * 60 * 1000);
    };

    runEvery(1);
} else {
    // Chạy một lần
    fetchData();
}