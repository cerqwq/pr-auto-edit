@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════════════════════════
echo          环境检查脚本
echo ═══════════════════════════════════════════════════════════════
echo.

setlocal enabledelayedexpansion

set "ERRORS=0"

REM 检查 Premiere Pro
echo [1/5] 检查 Premiere Pro...
set "PR_PATH=E:\2022PR\Adobe Premiere Pro 2022\Adobe Premiere Pro.exe"
if exist "%PR_PATH%" (
    echo ✓ Premiere Pro 已安装: %PR_PATH%
) else (
    echo ✗ 找不到 Premiere Pro
    set /a ERRORS+=1
)
echo.

REM 检查脚本文件
echo [2/5] 检查脚本文件...
set "SCRIPT_PATH=E:\Claude code work\pr-auto-edit\quick_edit.jsx"
if exist "%SCRIPT_PATH%" (
    echo ✓ 脚本文件存在: %SCRIPT_PATH%
) else (
    echo ✗ 找不到脚本文件
    set /a ERRORS+=1
)
echo.

REM 检查素材目录
echo [3/5] 检查素材目录...
set "CLIPS_DIR=E:\PR作品"
if exist "%CLIPS_DIR%" (
    echo ✓ 素材目录存在: %CLIPS_DIR%
    echo   包含文件：
    dir /b "%CLIPS_DIR%\*.mp4" 2>nul | find /c /v "" > temp.txt
    set /p FILE_COUNT=<temp.txt
    del temp.txt
    echo   MP4 文件数量: !FILE_COUNT!
) else (
    echo ✗ 找不到素材目录
    set /a ERRORS+=1
)
echo.

REM 检查输出目录
echo [4/5] 检查输出目录...
set "OUTPUT_DIR=E:\Claude code work\pr-auto-edit\output"
if exist "%OUTPUT_DIR%" (
    echo ✓ 输出目录存在: %OUTPUT_DIR%
) else (
    echo ⚠ 输出目录不存在，正在创建...
    mkdir "%OUTPUT_DIR%"
    if exist "%OUTPUT_DIR%" (
        echo ✓ 输出目录已创建
    ) else (
        echo ✗ 无法创建输出目录
        set /a ERRORS+=1
    )
)
echo.

REM 检查具体素材文件
echo [5/5] 检查素材文件...
set "MISSING=0"

set "FILE1=E:\PR作品\Counter-Strike 2 2026-01-11 03-52-23.mp4"
if exist "%FILE1%" (
    echo ✓ CS2 素材 1
) else (
    echo ✗ 缺少: CS2 素材 1
    set /a MISSING+=1
)

set "FILE2=E:\PR作品\Black Myth  Wukong 2024.08.23 - 16.48.59.22 - Trim_1.mp4"
if exist "%FILE2%" (
    echo ✓ Wukong 素材
) else (
    echo ✗ 缺少: Wukong 素材
    set /a MISSING+=1
)

set "FILE3=E:\PR作品\1tap(1).mp4"
if exist "%FILE3%" (
    echo ✓ 1tap 素材
) else (
    echo ✗ 缺少: 1tap 素材
    set /a MISSING+=1
)

set "FILE4=E:\PR作品\Anime Edit Zenitsu Demon Slayer 4_1.mp4"
if exist "%FILE4%" (
    echo ✓ Zenitsu 素材
) else (
    echo ✗ 缺少: Zenitsu 素材
    set /a MISSING+=1
)

set "FILE5=E:\PR作品\Desktop 2025.05.28 - 03.20.22.02.mp4"
if exist "%FILE5%" (
    echo ✓ Desktop 素材
) else (
    echo ✗ 缺少: Desktop 素材
    set /a MISSING+=1
)

if !MISSING! gtr 0 (
    echo.
    echo ⚠ 缺少 !MISSING! 个素材文件
    set /a ERRORS+=1
)
echo.

REM 总结
echo ═══════════════════════════════════════════════════════════════
if !ERRORS! equ 0 (
    echo ✓ 环境检查通过！
    echo.
    echo 可以运行自动剪辑脚本了。
    echo 双击"运行自动剪辑.bat"开始。
) else (
    echo ✗ 发现 !ERRORS! 个问题
    echo.
    echo 请解决上述问题后再运行自动剪辑脚本。
)
echo ═══════════════════════════════════════════════════════════════
echo.

pause
