/**
 * Kilo Gateway Configuration Constants
 * Centralized configuration for all API endpoints, headers, and settings
 */
/** Environment variable for custom Kilo API URL */
export declare const ENV_KILO_API_URL = "KILO_API_URL";
/** Default Kilo API URL */
export declare const DEFAULT_KILO_API_URL = "https://api.kilo.ai";
/** Base URL for Kilo API - can be overridden by KILO_API_URL env var */
export declare const KILO_API_BASE: string;
/** Default base URL for OpenRouter-compatible endpoint */
export declare const KILO_OPENROUTER_BASE: string;
/** Device auth polling interval in milliseconds */
export declare const POLL_INTERVAL_MS = 3000;
/** Default model for authenticated users */
export declare const DEFAULT_MODEL = "anthropic/claude-sonnet-4";
/** Default model for anonymous/free usage */
export declare const DEFAULT_FREE_MODEL = "minimax/minimax-m2.1:free";
/** Token expiration duration in milliseconds (1 year) */
export declare const TOKEN_EXPIRATION_MS: number;
/** User-Agent header value for requests */
export declare const USER_AGENT = "opencode-kilo-gateway";
/** Content-Type header value for requests */
export declare const CONTENT_TYPE = "application/json";
/** Default provider name */
export declare const DEFAULT_PROVIDER_NAME = "kilo";
/** Default API key for anonymous requests */
export declare const ANONYMOUS_API_KEY = "anonymous";
/** Fetch timeout for model requests in milliseconds (10 seconds) */
export declare const MODELS_FETCH_TIMEOUT_MS: number;
/**
 * Header constants for Kilo API requests
 */
export declare const HEADER_ORGANIZATIONID = "X-KILO-ORGANIZATIONID";
export declare const HEADER_TASKID = "X-KILO-TASKID";
export declare const HEADER_PROJECTID = "X-KILO-PROJECTID";
export declare const HEADER_TESTER = "X-KILO-TESTER";
export declare const HEADER_EDITORNAME = "X-KILO-EDITORNAME";
/** Default editor name value */
export declare const DEFAULT_EDITOR_NAME = "OpenCode";
/** Environment variable name for custom editor name */
export declare const ENV_EDITOR_NAME = "KILO_EDITOR_NAME";
/** Tester header value for suppressing warnings */
export declare const TESTER_SUPPRESS_VALUE = "SUPPRESS";
//# sourceMappingURL=constants.d.ts.map