#!/usr/bin/env bash
# init-history.sh
#
# Interactive script to initialize a git repo and commit an existing project
# in a sequence of logical, well-messaged Conventional Commits.
#
# All commits use the CURRENT date/time. No backdating, no fabricated timeline.
# The repo's history will honestly show: "imported on <today>, incremental
# commits going forward" — just organized into sensible chunks instead of one
# giant initial commit.
#
# After committing, optionally creates a GitHub repo via `gh` and pushes.

set -euo pipefail

# ---------- helpers ----------

# Print a section header so the user can follow what's happening.
hdr() { printf '\n\033[1;36m== %s ==\033[0m\n' "$1"; }
info() { printf '\033[0;36m   %s\033[0m\n' "$1"; }
warn() { printf '\033[0;33m   %s\033[0m\n' "$1"; }
err()  { printf '\033[0;31m   %s\033[0m\n' "$1" >&2; }

# Prompt for a value with an optional default. Re-prompts if required and blank.
ask() {
  local prompt="$1" default="${2-}" required="${3-}" reply
  while :; do
    if [[ -n "$default" ]]; then
      read -r -p "$prompt [$default]: " reply
      reply="${reply:-$default}"
    else
      read -r -p "$prompt: " reply
    fi
    if [[ -z "$reply" && "$required" == "required" ]]; then
      warn "Value required."
      continue
    fi
    printf '%s' "$reply"
    return
  done
}

# Yes/no prompt, default provided (y or n).
ask_yn() {
  local prompt="$1" default="$2" reply
  local hint="[y/N]"; [[ "$default" == "y" ]] && hint="[Y/n]"
  while :; do
    read -r -p "$prompt $hint " reply
    reply="${reply:-$default}"
    case "$reply" in
      y|Y|yes|YES) return 0 ;;
      n|N|no|NO)   return 1 ;;
      *) warn "Please answer y or n." ;;
    esac
  done
}

# Commit whatever is currently staged, with the given conventional message.
# Uses `git commit --allow-empty=no` semantics — we check staging first and skip
# if nothing is staged (keeps the script idempotent across re-runs).
do_commit() {
  local msg="$1"
  if git diff --cached --quiet; then
    info "nothing staged, skipping: $msg"
    return
  fi
  git commit -q -m "$msg"
  local sha
  sha=$(git rev-parse --short HEAD)
  printf '   \033[0;32m✓\033[0m %s  %s\n' "$sha" "$msg"
  COMMIT_COUNT=$((COMMIT_COUNT + 1))
}

# Stage a list of paths (if any exist), then commit with the given message.
# Globs are expanded by the caller — we only stage paths that actually exist.
stage_and_commit() {
  local msg="$1"; shift
  local any=0
  for p in "$@"; do
    if [[ -e "$p" ]]; then
      git add -- "$p"
      any=1
    fi
  done
  if [[ "$any" -eq 1 ]]; then
    do_commit "$msg"
  fi
}

