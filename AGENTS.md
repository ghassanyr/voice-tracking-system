# Agent instructions

Read [README.md] first. It describes the project, its v1 scope, the speaker detection design and the known risks. This file holds the rules for working on it.

## Working rules

- **Do not assume, Ask.** If something is unclear or not covered in the README, ask the team before choosing for them.
- **Stay inside the v1 scope.** Do not add accounts, a database, transcription, Zod or automated tests. Do not add features beyond what is described in the README.
- **Ask before adding a dependency.** Prefer the browser's built in APIs and small libraries.
- **Keep the strategies interchangeable.** Both detection strategies sit behind the same interface and share the same tolerances. Do not special case one of them in the stopwatch or the UI.
- **Do not hardcode configurable values.** Tolerances, the yellow threshold, sensitivity and the other settings live in settings.json.
- **Never turn browser audio processing on.** Echo cancellation, noise suppression and auto-gain stay off.
- **Audio only.** Never record video.
- **Do not assume anything about the real microphone hardware.** Use test mode until it is validated.
- **Be careful with data.** Never overwrite an existing podcast folder. Sanitize titles for file names and separate duplicates.

## Writing style

- No em dashes.