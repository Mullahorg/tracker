// All data here is fictional and stays in the browser. Nothing connects to real devices or people.
export const LOGIN_CODE = "zero4321#";
export const ADMIN_PIN = "1838";
export const STORAGE_KEY = "prop-console-v2";
export const SESSION_KEY = "prop-console-session";

export type ResultRow = { label: string; value: string };
export type Tool = {
  id: string;
  name: string;
  blurb: string;
  inputLabel: string;
  steps: string[];
  result: ResultRow[];
  showMap: boolean;
  mapX: number;
  mapY: number;
};
export type PropConfig = { appName: string; favicon: string | null; tools: Tool[] };

export const defaultConfig: PropConfig = {
  appName: "Sentinel",
  favicon: null,
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
      showMap: false,
      mapX: 50,
      mapY: 50,
    },
    tool("password", "Crack password", "Recover the password for a locked account.", "Account or email",
      ["Fetching hash", "Loading wordlists", "Running GPU cracker", "Testing candidates", "Password found"],
      [{ label: "Account", value: "j.mwangi@example.com" }, { label: "Password", value: "Sunrise#2021" }, { label: "Attempts", value: "4,812,330" }]),
    tool("intercept", "Intercept messages", "Capture messages sent to and from a device.", "Phone number",
      ["Locating handset", "Joining relay", "Syncing inbox", "Decoding messages", "Feed live"],
      [{ label: "Messages", value: "312" }, { label: "Latest", value: "“The package moves tonight.”" }, { label: "From", value: "Unknown sender" }]),
    tool("cctv", "Access CCTV", "Tap into a camera feed near a location.", "Street or building",
      ["Scanning nearby cameras", "Testing default logins", "Opening stream", "Buffering video", "Feed connected"],
      [{ label: "Camera", value: "CAM-07 · Main entrance" }, { label: "Status", value: "Live" }, { label: "Recording", value: "Last 48 hours" }], true),
    tool("firewall", "Bypass firewall", "Slip past a server's defences.", "Server address",
      ["Probing ports", "Fingerprinting firewall", "Crafting packets", "Tunnelling through", "Firewall bypassed"],
      [{ label: "Server", value: "10.4.22.9" }, { label: "Open ports", value: "22, 443, 8080" }, { label: "Access", value: "Granted" }]),
    tool("mail", "Dump inbox", "Download every email from an account.", "Email address",
      ["Resolving mail server", "Replaying session", "Listing folders", "Downloading mail", "Inbox copied"],
      [{ label: "Emails", value: "2,947" }, { label: "Attachments", value: "418" }, { label: "Flagged", value: "“Contract — final”" }]),
    tool("satellite", "Satellite view", "Point a satellite at a target area.", "Place or coordinates",
      ["Requesting uplink", "Aligning satellite", "Adjusting zoom", "Enhancing image", "Image ready"],
      [{ label: "Satellite", value: "ORBIT-3" }, { label: "Resolution", value: "30 cm" }, { label: "Captured", value: "2 min ago" }], true),
  ],
};

function tool(id: string, name: string, blurb: string, inputLabel: string, steps: string[], result: ResultRow[], showMap = false): Tool {
  return { id, name, blurb, inputLabel, steps, result, showMap, mapX: 50, mapY: 50 };
}

/** Saved settings keep their edits, and any tools added later still appear. */
export function mergeConfig(saved: Partial<PropConfig>): PropConfig {
  const savedTools = saved.tools ?? [];
  const tools = [...savedTools, ...defaultConfig.tools.filter((t) => !savedTools.some((s) => s.id === t.id))];
  return { ...defaultConfig, ...saved, tools };
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
