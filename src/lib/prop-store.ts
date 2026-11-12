// All data here is fictional and stays in the browser. Nothing connects to real devices or people.
export const LOGIN_CODE = "zero4321#";
export const ADMIN_PIN = "1838";
export const STORAGE_KEY = "prop-console-v2";
export const SESSION_KEY = "prop-console-session";
export const DEFAULT_DURATION_SECONDS = 8;
export const MIN_DURATION_SECONDS = 1;
export const MAX_DURATION_SECONDS = 120;

export type ResultRow = { label: string; value: string };
export type ToolOutcome = "success" | "failure";
export type ResultViewKind = "location" | "spyware" | "network" | "archive" | "credential" | "chat" | "camera" | "mail" | "satellite" | "generic";

export function resultViewForTool(id: string): ResultViewKind {
  const views: Record<string, ResultViewKind> = {
    track: "location",
    spyware: "spyware",
    breach: "network",
    decrypt: "archive",
    password: "credential",
    intercept: "chat",
    cctv: "camera",
    firewall: "network",
    mail: "mail",
    satellite: "satellite",
  };
  return views[id] ?? "generic";
}

export type Tool = {
  id: string;
  name: string;
  blurb: string;
  inputLabel: string;
  steps: string[];
  result: ResultRow[];
  outcome: ToolOutcome;
  durationSeconds: number;
  showMap: boolean;
  mapX: number;
  mapY: number;
  sceneResults?: SceneResult[];
};
export type SceneResult = { id: string; name: string; result: ResultRow[] };
export type LookConfig = { accent: string; terminalText: string; rain: number; effects: boolean };
export const defaultLook: LookConfig = { accent: "#9be15d", terminalText: "#9aa3ad", rain: 18, effects: true };
export type PropConfig = { appName: string; favicon: string | null; look: LookConfig; tools: Tool[] };

export const defaultConfig: PropConfig = {
  appName: "Sentinel",
  favicon: null,
  look: defaultLook,
  tools: [
    {
      id: "track",
      name: "Track a user",
      blurb: "Locate a target by phone number or handle.",
      inputLabel: "Phone number or username",
      steps: ["Resolving identifier", "Querying carrier records", "Triangulating cell towers", "Refining position", "Location locked"],
      result: [
        { label: "Name", value: "Daniel Okoro" },
        { label: "Last seen", value: "Westlands, Nairobi" },
        { label: "Coordinates", value: "-1.2676, 36.8108" },
        { label: "Device", value: "Android · Pixel 7" },
        { label: "Accuracy", value: "± 12 m" },
      ],
      sceneResults: [{
        id: "rehearsal-a",
        name: "Rehearsal A",
        result: [
          { label: "Name", value: "Daniel Okoro" },
          { label: "Last seen", value: "Westlands, Nairobi" },
          { label: "Coordinates", value: "-1.2676, 36.8108" },
          { label: "Device", value: "Android · Pixel 7" },
          { label: "Accuracy", value: "± 12 m" },
        ],
      }],
      outcome: "success",
      durationSeconds: DEFAULT_DURATION_SECONDS,
      showMap: true,
      mapX: 58,
      mapY: 46,
    },
    {
      id: "spyware",
      name: "Plant spyware",
      blurb: "Deploy a monitoring payload to a target device.",
      inputLabel: "Target device ID or number",
      steps: ["Scanning device ports", "Bypassing firewall", "Uploading payload", "Escalating privileges", "Payload installed"],
      result: [
        { label: "Status", value: "Implant active" },
        { label: "Messages captured", value: "1,284" },
        { label: "Microphone", value: "Streaming" },
        { label: "Camera", value: "Standby" },
        { label: "Last message", value: "“Meet me at the station at 9.”" },
      ],
      outcome: "success",
      durationSeconds: DEFAULT_DURATION_SECONDS,
      showMap: false,
      mapX: 50,
      mapY: 50,
    },
    {
      id: "breach",
      name: "Breach network",
      blurb: "Gain access to a protected network.",
      inputLabel: "Network name or IP",
      steps: ["Mapping network", "Cracking WPA handshake", "Injecting credentials", "Opening tunnel", "Access granted"],
      result: [
        { label: "Access level", value: "Root" },
        { label: "Devices online", value: "23" },
        { label: "Admin user", value: "sysadmin" },
      ],
      outcome: "success",
      durationSeconds: DEFAULT_DURATION_SECONDS,
      showMap: false,
      mapX: 50,
      mapY: 50,
    },
    {
      id: "decrypt",
      name: "Decrypt files",
      blurb: "Unlock an encrypted archive.",
      inputLabel: "File or archive name",
      steps: ["Reading headers", "Loading key dictionary", "Brute-forcing key", "Decrypting blocks", "Decryption complete"],
      result: [
        { label: "Files recovered", value: "47" },
        { label: "Key", value: "A7F3-91C2-0BDE" },
        { label: "Contents", value: "Bank transfers, 2019–2024" },
      ],
      outcome: "success",
      durationSeconds: DEFAULT_DURATION_SECONDS,
      showMap: false,
      mapX: 50,
      mapY: 50,
    },
    tool("password", "Crack password", "Recover the password for a locked account.", "Account or email",
      ["Opening fictional vault", "Checking sample digest", "Comparing demo records", "Rendering prop-only match", "Demo match displayed"],
      [{ label: "Dummy app", value: "Paper Kite Pass · fictional" }, { label: "Account", value: "demo@paperkite.invalid" }, { label: "Matched hash", value: "$2b$12$SIMULATED_SAMPLE_ONLY" }, { label: "Outcome", value: "Prop-only match · no password revealed" }]),
    tool("intercept", "Intercept messages", "Capture messages sent to and from a device.", "Phone number",
      ["Locating handset", "Joining relay", "Syncing inbox", "Decoding messages", "Feed live"],
      [{ label: "Moth → Rook · 08:41", value: "The lantern is set for rehearsal." }, { label: "Rook → Moth · 08:43", value: "Copy. Meet by the paper moon." }]),
    tool("cctv", "Access CCTV", "Tap into a camera feed near a location.", "Street or building",
      ["Scanning nearby cameras", "Testing default logins", "Opening stream", "Buffering video", "Feed connected"],
      [{ label: "Camera", value: "CAM-07 · fictional set" }, { label: "Tile", value: "Static map preview · simulated" }, { label: "Source", value: "Local illustration only" }], true),
    tool("firewall", "Bypass firewall", "Slip past a server's defences.", "Server address",
      ["Probing ports", "Fingerprinting firewall", "Crafting packets", "Tunnelling through", "Firewall bypassed"],
      [{ label: "Server", value: "10.4.22.9" }, { label: "Open ports", value: "22, 443, 8080" }, { label: "Access", value: "Granted" }]),
    tool("mail", "Dump inbox", "Download every email from an account.", "Email address",
      ["Resolving mail server", "Replaying session", "Listing folders", "Downloading mail", "Inbox copied"],
      [{ label: "08:42 · rehearsal@paperkite.invalid", value: "Stage call sheet · Prop message" }, { label: "08:17 · moth@paperkite.invalid", value: "The paper moon · Prop message" }, { label: "Yesterday · rook@paperkite.invalid", value: "Set notes · Prop message" }]),
    tool("satellite", "Satellite view", "Point a satellite at a target area.", "Place or coordinates",
      ["Requesting uplink", "Aligning satellite", "Adjusting zoom", "Enhancing image", "Image ready"],
      [{ label: "Satellite", value: "ORBIT-3" }, { label: "Resolution", value: "30 cm" }, { label: "Captured", value: "2 min ago" }], true),
  ],
};

