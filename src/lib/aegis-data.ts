export type Severity = "ROUTINE" | "ELEVATED" | "CRITICAL";
export type MissionStatus = "ACTIVE" | "STANDBY" | "COMPLETE";

export type Mission = {
  id: string;
  codename: string;
  objective: string;
  priority: Severity;
  status: MissionStatus;
  progress: number;
  eta: string;
  operators: string[];
  locationId: string;
  objectives: { id: string; label: string; done: boolean }[];
};

export type AegisData = {
  missions: Mission[];
  operators: { id: string; handle: string; initials: string; role: string }[];
  events: { id: string; time: string; title: string; detail: string; severity: Severity }[];
  alerts: { id: string; message: string; severity: Severity; time: string; acknowledged: boolean }[];
  locations: { id: string; name: string; region: string; x: number; y: number; activity: number; status: "NOMINAL" | "ELEVATED" | "QUIET" }[];
  metrics: { id: string; label: string; value: number; unit: string; note: string }[];
  briefs: { id: string; title: string; classification: string; text: string }[];
  threads: { id: string; name: string; messages: { id: string; author: string; initials: string; text: string; time: string }[] }[];
  assets: { id: string; name: string; type: string; status: string }[];
  targets: string[];
};

export const STORAGE_KEY = "aegis-x-fictional-prop-v1";

