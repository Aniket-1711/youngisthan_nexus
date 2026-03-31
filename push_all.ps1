git add package.json package-lock.json src/lib/
git commit -m "chore: add supabase, jspdf, canvas-confetti dependencies"

git add src/assets/ src/components/VideoPlayer.jsx src/data/videoData.js src/pages/student/Resources.jsx src/pages/admin/TrainingCenter.jsx src/pages/mentor/Training.jsx src/index.css
git commit -m "feat: implement video library and mentor training modules"

git add src/pages/admin/AutoAssignment.jsx src/pages/admin/BulkUpload.jsx
git commit -m "feat: finalize manual auto-assignment engine and database persistence"

git add src/pages/admin/Dashboard.jsx src/pages/admin/MentorManagement.jsx src/pages/admin/MonitorProgress.jsx src/pages/admin/Reports.jsx
git commit -m "feat: connect admin dashboards and reports to live Supabase data"

git add src/pages/mentor/
git commit -m "feat: rebuild Mentor Dashboard with live active assignments and interactive sessions UI"

git add src/components/Layout/Sidebar.jsx src/data/mockData.js src/pages/Login.jsx
git commit -m "chore: apply Youngisthan Nexus branding"

git remote remove upstream
git remote add upstream https://github.com/Aniket-1711/youngisthan_nexus.git
git fetch upstream
git push -u upstream main
