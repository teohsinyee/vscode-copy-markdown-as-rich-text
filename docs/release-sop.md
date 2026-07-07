# Release SOP

Use this checklist after the feature or bug-fix PR is merged to `main`.

## 1. Create Version Bump Branch

Start from the latest remote `main`.

```powershell
git fetch origin --tags
git switch -c codex/release-0.1.7-version-bump origin/main
npm version patch --no-git-tag-version
```

Use the next version number for the branch name and release version.

## 2. Verify And Package

Run the full release confidence checks.

```powershell
npm test
npm run compile
npm run package
```

Expected output:

- Tests pass
- TypeScript compile passes
- A new VSIX is generated, for example `copy-markdown-to-rich-text-0.1.7.vsix`

## 3. Commit Version Bump

Only commit version files.

```powershell
git add package.json package-lock.json
git commit -m "chore(release): bump version to 0.1.7" -m "Co-authored-by: Codex <codex@openai.com>"
git push -u origin codex/release-0.1.7-version-bump
```

Do not commit the generated VSIX.

## 4. Open And Merge Release PR

Use a short PR body.

```md
## Summary

- Bump package version from 0.1.6 to 0.1.7.

## Verification

- npm test
- npm run compile
- npm run package

Generated local VSIX: copy-markdown-to-rich-text-0.1.7.vsix
```

Merge the PR into `main`.

## 5. Tag The Release

After the release PR is merged, tag the merged `origin/main` commit.

```powershell
git fetch origin --tags
git tag -a v0.1.7 origin/main -m "Release v0.1.7"
git push origin v0.1.7
```

Confirm the tag exists remotely.

```powershell
git ls-remote --tags origin v0.1.7
```

## 6. Create GitHub Release

Create the GitHub Release manually from the pushed tag.

1. Open the repository Releases page.
2. Choose `Draft a new release`.
3. Select the new tag, for example `v0.1.7`.
4. Use the release title `v0.1.7`.
5. Attach the latest generated VSIX, for example `copy-markdown-to-rich-text-0.1.7.vsix`.
6. Publish the release.

## Notes

- Version bump PRs should be separate from feature or bug-fix PRs.
- Keep the release bump diff limited to `package.json` and `package-lock.json`.
- Generate the VSIX before opening the release PR so the PR body can record the exact artifact name.
- The human release owner creates the GitHub Release and attaches the latest VSIX.
