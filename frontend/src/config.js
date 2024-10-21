const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ||
    (process.env.REACT_APP_ENV === 'production'
        ? 'https://thundering-sharai-aupp-156f29b2.koyeb.app/'
        : 'http://localhost:5001');

export { API_BASE_URL };