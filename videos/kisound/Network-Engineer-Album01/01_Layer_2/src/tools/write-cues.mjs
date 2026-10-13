import fs from 'node:fs';
import {CHAPTERS,SHOTS,EDITORIAL,DURATION} from '../render/config.js';
import {Timeline} from '../render/timeline.js';
const root=new URL('../../',import.meta.url),tl=new Timeline(JSON.parse(fs.readFileSync(new URL('ASTRA-AUDIO-ANALYSE.json',root))));
const tc=t=>`${String(Math.floor(t/3600)).padStart(2,'0')}:${String(Math.floor(t/60)%60).padStart(2,'0')}:${(t%60).toFixed(3).padStart(6,'0')}`;
const actions=[
 'OSI-Ebenen öffnen; Anfangstitel über der aktiven Layer-2-Ebene.',
 'Switch-Topologie zwischen Signal und Routinghorizont öffnen; Frame rastet an E004 ein.',
 'ARP-Cache miss, Request im VLAN 10, Unicast Reply, Cache-Auflösung. Pegellücke nimmt Licht zurück.',
 'Vorhandener ARP-Cache trifft auf gealterten FDB-Eintrag; Flooding, anschliessend gezielte Weiterleitung.',
 'Quell-MAC lernen, Frame verfolgen, 802.1Q-Tag einsetzen, Broadcast-Grenze zeigen.',
 'Root-Bridge und redundanten Port zeigen; klassische STP-Zustände.',
 'VLAN 10 und VLAN 3 getrennt auf gemeinsamem Trunk; Frame stoppt am blockierten Port.',
 'BPDU, Trunk, Access-Port, MAC move P1 → P3 und stabiler Baum.',
 'L2TPv3-Kontrollverbindung und Sitzung; Ethernet kapseln, über IP transportieren und auspacken.',
 'Explizite Loop-Demo bei deaktiviertem STP; Frame-Kopien im Kreis, MAC-Flapping.',
 'STP wieder aktiv: Listening, Learning, Forwarding; SW-03 P26 blockiert ab 113 s.',
 'Stabilen Baum in die OSI-Schichtung zurückführen; strittige E030-Grenze steuert keinen Schnitt.',
 'Switching domain erneut öffnen; MAC-Matrix und ausgewählten Pfad zeigen.',
 'Frame-Perspektive der Reprise: Lernen, Übertragung, Tagging und Broadcast-Domain.',
 'Root-Information und redundanten blockierten Pfad aus Gegenperspektive zeigen.',
 'VLAN-Reprise mit räumlicher Tiefe und lesbarem Trunk-Tag.',
 'Trunk, Access-Ausgang und MAC move P3 → P7; danach stabiles Netz.',
 'LLDP-Ankündigungen auf direkten Links; Nachbar-/Porttabelle.',
 'LACP-Actor/Partner und Synchronisation; zwei Mitglieder werden ein logischer Link.',
 'Zwei unterscheidbare Flows bleiben jeweils auf einem festen Mitglied.',
 'Montage der bereits eingeführten VLAN-, Frame- und Tunnelmechanismen.',
 'Aktive Schlusstotale; LAYER 2 und SAMUEL HEINRICH bis zum tatsächlichen Ende.',
];
const chapters=CHAPTERS.map((c,i)=>({...c,action:actions[i],event_ids:[...new Set(tl.shots.filter(s=>s.start<c.end&&s.end>c.start).flatMap(s=>s.eventIds))],lyric_ids:[...new Set(tl.shots.filter(s=>s.start<c.end&&s.end>c.start).flatMap(s=>s.lyricIds))]}));
const data={schema:'kisound.layer2.cues.v1',duration_s:DURATION,chapters,shots:tl.shots,editorial:EDITORIAL.map((e,i)=>({...e,event_ids:tl.shots[i].eventIds,lyric_ids:tl.shots[i].lyricIds})),excluded_as_trigger:[{id:'E030',reason:'Abschnittsmarke widerspricht überlappendem automatischem Gesangssegment L020'}]};
fs.writeFileSync(new URL('UMSETZUNG-CUES.json',root),JSON.stringify(data,null,2)+'\n');
let md='# Layer 2 · Umsetzung und Cues\n\nMessdaten und Transkriptzeiten bleiben im ASTRA-JSON unverändert. V-IDs sind redaktionelle Bildaktionen; E- und L-IDs verweisen auf die vorhandenen Quellen.\n\n## Kapitel\n\n| Kapitel | Start–Ende | Handlung | Audio-Cues | Lyrics |\n| --- | --- | --- | --- | --- |\n';
for(const c of chapters)md+=`| ${c.id} ${c.title} | ${tc(c.start)}–${tc(c.end)} | ${c.action} | ${c.event_ids.join(', ')||'redaktionell'} | ${c.lyric_ids.join(', ')||'instrumental laut Quelle'} |\n`;
md+='\n## Einstellungen\n\n| ID / V-ID | Start–Ende | Raum / Kamera / Handlung | E-IDs | L-IDs |\n| --- | --- | --- | --- | --- |\n';
tl.shots.forEach((s,i)=>md+=`| ${s.id} / ${EDITORIAL[i].id} | ${tc(s.start)}–${tc(s.end)} | ${s.zone} / ${s.camera} / ${s.mode} | ${s.eventIds.join(', ')} | ${s.lyricIds.join(', ')} |\n`);
md+='\n## Präzisierungen\n\n- E030 ist nur als Quelle erhalten, nicht als Trigger. L020 bleibt 119,420–133,620 s; kein behaupteter Instrumentalbeginn bei 125,080 s.\n- E019 und E020 liegen beide bei 71,300 s. Die gespeicherten RMS-Werte zeigen eine kurze Lücke, danach den starken Anstieg. Das Bild nimmt Licht zurück und öffnet sich anschliessend.\n- VLAN 3 ersetzt VLAN 30 aus dem früheren Drehbuch, entsprechend den Lyrics.\n- Ab 171,760 s bleiben 38,200166667 Sekunden gestaltete instrumentale Musik.\n- Schlussblende entfällt: RMS und E045 zeigen bis zum Ende Aktivität. Titel und Bewegung bleiben bis zum letzten Frame.\n';
fs.writeFileSync(new URL('UMSETZUNG-CUES.md',root),md);console.log(`${CHAPTERS.length} Kapitel, ${SHOTS.length} Einstellungen und ${EDITORIAL.length} kreative Aktionen dokumentiert.`);
