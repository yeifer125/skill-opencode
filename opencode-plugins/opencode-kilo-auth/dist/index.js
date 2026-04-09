import { authenticateWithDeviceAuthTUI } from "./auth.js";
import { KILO_API_BASE, KILO_OPENROUTER_BASE } from "./constants.js";
const KiloGatewayPlugin = async (input) => {
    return {
        auth: {
            provider: "kilo",
            async loader(getAuth, providerInfo) {
                const auth = await getAuth();
                const baseOptions = {
                    baseURL: KILO_OPENROUTER_BASE,
                    headers: {
                        "HTTP-Referer": "https://kilo.ai",
                        "X-Title": "Kilo Gateway",
                    },
                };
                if (!auth) {
                    return baseOptions;
                }
                if (auth.type === "api") {
                    return {
                        ...baseOptions,
                        apiKey: auth.key,
                    };
                }
                if (auth.type === "oauth") {
                    const result = {
                        ...baseOptions,
                        apiKey: auth.access,
                    };
                    const maybeAccountId = auth.accountId;
                    if (maybeAccountId) {
                        result.baseURL = `${KILO_API_BASE}/api/organizations/${maybeAccountId}`;
                    }
                    return result;
                }
                return baseOptions;
            },
            methods: [
                {
                    type: "oauth",
                    label: "Kilo Gateway (Device Authorization)",
                    async authorize() {
                        return await authenticateWithDeviceAuthTUI();
                    },
                },
                {
                    type: "api",
                    label: "Kilo Gateway (API Key)",
                    async authorize(inputs) {
                        const key = inputs?.apiKey;
                        if (!key) {
                            return { type: "failed" };
                        }
                        return {
                            type: "success",
                            provider: "kilo",
                            key,
                        };
                    },
                },
            ],
        },
    };
};
export default KiloGatewayPlugin;
