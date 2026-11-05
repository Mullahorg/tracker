import { useEffect, useRef, useState } from "react";

const rand = (n: number) => Math.floor(Math.random() * n);
const hex = (len = 4) => Array.from({ length: len }, () => rand(16).toString(16)).join("");
const ip = () => `${rand(223) + 1}.${rand(255)}.${rand(255)}.${rand(254) + 1}`;

/** Falling-code background drawn on a canvas. */
export function CodeRain({ opacity = 0.18 }: { opacity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const color = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#9f6";
    let cols: number[] = [];
    const size = 14;
    const resize = () => {
      c.width = c.offsetWidth;
      c.height = c.offsetHeight;
      cols = Array.from({ length: Math.ceil(c.width / size) }, () => rand(c.height / size));
    };
    resize();
    window.addEventListener("resize", resize);
    const chars = "01アイウエオカキクケコABCDEF0123456789<>/{}#$";
    const t = setInterval(() => {
      ctx.fillStyle = "rgba(10,12,14,0.12)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = color;
      ctx.font = `${size - 2}px monospace`;
      cols.forEach((y, i) => {
        ctx.fillText(chars[rand(chars.length)] ?? "0", i * size, y * size);
        cols[i] = y * size > c.height && Math.random() > 0.97 ? 0 : y + 1;
      });
    }, 55);
    return () => { clearInterval(t); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="code-rain" style={{ opacity }} aria-hidden="true" />;
}

const SCRIPT = [
  () => `$ nmap -sS -p- ${ip()}`,
  () => `  PORT ${rand(9000) + 20}/tcp open  ssh`,
  () => `$ ./handshake --cipher aes-256 --node ${hex(6)}`,
  () => `  [+] session key 0x${hex(8)}${hex(8)}`,
  () => `$ tracert ${ip()}`,
  () => `  hop ${rand(14) + 1}  ${ip()}  ${rand(80) + 3}ms`,
  () => `$ inject --payload pkg_${hex(4)}.bin`,
  () => `  [*] uploading ${rand(90) + 10}% ████████░░`,
  () => `$ decrypt --block ${hex(4)}:${hex(4)}`,
  () => `  [ok] checksum ${hex(8)}`,
  () => `  [!] firewall rule ${rand(900) + 100} bypassed`,
  () => `$ sniff --iface eth${rand(3)} --filter tcp`,
];

/** Self-typing terminal that streams command-like lines. */
export function LiveTerminal({ title = "root@node:~", speed = 260, lines = 14, className = "" }: { title?: string; speed?: number; lines?: number; className?: string }) {
  const [log, setLog] = useState<string[]>([]);
  useEffect(() => {
    let i = rand(SCRIPT.length);
    const t = setInterval(() => {
      setLog((l) => [...l.slice(-(lines - 1)), SCRIPT[i % SCRIPT.length]!()]);
      i++;
    }, speed);
    return () => clearInterval(t);
  }, [speed, lines]);
  return (
    <div className={`term-window ${className}`}>
      <div className="term-bar"><i /><i /><i /><span>{title}</span></div>
      <div className="term-body">
        {log.map((l, i) => <div key={i} className={l.startsWith("$") ? "cmd" : l.includes("[!]") ? "warn" : ""}>{l}</div>)}
        <span className="caret" />
      </div>
    </div>
  );
}

/** Rotating radar sweep with blips. */
export function Radar() {
  const [blips] = useState(() => Array.from({ length: 6 }, () => ({ x: 15 + rand(70), y: 15 + rand(70), d: rand(4000) })));
  return (
    <div className="radar" aria-hidden="true">
      <div className="radar-sweep" />
      {blips.map((b, i) => <span key={i} className="blip" style={{ left: `${b.x}%`, top: `${b.y}%`, animationDelay: `${b.d}ms` }} />)}
    </div>
  );
}

/** Scrolling hex dump column. */
export function HexStream({ rows = 10 }: { rows?: number }) {
  const [data, setData] = useState<string[]>([]);
  useEffect(() => {
    const t = setInterval(() => {
      setData((d) => [...d.slice(-(rows - 1)), `${hex(4).toUpperCase()}  ${Array.from({ length: 6 }, () => hex(2)).join(" ")}`]);
    }, 120);
    return () => clearInterval(t);
  }, [rows]);
  return <div className="hex-stream" aria-hidden="true">{data.map((d, i) => <div key={i}>{d}</div>)}</div>;
}

/** Animated bar meter (signal / CPU). */
export function Meters() {
  const [v, setV] = useState([40, 60, 30, 80, 50, 70, 20, 90, 45, 65, 35, 75]);
  useEffect(() => {
    const t = setInterval(() => setV((a) => a.map((x) => Math.max(8, Math.min(100, x + rand(31) - 15)))), 300);
    return () => clearInterval(t);
  }, []);
  return <div className="meters" aria-hidden="true">{v.map((x, i) => <span key={i} style={{ height: `${x}%` }} />)}</div>;
}

/** Network node graph with pulsing links. */
export function NetGraph() {
  const nodes: [number, number][] = [[10, 50], [28, 20], [30, 78], [52, 45], [70, 18], [74, 75], [90, 48]];
  const links: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6]];
  return (
    <svg className="netgraph" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {links.map(([a, b], i) => (
        <line key={i} x1={nodes[a]![0]} y1={nodes[a]![1]} x2={nodes[b]![0]} y2={nodes[b]![1]} style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
      {nodes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 6 ? 3 : 2} className={i === 6 ? "target" : ""} />)}
    </svg>
  );
}

/** Glitchy heading text. */
export function Glitch({ text }: { text: string }) {
  return <span className="glitch" data-text={text}>{text}</span>;
}
