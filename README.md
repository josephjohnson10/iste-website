# iste-website
WEBSITE FOR ISTE SC CET 2026

GIT Workflow:

Each teammate, every time (example: Anu adding Events):
1. pull = get latest clean copy
git checkout main
git pull origin main
Simple: "give me newest main first"

2. Make branch yourname-feature = make personal rough copy
git checkout -b anu-events
Simple: checkout -b = "make new copy + go inside it". Name rule: name-what e.g. joseph-hero, anu-events, riya-team.
Check: git branch will now show * anu-events.

3. Work + push = save + upload rough copy
git status
git add .
git commit -m "add events section"
git push -u origin anu-events
Simple: same save as before, but uploads anu-events, NOT main. main stays clean.
