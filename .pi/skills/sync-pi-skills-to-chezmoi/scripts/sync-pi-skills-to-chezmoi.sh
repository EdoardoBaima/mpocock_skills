#!/usr/bin/env bash
# Mirror this repo's committed pi-skills/ tree into the chezmoi source state.
#
# Source:  HEAD:pi-skills from this git repo
# Target:  $CHEZMOI_SOURCE/home/dot_pi/agent/skills/matt-pocock/
#
# Mirror semantics: the target is made identical to the committed source tree.
# Files and directories that no longer exist in pi-skills/ are deleted from the
# target. Safe because the target lives inside the chezmoi git repo; review with
# `git -C "$CHEZMOI_SOURCE" diff` and revert if needed.
#
# Usage:
#   sync-pi-skills-to-chezmoi.sh [--dry-run] [--chezmoi-source <path>]

set -euo pipefail

DRY_RUN=0
CHEZMOI_SOURCE="${CHEZMOI_SOURCE:-$HOME/.local/share/chezmoi}"

while [ "$#" -gt 0 ]; do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --chezmoi-source)
      [ "$#" -ge 2 ] || {
        echo "error: --chezmoi-source requires a path" >&2
        exit 2
      }
      CHEZMOI_SOURCE="$2"
      shift 2
      ;;
    --chezmoi-source=*)
      CHEZMOI_SOURCE="${1#--chezmoi-source=}"
      shift
      ;;
    *)
      echo "usage: $(basename "$0") [--dry-run] [--chezmoi-source <path>]" >&2
      exit 2
      ;;
  esac
done

TARGET="$CHEZMOI_SOURCE/home/dot_pi/agent/skills/matt-pocock"
REL_TARGET="home/dot_pi/agent/skills/matt-pocock"

# Locate the repo root from this script's position: scripts/ -> skill -> .pi/skills -> .pi -> root
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
SOURCE_REF="HEAD:pi-skills"

TMP_ROOT=""
TMP_TARGET=""
BACKUP_TARGET=""
INSTALL_IN_PROGRESS=0
cleanup() {
  [ -z "$TMP_ROOT" ] || rm -rf "$TMP_ROOT"
  [ -z "$TMP_TARGET" ] || rm -rf "$TMP_TARGET"

  if [ "$INSTALL_IN_PROGRESS" -eq 1 ] && [ -n "$BACKUP_TARGET" ] && [ -e "$BACKUP_TARGET" ]; then
    rm -rf "$TARGET"
    if ! mv "$BACKUP_TARGET" "$TARGET"; then
      echo "error: failed to restore backup target from $BACKUP_TARGET" >&2
    fi
  fi
}
trap cleanup EXIT

# --- Guards ---------------------------------------------------------------

git -C "$REPO_ROOT" rev-parse --git-dir >/dev/null 2>&1 || {
  echo "error: $REPO_ROOT is not a git repository" >&2
  exit 1
}

git -C "$REPO_ROOT" cat-file -e "$SOURCE_REF" 2>/dev/null || {
  echo "error: committed tree $SOURCE_REF does not exist" >&2
  exit 1
}

git -C "$CHEZMOI_SOURCE" rev-parse --git-dir >/dev/null 2>&1 || {
  echo "error: $CHEZMOI_SOURCE is not a git repository" >&2
  exit 1
}

[ -d "$(dirname "$TARGET")" ] || {
  echo "error: parent dir $(dirname "$TARGET") missing — chezmoi layout changed?" >&2
  exit 1
}

# Refuse to mirror an uncommitted pi-skills state. The export below always uses
# HEAD, so a dirty source would otherwise produce a surprising stale mirror.
if [ -n "$(git -C "$REPO_ROOT" status --porcelain -- pi-skills)" ]; then
  echo "error: uncommitted changes under pi-skills/ in the source repo." >&2
  echo "Commit them first so chezmoi mirrors a named source commit." >&2
  exit 1
fi

# Refuse to clobber uncommitted work in the target subtree. Dry-run may still
# inspect a dirty target because it does not write.
if [ "$DRY_RUN" -ne 1 ] && [ -n "$(git -C "$CHEZMOI_SOURCE" status --porcelain -- "$REL_TARGET")" ]; then
  echo "error: uncommitted changes under $REL_TARGET in the chezmoi repo." >&2
  echo "Commit or discard them there first, then re-run." >&2
  exit 1
fi

# --- Build the exact committed source snapshot ---------------------------

TMP_ROOT="$(mktemp -d)"
SNAPSHOT="$TMP_ROOT/pi-skills"
mkdir -p "$SNAPSHOT"
git -C "$REPO_ROOT" archive --format=tar "$SOURCE_REF" | tar -x -C "$SNAPSHOT"

SOURCE_COMMIT="$(git -C "$REPO_ROOT" rev-parse --short HEAD)"

echo "source: $SOURCE_REF at $SOURCE_COMMIT"
echo "target: $TARGET"
echo

# --- Preview --------------------------------------------------------------

if [ "$DRY_RUN" -eq 1 ]; then
  echo "[dry-run] content diff for the mirror operation:"
  if [ ! -d "$TARGET" ]; then
    echo "Only in source snapshot: ."
    exit 0
  fi

  set +e
  diff -qr "$SNAPSHOT" "$TARGET"
  diff_status=$?
  set -e

  case "$diff_status" in
    0) echo "  (no differences)" ;;
    1) ;;
    *) echo "error: diff failed" >&2; exit "$diff_status" ;;
  esac
  exit 0
fi

# --- Mirror ---------------------------------------------------------------

# Copy into a sibling temp directory first. Then move the old target aside,
# install the new target, and keep a trap rollback active until install succeeds.
TMP_TARGET="$(mktemp -d "$(dirname "$TARGET")/.matt-pocock.tmp.XXXXXX")"
cp -R "$SNAPSHOT"/. "$TMP_TARGET"/

INSTALL_IN_PROGRESS=1
if [ -e "$TARGET" ]; then
  BACKUP_TARGET="$(mktemp -d "$(dirname "$TARGET")/.matt-pocock.backup.XXXXXX")"
  rmdir "$BACKUP_TARGET"
  mv "$TARGET" "$BACKUP_TARGET"
fi

mv "$TMP_TARGET" "$TARGET"
TMP_TARGET=""
INSTALL_IN_PROGRESS=0

if [ -n "$BACKUP_TARGET" ]; then
  rm -rf "$BACKUP_TARGET"
  BACKUP_TARGET=""
fi

# --- Report ---------------------------------------------------------------

echo "mirrored committed pi-skills snapshot $SOURCE_COMMIT."
echo "chezmoi repo status for the target subtree:"
git -C "$CHEZMOI_SOURCE" status --short -- "$REL_TARGET" | sed 's/^/  /'
echo
echo "verify source copy with a dry run once the chezmoi commit is clean:"
echo "  bash .pi/skills/sync-pi-skills-to-chezmoi/scripts/sync-pi-skills-to-chezmoi.sh --dry-run"
echo
echo "next: review with   git -C \"$CHEZMOI_SOURCE\" diff -- $REL_TARGET"
echo "then commit in the chezmoi repo and run   chezmoi apply"
echo
echo "note: chezmoi apply does not delete files removed from the source state."
echo "If a skill was renamed or removed, delete its old deployed directory"
echo "under ~/.pi/agent/skills/matt-pocock/ (or list it in .chezmoiremove)."
