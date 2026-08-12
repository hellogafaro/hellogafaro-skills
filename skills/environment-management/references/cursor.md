# Cursor Cloud

## Default or custom

Use Cursor's default environment when it can install, run, and verify the repository reliably. Add the bundled base under `assets/cursor/` when reproducible runtimes or system tools are required. Copy its contents into the target repository's `.cursor/` directory, then adapt only verified requirements.

The base includes Node.js, Bun, Python, uv, GitHub CLI with Agent Skills support, Git, curl, jq, ripgrep, build tools, and archive utilities. Cursor supplies browser and computer-use capabilities; add a browser only when project tests require a specific executable.

## Lifecycle

- `Dockerfile` defines stable system tooling.
- `environment.json` selects the image and lifecycle hooks.
- `install.sh` installs locked project dependencies idempotently.
- `update.sh` is Cursor's cached update hook and calls `install.sh` after pulls.
- `start.sh` starts required runtime services.

Cursor's published schema supports `name`, `user`, `build`, `snapshot`, `install`, `start`, `terminals`, `ports`, `repositoryDependencies`, and `agentCanUpdateSnapshot`. `repositoryDependencies` grants token access; it does not clone repositories. Add optional fields only when required.

## Maintenance

Research current stable versions before changing pins. Verify release checksums, build or otherwise validate the image, inspect the diff, and refresh the Cursor environment after committing. Never place secrets in `environment.json` or the image.
