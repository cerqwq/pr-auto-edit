/**
 * Premiere Pro 快速剪辑脚本 - 简化版
 * 自动创建游戏集锦视频
 */

// ═══════════════════════════════════════════════════════════════
// 常量
// ═══════════════════════════════════════════════════════════════
var TICKS_PER_SECOND = 254016000000; /* Premiere Pro 时间基数 */

// ═══════════════════════════════════════════════════════════════
// 配置区域 - 修改这里来定制你的视频
// ═══════════════════════════════════════════════════════════════
var CLIPS = [
    { path: "E:/PR作品/你的视频1.mp4", name: "片段1", start: 0, duration: 5 },
    { path: "E:/PR作品/你的视频2.mp4", name: "片段2", start: 10, duration: 6 },
];

var OUTPUT_PATH = "E:/Claude code work/pr-auto-edit/output/";
var PROJECT_NAME = "Gaming_Showcase";

// ═══════════════════════════════════════════════════════════════
// 核心功能
// ═══════════════════════════════════════════════════════════════

function createProject() {
    // 创建输出目录
    var outputFolder = new Folder(OUTPUT_PATH);
    if (!outputFolder.exists) {
        outputFolder.create();
    }

    // 创建新项目
    var projectFile = new File(OUTPUT_PATH + PROJECT_NAME + ".prproj");
    app.newProject(projectFile.fsName);
    return app.project;
}

function importClips(project) {
    var importedItems = [];

    for (var i = 0; i < CLIPS.length; i++) {
        var clipConfig = CLIPS[i];
        var file = new File(clipConfig.path);

        if (file.exists) {
            try {
                // 导入文件
                project.importFiles([file.fsName], true, project.rootItem, false);
                var item = project.rootItem.findItemsMatchingMediaPath(file.fsName)[0];

                if (item) {
                    importedItems.push({
                        item: item,
                        config: clipConfig
                    });
                    app.project.save();
                    $.writeln("成功导入: " + clipConfig.name);
                }
            } catch (e) {
                $.writeln("导入失败: " + clipConfig.name + " - " + e.message);
            }
        } else {
            $.writeln("文件不存在: " + clipConfig.path);
        }
    }

    return importedItems;
}

function createSequence(project, importedItems) {
    // 创建新序列
    var sequence = project.createNewSequence("Gaming_Montage", "HD 1080p 30fps");

    if (!sequence) {
        // 如果预设不存在，手动创建
        var presetPath = "C:/Program Files/Adobe/Adobe Premiere Pro 2022/Settings/SequencePresets/HDV/HDV 1080p30.sqpreset";
        sequence = project.createNewSequenceFromPreset("Gaming_Montage", presetPath);
    }

    return sequence;
}

function addClipsToTimeline(sequence, importedItems) {
    var videoTrack = sequence.videoTracks[0];
    var currentTime = 0;

    for (var i = 0; i < importedItems.length; i++) {
        var clipData = importedItems[i];
        var clipItem = clipData.item;
        var config = clipData.config;

        // 创建剪辑实例
        var clip = sequence.createClip(clipItem, currentTime);

        if (clip) {
            // 设置入点和出点
            clip.inPoint = config.start * 254016000000; // 转换为ticks
            clip.outPoint = (config.start + config.duration) * 254016000000;

            // 添加到轨道
            videoTrack.insertClip(clip, currentTime);
            currentTime += config.duration * 254016000000;

            $.writeln("已添加到时间线: " + config.name);
        }
    }

    return currentTime;
}

function addTransitions(sequence) {
    var videoTrack = sequence.videoTracks[0];

    // 为每个剪辑之间添加交叉溶解
    for (var i = 0; i < videoTrack.clips.length - 1; i++) {
        var clip = videoTrack.clips[i];
        var nextClip = videoTrack.clips[i + 1];

        // 计算转场位置（在两个剪辑之间）
        var transitionPoint = clip.end;

        try {
            // 添加交叉溶解
            sequence.addCrossDissolve(transitionPoint, 0.5); // 0.5秒转场
            $.writeln("已添加转场 #" + (i + 1));
        } catch (e) {
            $.writeln("添加转场失败: " + e.message);
        }
    }
}

