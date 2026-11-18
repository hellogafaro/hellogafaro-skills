# Browser setup

Read this when `doctor` reports a problem, the first launch fails, or `~/.agent-browser/config.json` doesn't name Fortress. Fix only that failure. Steps that need administrator rights are the person's: give the exact commands, say what each changes, and wait.

- If `npm` is missing, ask the person to install Node.js LTS.
- Fortress lives in `~/.local/share/fortress/<version>/fortress-<n>/`, from the Linux release at https://github.com/tiliondev/fortress, and `~/.local/share/fortress/current` links to the version in use. The config is `{"executablePath": "<home>/.local/share/fortress/current/tilion"}`. To update Fortress, unpack the new release beside the old one, repoint `current`, and check a launch before deleting the old version.
- If a session launches but every command times out, run `agent-browser doctor --fix` to clear files left by crashed sessions.
- `doctor` warns that Fortress's Chromium is behind Chrome stable until a Fortress release catches up. Report it; don't install Chrome to silence it.
- On Linux, missing shared libraries mean the browser's dependencies are absent. The person installs them with the distribution's packages for Chromium.
- On Ubuntu 23.10 or later, `No usable sandbox!` means AppArmor blocks the user namespaces Chromium's sandbox needs. Fortress's profile is `/etc/apparmor.d/agent-desktop-fortress`. If it is missing, the person saves this profile there, adjusting the home path, and loads it with `sudo apparmor_parser -r /etc/apparmor.d/agent-desktop-fortress`.

  ```
  abi <abi/5.0>,
  include <tunables/global>

  profile agent-desktop-fortress /home/*/.local/share/fortress/*/fortress-*/chrome flags=(unconfined) {
    userns,
    @{exec_path} mr,
  }
  ```

  The same error from a browser under `~/.agent-browser/browsers/` means a session launched agent-browser's own Chrome instead of Fortress: fix the config, never the sandbox. Use `--no-sandbox` only inside a disposable container or VM.
- In PowerShell, quote every ref, as in `'@e1'`, because a bare `@token` disappears.
