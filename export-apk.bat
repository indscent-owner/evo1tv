@echo off
setlocal enabledelayedexpansion
title EVO Stream - export APK
set REPO=indscent-owner/evo1tv
set "ROOT=%~dp0"
cd /d "%ROOT%"

if not exist "app\build.gradle.kts" (
  for /d %%d in ("%ROOT%*") do if exist "%%~d\app\build.gradle.kts" set "ROOT=%%~d\"
  cd /d "!ROOT!"
)
if not exist "app\build.gradle.kts" (
  echo.
  echo ERROR: project files not found next to this script.
  echo Put export-apk.bat INSIDE the unzipped project folder ^(the one that contains the "app" folder^).
  echo.
  pause
  exit /b 1
)
echo.
echo  === EVO Stream: push to GitHub, build, download APK ===
echo  Project folder: %CD%
echo.

echo [1/5] Checking Git...
where git >nul 2>nul
if errorlevel 1 (
  echo ERROR: Git is not installed. Install it from https://git-scm.com/download/win then run this again.
  pause
  exit /b 1
)

echo [2/5] Linking folder to github.com/%REPO% ...
if not exist ".git" (
  git init -q
  git branch -M main
  git remote add origin https://github.com/%REPO%.git
  git fetch origin main
  if errorlevel 1 (
    echo ERROR: could not reach the repo. Check your internet connection and the repo name.
    pause
    exit /b 1
  )
  git reset --soft origin/main
)
set GEMAIL=
for /f "delims=" %%e in ('git config user.email 2^>nul') do set GEMAIL=%%e
if not defined GEMAIL git config user.email "evostream@users.noreply.github.com"
set GNAME=
for /f "delims=" %%e in ('git config user.name 2^>nul') do set GNAME=%%e
if not defined GNAME git config user.name "EVO Stream"

echo [3/5] Committing changes...
git add -A
set CHANGED=1
git diff --cached --quiet
if not errorlevel 1 set CHANGED=0
if "!CHANGED!"=="1" (
  git commit -q -m "EVO Stream update"
  if errorlevel 1 (
    echo ERROR: commit failed. See the message above.
    pause
    exit /b 1
  )
) else (
  echo No file changes since the last push.
)

echo [4/5] Pushing to GitHub ^(a sign-in window may appear^)...
git push -u origin main
if errorlevel 1 (
  echo.
  echo ERROR: push failed. Sign in to GitHub when asked, make sure you own the repo, then run this again.
  pause
  exit /b 1
)
for /f %%s in ('git rev-parse HEAD') do set SHA=%%s

set GHOK=0
where gh >nul 2>nul
if not errorlevel 1 set GHOK=1
if "!GHOK!"=="0" if exist "%ProgramFiles%\GitHub CLI\gh.exe" (
  set "PATH=%PATH%;%ProgramFiles%\GitHub CLI"
  set GHOK=1
)
if "!GHOK!"=="0" (
  echo.
  echo Pushed OK. The GitHub CLI "gh" is not installed, so I am opening the Actions page.
  echo Wait for the green tick, open the run, and download "evo-stream-apk" under Artifacts.
  echo ^(Optional: install gh from https://cli.github.com to download automatically next time.^)
  start https://github.com/%REPO%/actions
  pause
  exit /b 0
)

gh auth status >nul 2>nul
if errorlevel 1 gh auth login

echo [5/5] Waiting for the build ^(about 5 minutes^)...
set RUNID=
if "!CHANGED!"=="0" (
  gh workflow run build.yml --repo %REPO%
  timeout /t 8 /nobreak >nul
  for /f %%i in ('gh run list --repo %REPO% --limit 1 --json databaseId --jq ".[0].databaseId"') do set RUNID=%%i
) else (
  for /l %%n in (1,1,18) do (
    if not defined RUNID (
      for /f %%i in ('gh run list --repo %REPO% --commit !SHA! --limit 1 --json databaseId --jq ".[0].databaseId" 2^>nul') do set RUNID=%%i
      if not defined RUNID timeout /t 5 /nobreak >nul
    )
  )
  if not defined RUNID (
    for /f %%i in ('gh run list --repo %REPO% --limit 1 --json databaseId --jq ".[0].databaseId"') do set RUNID=%%i
  )
)
if not defined RUNID (
  echo Could not find the build run. Open https://github.com/%REPO%/actions to check.
  start https://github.com/%REPO%/actions
  pause
  exit /b 1
)
echo Build run !RUNID! ...
gh run watch !RUNID! --repo %REPO% --exit-status
if errorlevel 1 (
  echo.
  echo BUILD FAILED. Open https://github.com/%REPO%/actions/runs/!RUNID!
  echo Click the red step and copy the error text, then send it to me.
  start https://github.com/%REPO%/actions/runs/!RUNID!
  pause
  exit /b 1
)
if exist apk rmdir /s /q apk
gh run download !RUNID! --repo %REPO% --name evo-stream-apk --dir apk
if errorlevel 1 (
  echo ERROR: could not download the APK. Try the Actions page instead.
  start https://github.com/%REPO%/actions/runs/!RUNID!
  pause
  exit /b 1
)
copy /y apk\app-debug.apk EVO-Stream.apk >nul
echo.
echo DONE. APK saved as: %CD%\EVO-Stream.apk
echo.
set TV=
set /p TV=Install on your TV stick now? Type its IP address, or press Enter to skip: 
if defined TV (
  where adb >nul 2>nul
  if errorlevel 1 (
    echo adb not found. Copy EVO-Stream.apk to the stick another way.
  ) else (
    adb connect !TV!:5555
    adb -s !TV!:5555 install -r EVO-Stream.apk
  )
)
explorer .
pause
