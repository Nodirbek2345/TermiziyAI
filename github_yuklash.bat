@echo off
echo Githubga yuklash boshlandi...
git init
git add .
git commit -m "Project update"
git branch -M main
git remote add origin https://github.com/Nodirbek2345/TermiziyAI.git
git push -u origin main
echo.
echo Jarayon tugadi. Agar xatolik bo'lsa yuqorida ko'ring.
pause
