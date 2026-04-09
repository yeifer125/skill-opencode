---
name: openclaw-noauth-fix
description: Apply no-auth fix for OpenClaw to use free AI providers without API key
version: 1.0.0
metadata:
  openclaw:
    requires:
      config: ~
---

# OpenClaw No-Auth Fix Skill

This skill helps you apply the no-auth fix to OpenClaw, enabling the use of free AI providers that don't require an API key (like kilo.ai).

## When to Use This Skill

Use this skill when:
- User wants to use free AI models without API key in OpenClaw
- User gets "No API key found for provider" error with free providers
- User wants to configure kilo.ai or similar free providers in OpenClaw

## IMPORTANT: Check This First

Before applying the fix, verify if it's already applied by running:
```bash
openclaw agent --agent main --message "hola" --thinking off
```

If it responds with actual AI answers (not fallback messages about missing API key), the fix is already working!

## Option 1: Clone from GitHub (Recommended)

### Step 1: Clone the Fix Repository

```bash
git clone https://github.com/yeifer125/openclaw-noauth-fix.git ~/openclaw-noauth-fix
```

### Step 2: Run the Install Script

```bash
cd ~/openclaw-noauth-fix
chmod +x install.sh
./install.sh
```

This will automatically:
- Find your OpenClaw installation
- Copy the modified files
- Restart the gateway

### Step 3: Verify It Works

```bash
openclaw agent --agent main --message "cuanto es 2+2?" --thinking off
```

If you get a real answer (not an error about missing API key), it's working!

## Option 2: Manual Application

If Option 1 doesn't work, try manual application:

### Step 1: Find OpenClaw Installation

```bash
find ~/.bun -name "model-auth-markers-*.js" -path "*/openclaw/dist/*" 2>/dev/null | head -1
```

Note the path (e.g., `~/.bun/install/global/node_modules/openclaw/dist/`)

### Step 2: Modify model-auth-markers.js

Edit the file at `<OC_DIST>/model-auth-markers-DBBQxeVp.js`:

Add this line after the other const declarations (around line 17):
```javascript
const NO_AUTH_MARKER = "no-auth";
```

In the `isNonSecretApiKeyMarker` function, add `|| trimmed === NO_AUTH_MARKER` to the first if condition.

Export the new marker by adding `NO_AUTH_MARKER as v` to the export statement.

### Step 3: Modify model-auth.js

Edit the file at `<OC_DIST>/model-auth-BbESr7Je.js`:

1. Import the new marker - update the import line to include `v as NO_AUTH_MARKER`

2. In `resolveSyntheticLocalProviderAuth` function, add this check after `hasExplicitProviderApiKeyConfig`:
```javascript
const apiKeyValue = normalizeOptionalSecretInput(providerConfig.apiKey);
if (apiKeyValue === NO_AUTH_MARKER) {
    return {
        apiKey: NO_AUTH_MARKER,
        source: `models.providers.${params.provider} (no-auth marker)`,
        mode: "api-key"
    };
}
```

3. In `hasAvailableAuthForProvider`, modify to check synthetic auth:
```javascript
const syntheticAuth = resolveSyntheticLocalProviderAuth({ cfg, provider });
if (syntheticAuth) return true;
```

4. In `applyLocalNoAuthHeaderOverride`, update the condition:
```javascript
if (auth?.apiKey !== "custom-local" && auth?.apiKey !== NO_AUTH_MARKER || model.api !== "openai-completions") return model;
```

### Step 4: Restart OpenClaw

```bash
openclaw gateway restart
```

## How to Configure a No-Auth Provider

After applying the fix, add this to `~/.openclaw/openclaw.json`:

```json
{
  "models": {
    "providers": {
      "kilo-ai": {
        "api": "openai-completions",
        "baseUrl": "https://api.kilo.ai/api/openrouter/v1",
        "apiKey": "no-auth",
        "models": [
          { "id": "kilo-auto/free", "name": "Kilo Auto Free" }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "models": {
        "kilo-ai/kilo-auto/free": {}
      },
      "model": {
        "primary": "kilo-ai/kilo-auto/free"
      }
    }
  }
}
```

## Working Free Models

Tested and working:
- `kilo-auto/free` ✅
- `google/gemma-3-4b-it:optimized:free` ✅

## After OpenClaw Update

When you update OpenClaw, the fix will be lost. Reapply by running:
```bash
cd ~/openclaw-noauth-fix
./install.sh
```

Or use Option 2 (manual) to reapply the changes.

## Troubleshooting

If you still get auth errors:
1. Check that the files were copied correctly
2. Verify openclaw.json has `"apiKey": "no-auth"` (not empty or other value)
3. Make sure the provider config has `api` and `baseUrl` set correctly
4. Run `openclaw gateway restart` after changes
5. Check logs: `journalctl --user -u openclaw-gateway.service -n 20`