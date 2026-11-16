# Voice Tracking System

A local web app that keeps podcast guests on time. A host and one guest each wear a microphone. The app detects who is speaking, runs a stopwatch only while the guest speaks, and shows it next to the target time for the current question. Both people watch one shared screen.

This README is the starting context for anyone working on the project. It describes the intended design.

## Scope of v1

In scope:

- One host and one guest.
- Turkish podcasts.
- Runs locally on a standard CPU only laptop.
- Audio recording (audio only, no video).

Out of scope for v1:

- Accounts or permissions.
- Transcription.
- A database.
- Automated tests.
- Zod or other runtime schema validation.
- More than two speakers.

## How a session works

1. The host creates a podcast: a title, a list of questions, and a target guest time per question. The list is fixed once the session starts.
2. The app detects who is speaking and drives the stopwatch (rules below).
3. The host moves to the next question with a button or keyboard shortcut. Auto-advance is an optional setting.
4. The audio and the results are saved in the podcast's folder.

### Stopwatch rules

- Runs only while the guest speaks.
- Freezes, and stays visible, when the guest stops.
- Accumulates if the guest returns to the same question.
- Resets on the next question.
- Keeps counting up, in red, after the target time is passed.

### Colors

- Green by default.
- Yellow when the remaining time drops under a configurable number of seconds.
- Red when over the target.

### Tolerances

Two separate, configurable tolerances, roughly 2 to 3 seconds by default:

- **Start delay:** speech must continue for N seconds before the guest counts as speaking. The timer is then backdated to the real start of the speech.
- **Stop delay:** silence must last N seconds before the guest counts as stopped.

When both people speak at once (overlap), the current state is kept.

## Speaker detection

Detection has two interchangeable strategies behind one interface. The tolerances apply to both.

1. **Channel strategy (primary).** Compares the level of each channel using an AudioWorklet. Used when the microphones arrive as separate channels.
2. **Voice strategy (fallback, built in v1).** Uses pitch and simple spectral features on a single mixed channel. The host records a short enrollment sample. Speech that does not match the host is treated as the guest.

### Setup check and strategy selection

A guided setup check detects the audio setup and picks the strategy. The possible setups are:

- Two distinct channels: channel strategy.
- Two identical channels: voice strategy.
- One mono channel: voice strategy.

The strategy can be overridden manually in settings.

### Audio requirements

Browser echo cancellation, noise suppression and auto-gain must be turned off. They distort the level comparison.

## Data and storage

- **settings.json:** all settings. Includes the tolerances, the yellow threshold in seconds, mic sensitivity, room-noise measurement, strategy choice and auto-advance. More settings will be added later, so the structure must make adding one easy.
- **podcasts/<sanitized title>/:** one folder per podcast, containing one JSON file and the audio file.
  - The JSON file holds the setup (title, questions, target times) and the actual guest time per question.
  - Titles are sanitized for file names. Duplicate titles are separated so one podcast never overwrites another.

## Test mode

A recorded audio file or the laptop microphone can stand in for the real microphones. Use it so development is never blocked by hardware.

## Tech stack

- TypeScript, Next.js (React), Tailwind CSS
- Web Audio API with AudioWorklet (levels)
- pitchy and Meyda, or similar small libraries (voice strategy). Not yet verified, so confirm they work before relying on them.
- MediaRecorder with webm
- Zustand for state
- pnpm build plus pm2 for local hosting
- settings.json and the podcasts/ folder for data

## Known risks and open issues

- **The microphone hardware is unverified.** The microphones are a wireless kit with one USB receiver. It is not known whether it outputs two separate channels or one mixed signal. This is why the voice strategy is part of v1. Two strategies guarantee there is always a path for any audio setup, but they do not guarantee that each path is accurate on the real hardware. Validation with the real microphone set is the final step of the project.
- **The voice strategy is the weaker one.** Pitch and simple spectral features may struggle with similar voices, overlap or laughter. Expect to tune it.
- **The receiver may process audio before the browser sees it** (noise gate, gain, ducking). This cannot be turned off from the browser.
- **Not yet decided:** the UI language and the code layout. Ask before assuming either.

## Related documents

- **Voice Tracking System report** (`VoiceTrackingSystem_Rapor.docx`, Turkish). The current source of truth for the project.
- **Proje Adımları** (`VoiceTrackingSystem_ProjeAdimlari.docx`, Turkish). The detailed project steps with sub-tasks, deliverables and dependencies. It splits the report's six steps into seven. Where the two differ, the report's high-level description still stands, and the difference should be raised with the team.

The task distribution (section 6 of the report) is intentionally empty for now.

## Future work

- Better voice differentiation (more than two speakers).
- A local database.
- Possibly transcription.

These are not part of v1. Do not build them unless asked.

## Working rules for agents

- **Do not assume, Ask.** If something is unclear or not covered here, ask the team before choosing for them.
- **Stay inside the v1 scope.** Do not add accounts, a database, transcription, Zod or automated tests. Do not add features beyond what is described here.
- **Ask before adding a dependency.** Prefer the browser's built-in APIs and small libraries.
- **Keep the strategies interchangeable.** Both detection strategies sit behind the same interface and share the same tolerances. Do not special-case one of them in the stopwatch or the UI.
- **Do not hardcode configurable values.** Tolerances, the yellow threshold, sensitivity and the other settings live in settings.json.
- **Never turn browser audio processing on.** Echo cancellation, noise suppression and auto-gain stay off.
- **Audio only.** Never record video.
- **Do not assume anything about the real microphone hardware.** Use test mode until it is validated.
- **Be careful with data.** Never overwrite an existing podcast folder. Sanitize titles for file names and separate duplicates.
- No em dashes.
- No tables unless absolutely necessary.