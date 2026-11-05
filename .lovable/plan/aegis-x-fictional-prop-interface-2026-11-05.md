# AEGIS X fictional prop interface

## Build
- Replace the placeholder at `/` with a secure-access splash that can proceed to the command center.
- Create a dark, restrained design system and shared shell with navigation, live local clock, layout controls, and persistent fictional-prop notices.
- Add a dashboard with fictional SVG geography, seeded mission/event/alert/status data, client-side search, local comms, acknowledgments, and a document viewer.
- Add mission list/detail pages, objective editing, evidence placeholders, and an admin panel with a clearly fake gate and localStorage-backed demo data.
- Add a printable fictional report with a print action and dedicated print styling.

## Safety and implementation
- Keep all data fabricated and browser-local. Do not access devices, real maps, external APIs, or networks.
- Use the existing TanStack Start routes and installed UI dependencies; add route metadata and accessibility/reduced-motion behavior.
- Verify core route navigation and interactions, then inspect preview diagnostics and run relevant tests.
