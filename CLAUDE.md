# 100C-Catalog - Claude Code Project Guide

## Startup Checklist
- [ ] Verify git remote: `git remote -v` (should be rafi107dev/100C-Catalog)
- [ ] Check for updates: `git fetch origin && git status`
- [ ] Review recent commits: `git log --oneline -5`
- [ ] Check for uncommitted changes: `git status`

## Project Details
| Field | Value |
|-------|-------|
| **Name** | 100C-Catalog |
| **Folder** | `D:\D-Claude\100C-Catalog` |
| **GitHub** | https://github.com/rafi107dev/100C-Catalog |
| **Branch** | main |
| **Tech Stack** | Static HTML, CSS, JavaScript |
| **Dev Server** | Open `index.html` in browser or use Live Server |

## Project Structure
```
100C-Catalog/
├── index.html              # Main catalog page
├── cart.html               # Shopping cart page
├── cart.js                 # Cart functionality
├── style.css               # Main stylesheet
├── includes.js             # Header/footer includes
├── includes/               # Reusable HTML components
│   ├── header.html
│   └── footer.html
└── closeout-*.html         # Product category pages
```

## Permission Management
As I approve new commands during sessions, Claude should:
1. Update `.claude/settings.json` with the new permission
2. Add an entry to `_approvalLog.sessionNotes` with the date and what was added
3. Commit these updates periodically so they persist across sessions

### Currently Approved Commands
- Git: status, log, diff, fetch, branch, remote
- File navigation: ls, dir, cat, type, pwd, cd

## Safety Rules
1. **Never push to repositories other than rafi107dev/100C-Catalog**
2. **Always ask before pushing** - even to the correct repo
3. **Don't force push** without explicit permission
4. **Don't modify .git/config** without asking

## Git Push Policy
- Always ask before running `git push`
- At the end of each session, remind user if there are unpushed commits
- Use `git push origin main` (never force push)

## Quick Commands
```bash
# Check status
git status

# View recent changes
git log --oneline -5

# See what changed
git diff

# Stage and commit
git add -A && git commit -m "message"

# Push (always ask first!)
git push origin main
```

## Development Notes
- This is a static product catalog for 100 Candles closeout items
- No build process required - edit HTML/CSS/JS directly
- Test changes by opening index.html in a browser
- Use browser dev tools for debugging
