import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { KILO_API_BASE, ANONYMOUS_API_KEY } from "./constants.js";
export function getKiloUrlFromToken(defaultUrl, token) {
    if (!token)
        return defaultUrl;
    try {
        const parts = token.split(":");
        if (parts.length > 1 && parts[0].startsWith("http")) {
            return parts[0];
        }
    }
    catch (e) { }
    return defaultUrl;
}
export function isValidKiloToken(token) {
    if (!token || typeof token !== "string")
        return false;
    return token.length > 10;
}
export function getApiKey(options) {
    return options.kiloToken ?? options.apiKey;
}
export function createKilo(options = {}) {
    const apiKey = getApiKey(options);
    const baseApiUrl = getKiloUrlFromToken(options.baseURL ?? KILO_API_BASE, apiKey ?? "");
    const openRouterUrl = baseApiUrl.includes("/openrouter")
        ? baseApiUrl
        : baseApiUrl.endsWith("/")
            ? `${baseApiUrl}openrouter/`
            : `${baseApiUrl}/openrouter/`;
    const customHeaders = {
        "User-Agent": "opencode-kilo-gateway",
        "Content-Type": "application/json",
        "X-KILO-EDITORNAME": "OpenCode",
        ...(options.kiloOrganizationId ? { "X-KILO-ORGANIZATIONID": options.kiloOrganizationId } : {}),
        ...options.headers,
    };
    const originalFetch = options.fetch ?? fetch;
    const wrappedFetch = async (input, init) => {
        const headers = new Headers(init?.headers);
        Object.entries(customHeaders).forEach(([key, value]) => {
            headers.set(key, value);
        });
        if (apiKey) {
            headers.set("Authorization", `Bearer ${apiKey}`);
        }
        return originalFetch(input, {
            ...init,
            headers,
        });
    };
    return createOpenRouter({
        baseURL: openRouterUrl,
        apiKey: apiKey ?? ANONYMOUS_API_KEY,
        headers: customHeaders,
        fetch: wrappedFetch,
    });
}
