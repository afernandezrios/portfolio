---
title: "Explain-Draw AI"
description: "Paste a topic and get a narrated explainer video, drawn and voiced on your own machine."
video: "/assets/projects/explain-ai-demo.mp4"
stack: ["TypeScript", "Next.js", "React", "Remotion"]
github: "https://github.com/afernandezrios/explain-draw-ai"
---

# From prompt to finished video

An explainer video normally requires several separate steps: 
- writing the script
- planning the scenes
- recording the narration
- creating the animations
- putting everything together

**Explain-Draw AI combines these steps into one workflow:** you provide a prompt, AI creates the script 
and storyboard and the rest of the video is generated automatically on your computer.

![explain-draw-ai-arc](/portfolio/assets/projects/explain-ai-arc.svg)

# Simple, predictable scenes

Instead of asking the AI to describe every detail of a drawing, each scene has a specific type, 
such as a title, list, flow, diagram, sequence or code example. 

The system decides how each type should look and move. This keeps the videos visually consistent 
and prevents the AI from producing impossible or overly complicated scenes.

# AI is checked before it is trusted

The AI generates the script and storyboard but it doesn't get the final say. Every storyboard is
checked automatically to make sure it follows the rules of the video (for example, duration <5 min). 

If something is wrong, the system gives the AI one opportunity to fix it. If it still doesn't meet
the requirements, the problematic version is rejected rather than allowing it to produce a broken video.

# Designed to run on a normal computer

The system is designed to run locally rather than relying on a large server infrastructure. Only the
AI requests need to leave the machine. The narration, animation and video generation happen locally.

The application also makes sure that only one video is rendered at a time, avoiding conflicts when 
several processes try to use the computer simultaneously.

# Narration and animation stay synchronized

Each scene is narrated and animated separately. The system measures the actual length of the generated
audio rather than guessing it. 

The animation is then adjusted to fit the narration while keeping a small 
pause between scenes.

If the narration is too long to fit, the system stops instead of speeding up or 
cutting off the voice.

# Built around real outputs

The entire pipeline uses the same tools that produce the final videos, including real speech synthesis, 
browser-based rendering and video processing.