let API_BASE_URL;

if (process.argv.includes('-prod')) {
    API_BASE_URL = 'https://thundering-sharai-aupp-156f29b2.koyeb.app/';
} else {
    API_BASE_URL = 'http://localhost:5001';
}

export { API_BASE_URL };
