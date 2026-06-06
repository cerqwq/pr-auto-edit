# Premiere Pro 自动启动并运行脚本
# 功能：启动 Premiere Pro 并自动执行剪辑脚本

# Premiere Pro 路径
$premierePath = "E:\2022PR\Adobe Premiere Pro 2022\Adobe Premiere Pro.exe"
$scriptPath = "E:\Claude code work\pr-auto-edit\quick_edit.jsx"

# 检查 Premiere Pro 是否存在
if (!(Test-Path $premierePath)) {
    Write-Host "错误：找不到 Premiere Pro" -ForegroundColor Red
    Write-Host "路径：$premierePath" -ForegroundColor Yellow
    exit 1
}

# 检查脚本文件是否存在
if (!(Test-Path $scriptPath)) {
    Write-Host "错误：找不到脚本文件" -ForegroundColor Red
    Write-Host "路径：$scriptPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "         Premiere Pro 自动启动器" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "✓ Premiere Pro 路径: $premierePath" -ForegroundColor Green
Write-Host "✓ 脚本文件路径: $scriptPath" -ForegroundColor Green
Write-Host ""

# 启动 Premiere Pro
Write-Host "正在启动 Premiere Pro..." -ForegroundColor Yellow
$process = Start-Process -FilePath $premierePath -PassThru

# 等待 Premiere Pro 启动
Write-Host "等待 Premiere Pro 完全加载（约60秒）..." -ForegroundColor Yellow
Start-Sleep -Seconds 60

# 检查 Premiere Pro 是否仍在运行
if ($process.HasExited) {
    Write-Host "错误：Premiere Pro 已退出" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Premiere Pro 已启动" -ForegroundColor Green
Write-Host ""

# 显示操作指南
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                    手动操作步骤" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Premiere Pro 已启动，请执行以下操作：" -ForegroundColor White
Write-Host ""
Write-Host "1. 等待 Premiere Pro 完全加载（如果还未加载完成）" -ForegroundColor Yellow
Write-Host "2. 点击菜单：文件 → 脚本 → 运行脚本文件" -ForegroundColor Yellow
Write-Host "3. 浏览到以下路径：" -ForegroundColor Yellow
Write-Host "   $scriptPath" -ForegroundColor White
Write-Host "4. 选择 quick_edit.jsx 文件" -ForegroundColor Yellow
Write-Host "5. 点击"打开"按钮" -ForegroundColor Yellow
Write-Host "6. 等待脚本执行完成（约2-5分钟）" -ForegroundColor Yellow
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# 等待用户确认
Read-Host "按 Enter 键继续..."

# 检查 Premiere Pro 是否仍在运行
if ($process.HasExited) {
    Write-Host "Premiere Pro 已关闭" -ForegroundColor Yellow
} else {
    Write-Host "Premiere Pro 仍在运行" -ForegroundColor Green
    Write-Host "请确保脚本已执行完成" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                    后续操作" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "脚本执行完成后：" -ForegroundColor White
Write-Host "1. 检查时间线上的素材是否正确" -ForegroundColor Yellow
Write-Host "2. 检查转场效果是否显示" -ForegroundColor Yellow
Write-Host "3. 检查文字标题是否正确" -ForegroundColor Yellow
Write-Host "4. 导出最终视频：文件 → 导出 → 媒体" -ForegroundColor Yellow
Write-Host ""
Write-Host "输出文件将保存在：E:\Claude code work\pr-auto-edit\output\" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
pause
