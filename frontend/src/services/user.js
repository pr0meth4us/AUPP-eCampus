import api from './api';

export const user = {
    getName: async (id) => {
            const response = await api.get("user/" + id);
            return response.data; }
};
