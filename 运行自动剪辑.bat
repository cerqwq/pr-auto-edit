@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════════════════════════
echo          Premiere Pro 自动剪辑启动器
echo ═══════════════════════════════════════════════════════════════
echo.

REM 检查 Premiere Pro 是否安装
set PR_PATH="E:\2022PR\Adobe Premiere Pro 2022\Adobe Premiere Pro.exe"
if not exist %PR_PATH% (
    echo 错误：找不到 Premiere Pro
    echo 请确认路径：%PR_PATH%
    pause
    exit /b 1
)

echo ✓ 找到 Premiere Pro: %PR_PATH%
echo.

REM 检查脚本文件
set SCRIPT_PATH="%~dp0quick_edit.jsx"
if not exist %SCRIPT_PATH% (
    echo 错误：找不到脚本文件
    echo 请确认路径：%SCRIPT_PATH%
    pause
    exit /b 1
)

echo ✓ 找到脚本文件: %SCRIPT_PATH%
echo.

echo 正在启动 Premiere Pro 并执行自动剪辑...
echo 这可能需要几分钟时间，请耐心等待...
echo.

REM 启动 Premiere Pro 并执行脚本
REM 注意：Premiere Pro 不支持直接通过命令行参数运行脚本
REM 需要手动在 Premiere Pro 中通过 文件 → 脚本 → 运行脚本文件 来执行

echo 启动 Premiere Pro...
start "" %PR_PATH%

echo.
echo ═══════════════════════════════════════════════════════════════
echo Premiere Pro 已启动！
echo.
echo 请手动执行以下操作：
echo 1. 等待 Premiere Pro 完全加载
echo 2. 点击菜单：文件 → 脚本 → 运行脚本文件
echo 3. 选择文件：%SCRIPT_PATH%
echo 4. 等待脚本执行完成
echo ═══════════════════════════════════════════════════════════════
echo.

pause
