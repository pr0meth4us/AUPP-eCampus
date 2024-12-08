const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ||
    (process.env.REACT_APP_ENV === 'production'
        ? 'https://long-benedetta-aupp-f2be75c3.koyeb.app/'
        : 'http://localhost:5001');

export { API_BASE_URL };