function addTextOverlays(sequence) {
    // 创建标题
    var titles = [
        { text: "GAMING SHOWCASE", start: 0, duration: 3 },
        { text: "COUNTER-STRIKE 2", start: 3, duration: 5 },
        { text: "BLACK MYTH: WUKONG", start: 8, duration: 6 },
        { text: "HIGHLIGHTS", start: 14, duration: 4 },
        { text: "ANIME EDIT", start: 18, duration: 5 },
        { text: "DESKTOP RECORDING", start: 23, duration: 4 },
        { text: "THANKS FOR WATCHING", start: 27, duration: 3 }
    ];

    // 创建标题剪辑
    for (var i = 0; i < titles.length; i++) {
        var titleConfig = titles[i];

        try {
            // 创建标题
            var title = sequence.createTitle(
                titleConfig.text,
                "Arial",
                72,
                [255, 255, 255], // 白色文字
                [0, 0, 0, 200],  // 半透明黑色背景
                titleConfig.start * 254016000000,
                titleConfig.duration * 254016000000
            );

            if (title) {
                // 添加到视频轨道2（叠加层）
                sequence.videoTracks[1].insertClip(title, titleConfig.start * 254016000000);
                $.writeln("已添加标题: " + titleConfig.text);
            }
        } catch (e) {
            $.writeln("创建标题失败: " + e.message);
        }
    }
}

function addAudioFade(sequence) {
    // 为音频添加淡入淡出
    if (sequence.audioTracks.length > 0) {
        var audioTrack = sequence.audioTracks[0];

        for (var i = 0; i < audioTrack.clips.length; i++) {
            var audioClip = audioTrack.clips[i];

            try {
                // 添加淡入（0.5秒）
                audioClip.addAudioTransition(0.5, true);
                // 添加淡出（0.5秒）
                audioClip.addAudioTransition(0.5, false);
                $.writeln("已添加音频淡入淡出");
            } catch (e) {
                $.writeln("音频效果添加失败: " + e.message);
            }
        }
    }
}

function exportSettings(sequence) {
    // 注意：Premiere Pro 的导出需要通过 AME 或手动操作
    // 这里只设置导出预设

    var exportPreset = "YouTube 1080p HD"; // 预设名称

    $.writeln("\n=== 导出设置 ===");
    $.writeln("输出路径: " + OUTPUT_PATH + "Final_Montage.mp4");
    $.writeln("格式: H.264");
    $.writeln("预设: " + exportPreset);
    $.writeln("分辨率: 1920x1080");
    $.writeln("帧率: 30fps");
    $.writeln("\n请手动导出或使用 Adobe Media Encoder");
}

// ═══════════════════════════════════════════════════════════════
// 主执行流程
// ═══════════════════════════════════════════════════════════════

function main() {
    $.writeln("═══════════════════════════════════════");
    $.writeln("   Premiere Pro 自动剪辑开始");
    $.writeln("═══════════════════════════════════════\n");

    try {
        // 步骤1：创建项目
        $.writeln("步骤 1/6: 创建项目...");
        var project = createProject();
        $.writeln("✓ 项目创建成功\n");

        // 步骤2：导入素材
        $.writeln("步骤 2/6: 导入素材...");
        var importedItems = importClips(project);
        $.writeln("✓ 成功导入 " + importedItems.length + " 个素材\n");

        if (importedItems.length === 0) {
            throw new Error("没有成功导入任何素材，无法继续");
        }

        // 步骤3：创建序列
        $.writeln("步骤 3/6: 创建序列...");
        var sequence = createSequence(project, importedItems);
        $.writeln("✓ 序列创建成功\n");

        // 步骤4：添加素材到时间线
        $.writeln("步骤 4/6: 添加素材到时间线...");
        var totalTime = addClipsToTimeline(sequence, importedItems);
        $.writeln("✓ 素材已添加，总时长: " + (totalTime / 254016000000).toFixed(1) + " 秒\n");

        // 步骤5：添加转场和效果
        $.writeln("步骤 5/6: 添加转场和效果...");
        addTransitions(sequence);
        addTextOverlays(sequence);
        addAudioFade(sequence);
        $.writeln("✓ 效果添加完成\n");

        // 步骤6：保存和导出设置
        $.writeln("步骤 6/6: 保存项目...");
        project.save();
        exportSettings(sequence);

        $.writeln("\n═══════════════════════════════════════");
        $.writeln("   ✓ 自动剪辑完成！");
        $.writeln("═══════════════════════════════════════");

        // 显示完成对话框
        alert("自动剪辑完成！\n\n" +
              "项目名称: " + PROJECT_NAME + "\n" +
              "导入素材: " + importedItems.length + " 个\n" +
              "序列时长: " + (totalTime / 254016000000).toFixed(1) + " 秒\n" +
              "输出路径: " + OUTPUT_PATH + "\n\n" +
              "请手动导出最终视频。");

    } catch (e) {
        $.writeln("\n✗ 错误: " + e.message);
        alert("脚本执行出错:\n" + e.message);
    }
}

// 执行
main();
