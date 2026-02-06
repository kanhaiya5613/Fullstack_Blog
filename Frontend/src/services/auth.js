import conf from "../conf/conf.js";

class AuthService {

    async request(url, options = {}) {
        try {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch(url, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers
                },
                signal: controller.signal,
                ...options,
            }); 

            const data = await response.json();

            if (!response.ok) throw data;

            return data;

        } catch (error) {
            if (error.name === "AbortError") {
                throw { message: "Server timeout" };
            }
            throw error;
        }
    }

    async createAccount({ fullName, email, password }) {
        await this.request(`${conf.backendUrl}/api/v1/users/register`, {
            method: "POST",
            body: JSON.stringify({ fullName, email, password }),
        });

        return this.login({ email, password });
    }

    async login({ email, password }) {
        return this.request(`${conf.backendUrl}/api/v1/users/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
    }

    async getCurrentUser() {
        try {
            const data = await this.request(`${conf.backendUrl}/api/v1/users/me`);
            return data.data;
        } catch {
            return null;
        }
    }

    async logout() {
        await this.request(`${conf.backendUrl}/api/v1/users/logout`, {
            method: "POST",
        });
    }
}

const authService = new AuthService();

export default authService;