function tool(id: string, name: string, blurb: string, inputLabel: string, steps: string[], result: ResultRow[], showMap = false): Tool {
  return { id, name, blurb, inputLabel, steps, result, outcome: "success", durationSeconds: DEFAULT_DURATION_SECONDS, showMap, mapX: 50, mapY: 50 };
}

export function getSceneResult(tool: Tool, sceneId: string): ResultRow[] {
  return tool.sceneResults?.find((scene) => scene.id === sceneId)?.result ?? tool.result;
}

/** Saved settings keep their edits, and any tools added later still appear. */
export function mergeConfig(saved: Partial<PropConfig>): PropConfig {
  const savedTools = saved.tools ?? [];
  const tools = [
    ...savedTools.map((savedTool) => {
      const defaults = defaultConfig.tools.find((toolConfig) => toolConfig.id === savedTool.id);
      const fallback = defaults ?? defaultConfig.tools[0];
      const duration = savedTool.durationSeconds;
      const scenes = savedTool.sceneResults?.length ? savedTool.sceneResults : defaults?.sceneResults;
      return {
        ...(defaults ?? {}),
        ...savedTool,
        outcome: savedTool.outcome === "failure" || savedTool.outcome === "success" ? savedTool.outcome : "success",
        durationSeconds: typeof duration === "number" && Number.isFinite(duration)
          ? Math.min(MAX_DURATION_SECONDS, Math.max(MIN_DURATION_SECONDS, Math.round(duration)))
          : fallback?.durationSeconds ?? DEFAULT_DURATION_SECONDS,
        ...(scenes ? {
          sceneResults: scenes.map((scene, index) => ({
            id: typeof scene.id === "string" && scene.id.trim() ? scene.id : `scene-${index + 1}`,
            name: typeof scene.name === "string" && scene.name.trim() ? scene.name : `Scene ${index + 1}`,
            result: Array.isArray(scene.result) ? scene.result : (defaults?.result ?? []),
          })),
        } : {}),
      };
    }),
    ...defaultConfig.tools.filter((toolConfig) => !savedTools.some((savedTool) => savedTool.id === toolConfig.id)),
  ];
  const look = { ...defaultLook, ...(saved.look ?? {}) };
  look.rain = Math.min(60, Math.max(0, Math.round(Number(look.rain) || 0)));
  return { ...defaultConfig, ...saved, look, tools };
}

export function checkLogin(code: string) {
  return code.trim() === LOGIN_CODE;
}
export function checkPin(pin: string) {
  return pin.trim() === ADMIN_PIN;
}

export function parseRows(text: string): ResultRow[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf(":");
      return i === -1 ? { label: line, value: "" } : { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
    });
}
export function rowsToText(rows: ResultRow[]) {
  return rows.map((r) => `${r.label}: ${r.value}`).join("\n");
}