export const seedData: AegisData = {
  operators: [
    { id: "op-01", handle: "analyst_09", initials: "A9", role: "Pattern analyst" },
    { id: "op-02", handle: "relay_04", initials: "R4", role: "Signal steward" },
    { id: "op-03", handle: "cipher_12", initials: "C12", role: "Archive lead" },
    { id: "op-04", handle: "vector_03", initials: "V3", role: "Field liaison" },
    { id: "op-05", handle: "quartz_08", initials: "Q8", role: "Duty coordinator" },
  ],
  locations: [
    { id: "loc-01", name: "GLASS HARBOR", region: "SECTOR K-9", x: 18, y: 32, activity: 72, status: "ELEVATED" },
    { id: "loc-02", name: "EMBER VAULT", region: "NORTH RELAY ZONE", x: 39, y: 24, activity: 41, status: "NOMINAL" },
    { id: "loc-03", name: "SABLE CROSSING", region: "MERIDIAN-7", x: 55, y: 40, activity: 84, status: "ELEVATED" },
    { id: "loc-04", name: "LANTERN FIELD", region: "SECTOR M-2", x: 72, y: 28, activity: 28, status: "QUIET" },
    { id: "loc-05", name: "CINDER ARRAY", region: "WESTERN LATTICE", x: 31, y: 68, activity: 56, status: "NOMINAL" },
    { id: "loc-06", name: "ORBITAL GARDEN", region: "LOWER CIRCUIT", x: 81, y: 66, activity: 63, status: "NOMINAL" },
  ],
  missions: [
    { id: "M-204", codename: "OPERATION NIGHTGLASS", objective: "Reconcile the echo ledger across the glass corridor.", priority: "CRITICAL", status: "ACTIVE", progress: 68, eta: "00:42", operators: ["A9", "R4", "Q8"], locationId: "loc-01", objectives: [{ id: "a", label: "Validate the fictional echo ledger", done: true }, { id: "b", label: "Compare relay windows", done: false }, { id: "c", label: "Prepare a sealed handoff note", done: false }] },
    { id: "M-208", codename: "CIPHER MERIDIAN", objective: "Map the invented signal cadence at Meridian-7.", priority: "ELEVATED", status: "ACTIVE", progress: 43, eta: "01:18", operators: ["C12", "V3"], locationId: "loc-03", objectives: [{ id: "a", label: "Review the fictional cadence", done: true }, { id: "b", label: "Annotate the interval chart", done: false }, { id: "c", label: "File a closing summary", done: false }] },
    { id: "M-211", codename: "QUIET LANTERN", objective: "Audit a simulated archive checksum sequence.", priority: "ROUTINE", status: "STANDBY", progress: 22, eta: "02:05", operators: ["A9", "C12"], locationId: "loc-04", objectives: [{ id: "a", label: "Index the sample pages", done: false }, { id: "b", label: "Compare checksum notes", done: false }, { id: "c", label: "Publish the review", done: false }] },
    { id: "M-193", codename: "PAPER COMET", objective: "Close a fictional courier handoff exercise.", priority: "ROUTINE", status: "COMPLETE", progress: 100, eta: "CLOSED", operators: ["V3", "Q8"], locationId: "loc-05", objectives: [{ id: "a", label: "Confirm the practice handoff", done: true }, { id: "b", label: "Record the debrief", done: true }, { id: "c", label: "Archive the scenario", done: true }] },
    { id: "M-215", codename: "BLUE STATIC", objective: "Compare two synthetic relay patterns.", priority: "ELEVATED", status: "ACTIVE", progress: 81, eta: "00:19", operators: ["R4", "Q8"], locationId: "loc-02", objectives: [{ id: "a", label: "Load synthetic sample A", done: true }, { id: "b", label: "Compare sample B", done: true }, { id: "c", label: "Draft the delta note", done: false }] },
    { id: "M-218", codename: "VELVET CIRCUIT", objective: "Review a made-up archive routing diagram.", priority: "ROUTINE", status: "STANDBY", progress: 12, eta: "03:10", operators: ["C12", "A9"], locationId: "loc-06", objectives: [{ id: "a", label: "Open the diagram set", done: false }, { id: "b", label: "Mark review questions", done: false }, { id: "c", label: "Sign the worksheet", done: false }] },
  ],
  events: [
    { id: "ev-01", time: "00:02 ago", title: "Scenario packet sealed", detail: "NIGHTGLASS / local prop archive", severity: "ROUTINE" },
    { id: "ev-02", time: "04:16 ago", title: "Relay cadence shifted", detail: "Synthetic pattern · MERIDIAN-7", severity: "ELEVATED" },
    { id: "ev-03", time: "11:30 ago", title: "Review note submitted", detail: "analyst_09 · BRIEF-1142", severity: "ROUTINE" },
    { id: "ev-04", time: "18:04 ago", title: "Archive queue reached 72%", detail: "Display-only status value", severity: "ELEVATED" },
    { id: "ev-05", time: "26:41 ago", title: "Training channel opened", detail: "quartz_08 · channel alpha", severity: "ROUTINE" },
    { id: "ev-06", time: "39:12 ago", title: "Checksum mismatch noted", detail: "Fictional sample / page 08", severity: "CRITICAL" },
    { id: "ev-07", time: "51:03 ago", title: "CIPHER MERIDIAN resumed", detail: "Operator review state changed", severity: "ELEVATED" },
    { id: "ev-08", time: "01:08 ago", title: "Brief revision saved", detail: "BRIEF-1142 · draft 03", severity: "ROUTINE" },
    { id: "ev-09", time: "01:22 ago", title: "Synthetic node marked quiet", detail: "LANTERN FIELD / display only", severity: "ROUTINE" },
    { id: "ev-10", time: "01:46 ago", title: "Scenario handoff complete", detail: "PAPER COMET · closed", severity: "ROUTINE" },
    { id: "ev-11", time: "02:14 ago", title: "Quality index recalculated", detail: "Local sample values refreshed", severity: "ELEVATED" },
    { id: "ev-12", time: "02:37 ago", title: "New training entry added", detail: "BLUE STATIC · sample B", severity: "ROUTINE" },
  ],
  alerts: [
    { id: "al-01", message: "Sample checksum requires a second review", severity: "CRITICAL", time: "02 min", acknowledged: false },
    { id: "al-02", message: "Meridian cadence outside the demo band", severity: "ELEVATED", time: "09 min", acknowledged: false },
    { id: "al-03", message: "Archive queue nearing the scenario threshold", severity: "ELEVATED", time: "18 min", acknowledged: false },
    { id: "al-04", message: "Routine handoff note is ready to file", severity: "ROUTINE", time: "31 min", acknowledged: true },
  ],
  metrics: [
    { id: "network", label: "Network health", value: 98, unit: "%", note: "SYNTHETIC" },
    { id: "satellite", label: "Satellite coverage", value: 84, unit: "%", note: "SIMULATED" },
    { id: "signal", label: "Signal quality", value: 76, unit: "%", note: "DISPLAY ONLY" },
    { id: "encryption", label: "Encryption strength", value: 100, unit: "%", note: "FICTIONAL" },
    { id: "channels", label: "Secure channels", value: 7, unit: "/ 9", note: "LOCAL PROP" },
    { id: "archive", label: "Archive size", value: 64, unit: "GB", note: "STAGED DATA" },
    { id: "queue", label: "Event queue", value: 18, unit: "ITEMS", note: "SEEDED" },
    { id: "load", label: "System load", value: 32, unit: "%", note: "SIMULATED" },
  ],
  briefs: [
    { id: "BRIEF-1142", title: "Echo Ledger / NIGHTGLASS", classification: "LEVEL 4 · FICTIONAL", text: "The glass corridor exercise is progressing within the designed scenario window. Review the echo ledger sample, reconcile the two invented relay intervals, and prepare a concise handoff for the next operator. All entries on this page are fabricated for the motion picture prop." },
    { id: "BRIEF-1160", title: "Cadence Notes / MERIDIAN", classification: "LEVEL 3 · FICTIONAL", text: "A synthetic cadence comparison was requested for the Meridian-7 exercise. No live signals or external records are involved. Annotate only the staged sample set." },
    { id: "BRIEF-1188", title: "Archive Review / LANTERN", classification: "LEVEL 2 · FICTIONAL", text: "This practice document covers the review path for a made-up archive checksum. Use the provided fictional pages and return the completed worksheet to the local prop archive." },
  ],
  threads: [
    { id: "th-01", name: "CHANNEL ALPHA", messages: [{ id: "msg-1", author: "quartz_08", initials: "Q8", text: "NIGHTGLASS review is queued. Sample packet is sealed.", time: "09:41" }, { id: "msg-2", author: "analyst_09", initials: "A9", text: "Copy. I am comparing the two fictional intervals now.", time: "09:43" }] },
    { id: "th-02", name: "MERIDIAN REVIEW", messages: [{ id: "msg-3", author: "cipher_12", initials: "C12", text: "The staged cadence chart is ready for annotation.", time: "09:38" }] },
    { id: "th-03", name: "ARCHIVE DESK", messages: [{ id: "msg-4", author: "relay_04", initials: "R4", text: "Checksum worksheet added to the prop archive.", time: "09:25" }] },
    { id: "th-04", name: "DUTY HANDOFF", messages: [{ id: "msg-5", author: "vector_03", initials: "V3", text: "PAPER COMET debrief is signed and closed.", time: "09:12" }] },
    { id: "th-05", name: "TRAINING ROOM", messages: [{ id: "msg-6", author: "quartz_08", initials: "Q8", text: "Synthetic sample B is ready for the next exercise.", time: "08:56" }] },
  ],
  assets: [
    { id: "asset-1", name: "KITE-04", type: "DRONE PROP", status: "STAGED" },
    { id: "asset-2", name: "RELAY-12", type: "SIGNAL PROP", status: "NOMINAL" },
    { id: "asset-3", name: "COURIER-02", type: "HANDOFF PROP", status: "STANDBY" },
  ],
  targets: ["SUBJECT NOVA", "SUBJECT PAPERWING", "SUBJECT GLASS-4"],
};