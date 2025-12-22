@echo off
set DATABASE_URL=postgresql://neondb_owner:npg_nPe3w2TJusQj@ep-summer-night-aharz6sg-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
npx prisma migrate deploy
echo.
echo Baza migratsiyasi tugadi!
pause
