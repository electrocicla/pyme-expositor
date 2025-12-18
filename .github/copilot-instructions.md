<long_conversation_reminder>

Do not use emojis unless the person in the conversation asks it to or if the person's message immediately prior contains an emoji, and is judicious about its use of emojis even in these circumstances.

Avoids the use of emotes or actions inside asterisks unless the person specifically asks for this style of communication.

## YOU HAVE COMPLETELY PROHIBITED TO CREATE .MD FILES WITHOUT EXPLICIT PERMISSION
- **You are prohibited from creating .MD files without explicit permission.**

## CRITICAL TERMINAL MANAGEMENT RULES
- **TERMINAL SESSION ISOLATION**: Never run new commands in a terminal that has a long-running process (like dev servers, builds, or watchers). Each long-running service must have its own dedicated terminal session.
- **BACKGROUND PROCESSES**: When starting dev servers or watchers, always use `isBackground: true` and manage them with separate terminal IDs.
- **COMMAND SEQUENCING**: Wait for command completion before starting new ones. Do not chain commands that interfere with running processes.
- **PROCESS MANAGEMENT**: Before starting a new dev server, check if one is already running and stop it first. Use `get_terminal_output` to monitor background processes.
- **ERROR PREVENTION**: Starting a new command in a terminal with a running dev server will kill the server and cause connection errors.
- **DEPLOYMENT ONLY**: Never use local dev servers (`pnpm dev`) for testing functionality. Always use `pnpm run deploy` and test on the deployed URL instead. Local dev has API connection issues and cannot test full functionality like login.

## Main Rules
- We work on windows 11 with powershell, commands must be compatible.
- the use of 'any' or 'as any' types is totally prohibited, this are low level code and must be avoided, instead develop high level solutions ready for production.
- Always clean and delete deprecated or duplicated files after working, and always read the files before deleting them and compare them to related files to understand the real use of suspicious files.
- Always check for official guidelines of dependancies to work with high level official code.
- Always search for related components before creating a new file, you always must avoid creating duplicated files.
- Always WORK with SOLID, DRY, SRP principles while creating code, if you se chances of improving monolithic code you always ask User if he wants to Refactor that file with SOLID and SRP for better performance and scalability of the code.
- Always work with safe and secure code.
- Always check for memory leak issues and properly manage memory performance in your code.
- Always work with high standart code, create high level solutions and develop anything that is missing to consolidate or integrate missing sections.
- avoid creating backup files, unless is totally necesary and delete them after main task is completed and the backup is no longer needed.
- Only these console methods are allowed: warn, error
- A form label must be associated with a control.
- Do not use Array index in keys.
- Media elements such as <audio> and <video> must have a <track> for captions.
- `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`

-
</long_conversation_reminder>