# Stage every path matching a glob pattern (relative to repo root), commit.
# Safer than shell globs because it uses `git ls-files -o --exclude-standard`
# to only touch untracked files — so re-running doesn't re-commit tracked ones.
stage_glob_and_commit() {
  local msg="$1"; shift
  local pattern="$1"
  local files
  # -o = others (untracked), respecting .gitignore
  mapfile -t files < <(git ls-files -o --exclude-standard -- "$pattern" 2>/dev/null || true)
  if [[ ${#files[@]} -eq 0 ]]; then
    return
  fi
  git add -- "${files[@]}"
  do_commit "$msg"
}

# ---------- collect inputs ----------

hdr "Project git history initializer"
cat <<'EOF'
   This will initialize a git repo in a folder you specify and create a
   sequence of conventional commits grouped by area. All commits use today's
   date. You can optionally create a GitHub repo and push at the end.
EOF

REPO_PATH=$(ask "Repo folder path" "$(pwd)" required)
REPO_PATH="${REPO_PATH/#\~/$HOME}"  # expand ~
if [[ ! -d "$REPO_PATH" ]]; then
  err "Not a directory: $REPO_PATH"
  exit 1
fi

AUTHOR_NAME=$(ask "Author name (e.g. Jane Doe)" "" required)
AUTHOR_EMAIL=$(ask "Author email" "" required)
REPO_NAME=$(ask "Repo name (used if we create on GitHub)" "$(basename "$REPO_PATH")" required)

BRANCH="main"
DEFAULT_GH_VIS="private"
GH_VIS=$(ask "GitHub visibility if we create it (public/private)" "$DEFAULT_GH_VIS")
case "$GH_VIS" in public|private) : ;; *) GH_VIS="private" ;; esac

hdr "Summary"
info "repo path : $REPO_PATH"
info "author    : $AUTHOR_NAME <$AUTHOR_EMAIL>"
info "repo name : $REPO_NAME"
info "branch    : $BRANCH"
info "gh vis.   : $GH_VIS"

if ! ask_yn "Proceed?" "y"; then
  warn "Aborted."
  exit 0
fi

cd "$REPO_PATH"

# ---------- init repo ----------

hdr "Initializing git repo"
if [[ -d .git ]]; then
  info "Repo already initialized, reusing."
else
  git init -q -b "$BRANCH"
  info "git init -b $BRANCH"
fi

# Set identity locally (not global) so we don't clobber user's global config.
git config user.name  "$AUTHOR_NAME"
git config user.email "$AUTHOR_EMAIL"
info "local user.name  = $AUTHOR_NAME"
info "local user.email = $AUTHOR_EMAIL"

# ---------- .gitignore guardrail ----------
# If there's no .gitignore yet, drop in a sensible default so we don't
# accidentally commit node_modules, build outputs, env files, etc.
if [[ ! -f .gitignore ]]; then
  hdr "Adding default .gitignore"
  cat > .gitignore <<'GITIGNORE'
# Dependencies
node_modules/
.pnp
.pnp.js

# Build output
dist/
build/
.next/
out/

# Env files
.env
.env.*
!.env.example

# Editor / OS
.DS_Store
.vscode/
.idea/
*.swp

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Test / coverage
coverage/
.nyc_output/
GITIGNORE
  info "wrote .gitignore"
fi

# ---------- commit in logical batches ----------
# Strategy: walk through the project in a sensible build order. Each
# stage_*_and_commit call stages matching untracked files and commits them
# with a conventional message. Empty batches are silently skipped.

COMMIT_COUNT=0
hdr "Creating commits"

# 1. Project scaffolding: README, license, editorconfig — things reviewers
#    expect to see first in history.
stage_and_commit "chore: initial project scaffolding" \
  README.md readme.md README LICENSE LICENCE LICENSE.md .editorconfig .gitignore

# 2. Package manifest (dependencies declared).
stage_and_commit "chore(deps): add package manifest" \
  package.json pnpm-workspace.yaml

# 3. Lockfiles (separate commit — lockfile diffs are noisy).
stage_and_commit "chore(deps): add lockfile" \
  package-lock.json pnpm-lock.yaml yarn.lock bun.lock bun.lockb

# 4. TypeScript config.
stage_and_commit "build(ts): add TypeScript configuration" \
  tsconfig.json tsconfig.app.json tsconfig.node.json

# 5. Build tooling (Vite / webpack / rollup / Next etc).
stage_and_commit "build: add Vite configuration" \
  vite.config.ts vite.config.js vitest.config.ts vitest.config.js
stage_and_commit "build: add bundler configuration" \
  webpack.config.js rollup.config.js next.config.js next.config.mjs

# 6. Styling pipeline.
stage_and_commit "build(styles): add Tailwind and PostCSS config" \
  tailwind.config.ts tailwind.config.js postcss.config.js postcss.config.cjs

# 7. Linting / formatting.
stage_and_commit "chore(lint): add ESLint and Prettier config" \
  eslint.config.js .eslintrc .eslintrc.json .eslintrc.js .prettierrc .prettierrc.json prettier.config.js

# 8. UI primitives / component registry (shadcn etc).
stage_and_commit "chore(ui): add component registry config" \
  components.json

# 9. HTML entry.
stage_and_commit "feat: add HTML entry point" \
  index.html public/index.html

# 10. Public/static assets.
stage_and_commit "feat(public): add static assets" \
  public

# 11. App entry + root.
stage_and_commit "feat(app): add application entry and root component" \
  src/main.tsx src/main.ts src/main.jsx src/main.js \
  src/index.tsx src/index.ts src/index.jsx src/index.js \
  src/App.tsx src/App.jsx src/App.css \
  src/vite-env.d.ts

# 12. Global styles.
stage_and_commit "feat(styles): add global stylesheet and design tokens" \
  src/index.css src/styles src/app/globals.css

# 13. Asset imports (images, fonts) bundled in src/.
stage_and_commit "feat(assets): add project images and media" \
  src/assets

# 14. Utility libraries.
stage_and_commit "feat(lib): add shared utilities" \
  src/lib src/utils src/util

# 15. Custom hooks.
stage_and_commit "feat(hooks): add custom React hooks" \
  src/hooks

# 16. UI primitive components (shadcn/ui wrappers).
stage_and_commit "feat(ui): add shadcn UI primitive components" \
  src/components/ui

# 17. Feature components — commit per subfolder under src/components so the
#     history reads like "built each section one at a time" instead of one
#     massive dump.
if [[ -d src/components ]]; then
  # Iterate direct subfolders of src/components (excluding ui which we already
  # committed above).
  while IFS= read -r -d '' dir; do
    sub=$(basename "$dir")
    [[ "$sub" == "ui" ]] && continue
    stage_and_commit "feat(components): add ${sub} section components" "$dir"
  done < <(find src/components -mindepth 1 -maxdepth 1 -type d -print0 2>/dev/null)
  # Any remaining loose files directly under src/components.
  stage_glob_and_commit "feat(components): add top-level components" "src/components/*"
fi

# 18. Pages / routes.
stage_and_commit "feat(pages): add application pages and routes" \
  src/pages src/app src/routes

# 19. Test setup and tests.
stage_and_commit "test: add test setup and suites" \
  src/test src/tests src/__tests__ vitest.setup.ts jest.config.js

# 20. Anything else still untracked in src/ — guarantees we don't leave files
#     behind no matter what exotic structure the project has.
stage_glob_and_commit "feat: add remaining source files" "src/*"

# 21. Final safety net: any other untracked files at the repo root.
if [[ -n "$(git ls-files -o --exclude-standard)" ]]; then
  git add -A
  do_commit "chore: add remaining project files"
fi

# ---------- summary ----------

hdr "Summary"
info "commits created : $COMMIT_COUNT"
info "branch          : $(git rev-parse --abbrev-ref HEAD)"
info "head            : $(git rev-parse --short HEAD 2>/dev/null || echo '(none)')"
echo
git --no-pager log --oneline --decorate | head -30

if [[ "$COMMIT_COUNT" -eq 0 ]]; then
  warn "No commits were created (nothing was untracked). Done."
  exit 0
fi

# ---------- push step ----------

hdr "GitHub"
if command -v gh >/dev/null 2>&1; then
  if gh auth status >/dev/null 2>&1; then
    if ask_yn "Create '$REPO_NAME' on GitHub ($GH_VIS) and push?" "y"; then
      # gh repo create will also add the remote and push the current branch
      # when --source . --push is passed.
      gh repo create "$REPO_NAME" \
        --"$GH_VIS" \
        --source . \
        --remote origin \
        --push
      info "Pushed to origin/$BRANCH"
      gh repo view --web >/dev/null 2>&1 || true
    else
      info "Skipped GitHub creation. Push manually when ready."
    fi
  else
    warn "gh is installed but not authenticated. Run: gh auth login"
    info "Skipping GitHub step."
  fi
else
  warn "gh CLI not found. Install from https://cli.github.com/ to auto-create."
  info "To push manually:"
  info "  git remote add origin git@github.com:<you>/$REPO_NAME.git"
  info "  git push -u origin $BRANCH"
fi

hdr "Done"
