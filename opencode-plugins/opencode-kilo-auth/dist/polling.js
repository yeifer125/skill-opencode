export async function poll(options) {
    const { interval, maxAttempts, pollFn } = options;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const result = await pollFn();
        if (!result.continue) {
            if (result.error) {
                throw result.error;
            }
            return result.data;
        }
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
    throw new Error("Polling timed out");
}
export function formatTimeRemaining(startTime, expiresInSeconds) {
    const elapsed = (Date.now() - startTime) / 1000;
    const remaining = Math.max(0, expiresInSeconds - elapsed);
    const minutes = Math.floor(remaining / 60);
    const seconds = Math.floor(remaining % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
