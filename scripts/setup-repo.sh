#!/usr/bin/env bash
# One-off repository setup for a resumorph site: settings, branch protection and Pages.
# Run it once from the repo root after creating the repo on GitHub, signed in with an
# account that is admin on the repo:
#
#   gh auth login            # if you haven't already
#   ./scripts/setup-repo.sh  # or: ./scripts/setup-repo.sh owner/repo
#
# Safe to run again: every step updates in place.
set -euo pipefail

REPO="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
RULESET_FILE="$(dirname "$0")/../.github/rulesets/main.json"
echo "Setting up ${REPO}"

echo "- merge settings: squash only, PR title as commit, delete merged branches"
gh api -X PATCH "repos/${REPO}" --silent \
  -F allow_squash_merge=true -F allow_merge_commit=false -F allow_rebase_merge=false \
  -f squash_merge_commit_title=PR_TITLE -f squash_merge_commit_message=PR_BODY \
  -F delete_branch_on_merge=true -F allow_auto_merge=true -F allow_update_branch=true \
  -F has_wiki=false -F has_projects=false

echo "- security: Dependabot alerts and fixes, secret scanning with push protection"
gh api -X PUT "repos/${REPO}/vulnerability-alerts" --silent
gh api -X PUT "repos/${REPO}/automated-security-fixes" --silent
gh api -X PATCH "repos/${REPO}" --silent --input - <<'JSON' ||
{"security_and_analysis": {"secret_scanning": {"status": "enabled"}, "secret_scanning_push_protection": {"status": "enabled"}}}
JSON
  echo "  (secret scanning not available for this repo; skipped)"

echo "- GitHub Pages: deploy from GitHub Actions"
if gh api "repos/${REPO}/pages" --silent 2>/dev/null; then
  gh api -X PUT "repos/${REPO}/pages" --silent -f build_type=workflow
else
  gh api -X POST "repos/${REPO}/pages" --silent -f build_type=workflow
fi

echo "- ruleset: protect the default branch"
EXISTING_ID="$(gh api "repos/${REPO}/rulesets" -q '.[] | select(.name == "Protect main") | .id')"
if [ -n "${EXISTING_ID}" ]; then
  gh api -X PUT "repos/${REPO}/rulesets/${EXISTING_ID}" --silent --input "${RULESET_FILE}"
else
  gh api -X POST "repos/${REPO}/rulesets" --silent --input "${RULESET_FILE}"
fi

echo "Done. Pages URL: $(gh api "repos/${REPO}/pages" -q .html_url)"
