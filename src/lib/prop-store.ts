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
  ],
};

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
