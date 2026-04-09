import { type OpenRouterProvider } from "@openrouter/ai-sdk-provider";
import type { KiloProviderOptions } from "./types.js";
export declare function getKiloUrlFromToken(defaultUrl: string, token: string): string;
export declare function isValidKiloToken(token: string): boolean;
export declare function getApiKey(options: {
    kiloToken?: string;
    apiKey?: string;
}): string | undefined;
export declare function createKilo(options?: KiloProviderOptions): OpenRouterProvider;
//# sourceMappingURL=provider.d.ts.map