import React, { useMemo } from 'react';
import { SvgXml } from 'react-native-svg';

type IconProps = {
  color: string;
  size: number;
};

function colorizeStroke(xml: string, color: string): string {
  // Gli SVG qui hanno stroke="currentColor" (o #000000). Li “patchiamo” runtime
  // per evitare transformer/loader esterni.
  return (
    xml
      // currentColor -> hardcode del colore
      .replace(/stroke="currentColor"/g, `stroke="${color}"`)
      .replace(/stroke="#000000"/g, `stroke="${color}"`)
  );
}

// SVG raw (da /assets/*.svg)
const ROUTE_XML = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.5 5H11.9344C14.9816 5 16.5053 5 17.0836 5.54729C17.5836 6.02037 17.8051 6.71728 17.6702 7.39221C17.514 8.17302 16.2701 9.05285 13.7823 10.8125L9.71772 13.6875C7.2299 15.4471 5.98599 16.327 5.82984 17.1078C5.69486 17.7827 5.91642 18.4796 6.41636 18.9527C6.99474 19.5 8.51836 19.5 11.5656 19.5H12.5M8 5C8 6.65685 6.65685 8 5 8C3.34315 8 2 6.65685 2 5C2 3.34315 3.34315 2 5 2C6.65685 2 8 3.34315 8 5ZM22 19C22 20.6569 20.6569 22 19 22C17.3431 22 16 20.6569 16 19C16 17.3431 17.3431 16 19 16C20.6569 16 22 17.3431 22 19Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const ID_XML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-id-card-icon lucide-id-card"><path d="M16 10h2"/><path d="M16 14h2"/><path d="M6.17 15a3 3 0 0 1 5.66 0"/><circle cx="9" cy="11" r="2"/><rect x="2" y="5" width="20" height="14" rx="2"/></svg>`;

const TICKET_XML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ticket-icon lucide-ticket"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>`;

const SEND_XML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send-icon lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>`;

const LOCK_KEYHOLE_XML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-keyhole-icon lucide-lock-keyhole"><circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg>`;

const CLOCK_4_XML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock4-icon lucide-clock-4"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;

export function RouteIcon({ color, size }: IconProps) {
  const xml = useMemo(() => colorizeStroke(ROUTE_XML, color), [color]);
  return <SvgXml xml={xml} width={size} height={size} />;
}

export function IdCardIcon({ color, size }: IconProps) {
  const xml = useMemo(() => colorizeStroke(ID_XML, color), [color]);
  return <SvgXml xml={xml} width={size} height={size} />;
}

export function TicketIcon({ color, size }: IconProps) {
  const xml = useMemo(() => colorizeStroke(TICKET_XML, color), [color]);
  return <SvgXml xml={xml} width={size} height={size} />;
}

export function SendIcon({ color, size }: IconProps) {
  const xml = useMemo(() => colorizeStroke(SEND_XML, color), [color]);
  return <SvgXml xml={xml} width={size} height={size} />;
}

export function LockKeyholeIcon({ color, size }: IconProps) {
  const xml = useMemo(() => colorizeStroke(LOCK_KEYHOLE_XML, color), [color]);
  return <SvgXml xml={xml} width={size} height={size} />;
}

export function Clock4Icon({ color, size }: IconProps) {
  const xml = useMemo(() => colorizeStroke(CLOCK_4_XML, color), [color]);
  return <SvgXml xml={xml} width={size} height={size} />;
}

