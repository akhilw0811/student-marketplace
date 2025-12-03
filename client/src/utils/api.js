export const api = {
    async request(method, url, body = null) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers,
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, config);

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                throw new Error('Unauthorized');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Something went wrong');
            }

            return response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    },

    get(url) {
        return this.request('GET', url);
    },

    post(url, body) {
        return this.request('POST', url, body);
    },

    put(url, body) {
        return this.request('PUT', url, body);
    },

    delete(url) {
        return this.request('DELETE', url);
    }
};
