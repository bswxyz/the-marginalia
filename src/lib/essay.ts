/**
 * Tiny renderer for essay bodies.
 *
 * Essays are written as plain paragraphs separated by blank lines, with
 * `*italics*` and `[[noteId]]` anchors. We deliberately bypass the full
 * markdown pipeline so each paragraph can become a grid row that carries
 * its margin notes beside it — the site's whole reason to exist.
 */

export interface NoteDef {
  kind: 'author' | 'editor';
  text: string;
}

export interface ParaNote {
  id: string;
  kind: 'author' | 'editor';
  html: string;
  ref: string;
}

export interface Para {
  html: string;
  notes: ParaNote[];
}

/** the classical footnote sequence, as set by hand compositors */
const REFS = ['*', '†', '‡', '§', '‖', '¶'];

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** typographic niceties the copy desk would insist on */
function smarten(s: string): string {
  return s
    .replace(/(^|[\s(—])'(?=\S)/g, '$1‘') // opening single quote
    .replace(/'/g, '’'); // apostrophes & closing quotes
}

function inline(s: string): string {
  return smarten(esc(s)).replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

export function parseEssay(body: string, notes: Record<string, NoteDef>): Para[] {
  let refIndex = 0;
  return body
    .trim()
    .split(/\n\s*\n/)
    .map((raw) => {
      const collected: ParaNote[] = [];
      // split() with a capture group alternates [text, noteId, text, noteId, ...]
      const parts = raw.split(/\s*\[\[(\w+)\]\]/);
      let html = '';
      parts.forEach((part, i) => {
        if (i % 2 === 0) {
          html += inline(part);
          return;
        }
        const def = notes[part];
        if (!def) return; // unknown anchor: drop the marker, keep the prose
        const ref = REFS[refIndex % REFS.length];
        refIndex += 1;
        collected.push({ id: part, kind: def.kind, html: inline(def.text), ref });
        html += `<button class="mk" type="button" aria-controls="note-${part}" aria-expanded="true" title="Margin note ${ref}">${ref}</button>`;
      });
      return { html: html.trim(), notes: collected };
    });
}
