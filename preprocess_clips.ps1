# 视频预处理脚本 - 使用 FFmpeg 优化素材
# 功能：统一格式、裁剪时长、调整分辨率

# FFmpeg 路径（使用系统中已有的版本）
$ffmpegPath = "C:\Users\99593\AppData\Local\Wand\app-12.21.2\resources\app.asar.unpacked\static\unpacked\capture\release\bin\64bit\ffmpeg.exe"

# 输入输出配置
$inputDir = "E:\PR作品"
$outputDir = "E:\Claude code work\pr-auto-edit\processed"
$targetWidth = 1920
$targetHeight = 1080
$targetFps = 30

# 创建输出目录
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

# 要处理的视频文件
$videos = @(
    @{ Name = "CS2_Highlight"; File = "Counter-Strike 2 2026-01-11 03-52-23.mp4"; Start = 0; Duration = 5 },
    @{ Name = "Wukong_Boss"; File = "Black Myth  Wukong 2024.08.23 - 16.48.59.22 - Trim_1.mp4"; Start = 10; Duration = 6 },
    @{ Name = "One_Tap"; File = "1tap(1).mp4"; Start = 0; Duration = 4 },
    @{ Name = "Zenitsu_Edit"; File = "Anime Edit Zenitsu Demon Slayer 4_1.mp4"; Start = 0; Duration = 5 },
    @{ Name = "Desktop_Demo"; File = "Desktop 2025.05.28 - 03.20.22.02.mp4"; Start = 0; Duration = 4 }
)

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "         视频预处理脚本 - FFmpeg 版本" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# 检查 FFmpeg 是否存在
if (!(Test-Path $ffmpegPath)) {
    Write-Host "错误：找不到 FFmpeg" -ForegroundColor Red
    Write-Host "路径：$ffmpegPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ FFmpeg 路径: $ffmpegPath" -ForegroundColor Green
Write-Host "✓ 输出目录: $outputDir" -ForegroundColor Green
Write-Host ""

# 处理每个视频
foreach ($video in $videos) {
    $inputFile = Join-Path $inputDir $video.File
    $outputFile = Join-Path $outputDir "$($video.Name).mp4"

    Write-Host "处理: $($video.Name)" -ForegroundColor Yellow
    Write-Host "  输入: $inputFile" -ForegroundColor Gray
    Write-Host "  输出: $outputFile" -ForegroundColor Gray
    Write-Host "  裁剪: $($video.Start)s - $($video.Start + $video.Duration)s" -ForegroundColor Gray

    if (!(Test-Path $inputFile)) {
        Write-Host "  ⚠ 文件不存在，跳过" -ForegroundColor Red
        continue
    }

    # FFmpeg 命令
    # -ss: 开始时间
    # -t: 持续时长
    # -vf: 视频滤镜（缩放、填充到目标分辨率）
    # -c:v: 视频编码器
    # -c:a: 音频编码器
    # -y: 覆盖输出文件
    $arguments = @(
        "-i", "`"$inputFile`"",
        "-ss", $video.Start.ToString(),
        "-t", $video.Duration.ToString(),
        "-vf", "scale=$targetWidth`:$targetHeight`:force_original_aspect_ratio=decrease,pad=$targetWidth`:$targetHeight`:(ow-iw)/2:(oh-ih)/2:black",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "192k",
        "-r", $targetFps.ToString(),
        "-y",
        "`"$outputFile`""
    )

    try {
        $process = Start-Process -FilePath $ffmpegPath -ArgumentList $arguments -NoNewWindow -Wait -PassThru
        if ($process.ExitCode -eq 0) {
            Write-Host "  ✓ 处理完成" -ForegroundColor Green
        } else {
            Write-Host "  ✗ 处理失败 (退出码: $($process.ExitCode))" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ✗ 执行错误: $_" -ForegroundColor Red
    }

    Write-Host ""
}

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "              预处理完成！" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "处理后的文件保存在: $outputDir" -ForegroundColor Yellow
Write-Host "现在可以在 Premiere Pro 中使用这些素材了。" -ForegroundColor Green
Write-Host ""

# 列出处理后的文件
Write-Host "处理后的文件列表:" -ForegroundColor Cyan
Get-ChildItem -Path $outputDir -Filter "*.mp4" | ForEach-Object {
    $size = [math]::Round($_.Length / 1MB, 2)
    Write-Host "  $($_.Name) ($size MB)" -ForegroundColor White
}

Write-Host ""
pause
