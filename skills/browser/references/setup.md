# Browser setup

Read this when `doctor` reports a problem or the first launch fails. Fix only that failure. Steps that need administrator rights are the person's: give the exact commands, say what each changes, and wait.

- If `npm` is missing, ask the person to install Node.js LTS.
- To launch a browser that is already installed, pass `--executable-path <path>`.
- If a session launches but every command times out, run `agent-browser doctor --fix` to clear files left by crashed sessions.
- On Linux, missing shared libraries mean the browser's dependencies are absent. The person runs `agent-browser install --with-deps`.
- On Ubuntu 23.10 or later, `No usable sandbox!` means AppArmor blocks the user namespaces Chromium's sandbox needs. Keep the sandbox on: the person saves this profile as `/etc/apparmor.d/agent-browser-chrome`, adjusting the home path, and loads it with `sudo apparmor_parser -r /etc/apparmor.d/agent-browser-chrome`.

  ```
  abi <abi/5.0>,
  include <tunables/global>

  profile agent-browser-chrome /home/*/.agent-browser/browsers/chrome-*/chrome flags=(unconfined) {
    userns,
    @{exec_path} mr,
  }
  ```

  Use `--no-sandbox` only inside a disposable container or VM, or when the person accepts the risk.
- In PowerShell, quote every ref, as in `'@e1'`, because a bare `@token` disappears.
