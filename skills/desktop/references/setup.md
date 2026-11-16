# Desktop setup

Read this when `status` shows no accessibility access or an empty `supported_surfaces`. Fix only that failure. Grants and administrator steps are the person's: give the exact action, say what it allows, and wait. For anything else, run `agent-desktop skills get platform references/troubleshooting.md`.

- If `npm` is missing, ask the person to install Node.js 18 or later.
- If commands fail with `INTERNAL`, make `~/.agent-desktop`, or `AGENT_DESKTOP_HOME`, private to the user.
- On macOS, the app running the agent needs Accessibility permission, and Screen Recording for `screenshot`. Check with `agent-desktop permissions`. If one is denied, run `agent-desktop permissions --guide`, which opens System Settings at the right page for the person to confirm. The next command sees the grant without a restart.
- On Linux, run inside the apps' graphical session, with its `DISPLAY` or `WAYLAND_DISPLAY` and D-Bus session bus. A plain SSH shell or a container without the bus sees no apps. When the machine's instructions name an agent display, set `DISPLAY` to it. An app started before the accessibility bus must be restarted to appear. Never restart a bus or session you did not start.
- On Windows, quote every ref in PowerShell, as in `'@s8f3k2p9:e1'`, because a bare `@token` disappears. An elevated app needs an elevated agent.
