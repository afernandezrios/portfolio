---
title: "Explain-Draw AI"
description: "Paste a topic and get a narrated explainer video, drawn and voiced on your own machine."
video: "/assets/projects/explain-draw-ai.mp4"
stack: ["TypeScript", "Next.js", "React", "Remotion"]
github: "https://github.com/afernandezrios/explain-draw-ai"
---

### From prompt to finished video

An explainer video normally requires several separate steps: writing the script, planning the scenes, 
recording the narration, creating the animations, and putting everything together. **Explain-Draw AI 
combines these steps into one workflow:** you provide a prompt, AI creates the script and storyboard, 
and the rest of the video is generated automatically on your computer.

<svg viewBox="0 0 688 210" role="img" style="display:block;width:100%;height:auto;margin:0.75rem 0 1.25rem">
<title>Two model calls turn pasted text into a script and a storyboard. Local validation and a render worker turn the storyboard into scene clips and a joined video. Everything lands in the project folder.</title>
<rect x="10" y="28" width="86" height="42" rx="6" style="fill:var(--surface);stroke:var(--border)" />
<text x="53" y="53" text-anchor="middle" font-size="11.5" style="fill:var(--text)">Pasted text</text>
<rect x="126" y="28" width="46" height="42" rx="6" style="fill:none;stroke:var(--accent)" />
<text x="149" y="53" text-anchor="middle" font-size="11.5" style="fill:var(--accent)">Model</text>
<rect x="202" y="28" width="52" height="42" rx="6" style="fill:var(--surface);stroke:var(--border)" />
<text x="228" y="53" text-anchor="middle" font-size="11.5" style="fill:var(--text)">Script</text>
<rect x="284" y="28" width="46" height="42" rx="6" style="fill:none;stroke:var(--accent)" />
<text x="307" y="53" text-anchor="middle" font-size="11.5" style="fill:var(--accent)">Model</text>
<rect x="360" y="28" width="79" height="42" rx="6" style="fill:var(--surface);stroke:var(--border)" />
<text x="400" y="53" text-anchor="middle" font-size="11.5" style="fill:var(--text)">Storyboard</text>
<rect x="469" y="28" width="79" height="42" rx="6" style="fill:var(--surface);stroke:var(--border)" />
<text x="508" y="53" text-anchor="middle" font-size="11.5" style="fill:var(--text)">Validation</text>
<rect x="578" y="28" width="99" height="42" rx="6" style="fill:var(--surface);stroke:var(--border)" />
<text x="627" y="53" text-anchor="middle" font-size="11.5" style="fill:var(--text)">Render worker</text>
<g style="stroke:var(--muted);fill:var(--muted)">
<line x1="101" y1="49" x2="118" y2="49" />
<polygon points="123,49 117,45.5 117,52.5" />
<line x1="177" y1="49" x2="194" y2="49" />
<polygon points="199,49 193,45.5 193,52.5" />
<line x1="259" y1="49" x2="276" y2="49" />
<polygon points="281,49 275,45.5 275,52.5" />
<line x1="335" y1="49" x2="352" y2="49" />
<polygon points="357,49 351,45.5 351,52.5" />
<line x1="444" y1="49" x2="461" y2="49" />
<polygon points="466,49 460,45.5 460,52.5" />
<line x1="553" y1="49" x2="570" y2="49" />
<polygon points="575,49 569,45.5 569,52.5" />
</g>
<g style="stroke:var(--border);fill:none" stroke-dasharray="3 3">
<line x1="53" y1="70" x2="53" y2="140" />
<line x1="228" y1="70" x2="228" y2="140" />
<line x1="400" y1="70" x2="400" y2="140" />
<line x1="627" y1="70" x2="627" y2="140" />
</g>
<rect x="10" y="140" width="668" height="56" rx="6" style="fill:var(--surface);stroke:var(--border)" />
<text x="26" y="163" font-size="10" letter-spacing="0.08em" style="fill:var(--muted);font-family:var(--font-mono)">PROJECT FOLDER</text>
<text x="26" y="183" font-size="11" style="fill:var(--text);font-family:var(--font-mono)">input · script · storyboard · narration/ · clips/ · out.mp4</text>
</svg>

### Simple, predictable scenes

Instead of asking the AI to describe every detail of a drawing, each scene has a specific type, 
such as a title, list, flow, diagram, sequence or code example. The system decides how each type
should look and move. This keeps the videos visually consistent and prevents the AI from producing
impossible or overly complicated scenes.

### AI is checked before it is trusted

The AI generates the script and storyboard, but it doesn't get the final say. Every storyboard is
checked automatically to make sure it follows the rules of the video. If something is wrong, the
system gives the AI one opportunity to fix it. If it still doesn't meet the requirements, the 
problematic version is rejected rather than allowing it to produce a broken video.

### Designed to run on a normal computer

The system is designed to run locally rather than relying on a large server infrastructure. Only the
AI requests need to leave the machine; the narration, animation and video generation happen locally. 
The application also makes sure that only one video is rendered at a time, avoiding conflicts when 
several processes try to use the computer simultaneously.

### Narration and animation stay synchronized

Each scene is narrated and animated separately. The system measures the actual length of the generated
audio rather than guessing it. The animation is then adjusted to fit the narration while keeping a small 
pause between scenes. If the narration is too long to fit, the system stops instead of speeding up or 
cutting off the voice.

### Built around real outputs

The entire pipeline uses the same tools that produce the final videos, including real speech synthesis, 
browser-based rendering and video processing.
