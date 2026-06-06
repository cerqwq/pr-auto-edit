/**
 * Premiere Pro 自动剪辑脚本
 * 功能：自动导入素材、创建序列、添加剪切、转场、文字、导出
 * 用法：在 Premiere Pro 中通过 文件 > 脚本 > 运行 调用
 */

// ═══════════════════════════════════════════════════════════════
// 常量
// ═══════════════════════════════════════════════════════════════
var TICKS_PER_SECOND = 254016000000; /* Premiere Pro 时间基数 */

// ═══════════════════════════════════════════════════════════════
// 配置
// ═══════════════════════════════════════════════════════════════
var CONFIG = {
    projectName: "AutoEdit_Showcase",
    outputPath: "E:/Claude code work/pr-auto-edit/output/",

    // 素材路径列表（修改为你的实际素材路径）
    clips: [
        "E:/PR作品/你的视频1.mp4",
        "E:/PR作品/你的视频2.mp4",
    ],

    // 每个片段截取的时长（秒）
    clipDurations: [5, 5, 4, 5, 4],

    // 序列设置
    sequence: {
        name: "Showcase_Sequence",
        width: 1920,
        height: 1080,
        fps: 30
    },

    // 文字标题
    titles: [
        {text: "SHOWREEL", start: 0, duration: 3},
        {text: "COUNTER-STRIKE 2", start: 3, duration: 5},
        {text: "BLACK MYTH: WUKONG", start: 8, duration: 5},
        {text: "HIGHLIGHTS", start: 13, duration: 4},
        {text: "ANIME EDIT", start: 17, duration: 5},
        {text: "DESKTOP RECORDING", start: 22, duration: 4},
        {text: "THANKS FOR WATCHING", start: 26, duration: 3}
    ],

    // 转场时长（秒）
    transitionDuration: 0.5
};

// ═══════════════════════════════════════════════════════════════
// 工具函数
// ═══════════════════════════════════════════════════════════════
function log(msg) {
    $.writeln("[AutoEdit] " + msg);
}

function timeToTicks(seconds) {
    return seconds * 254016000000; // Premiere Pro time base
}

// ═══════════════════════════════════════════════════════════════
// 主函数
// ═══════════════════════════════════════════════════════════════
function main() {
    log("开始自动剪辑...");

    // 1. 创建新项目
    var project = app.newProject(CONFIG.outputPath + CONFIG.projectName + ".prproj");
    if (!project) {
        log("错误：无法创建项目");
        return;
    }
    log("项目创建成功：" + CONFIG.projectName);

    // 2. 导入素材
    var importedClips = [];
    for (var i = 0; i < CONFIG.clips.length; i++) {
        var clipPath = CONFIG.clips[i];
        log("导入素材：" + clipPath);

        var importSuccess = project.importFiles([clipPath], true, project.getBinByPath("素材"), false);
        if (importSuccess) {
            var clip = project.findProjectItemByPath(clipPath);
            if (clip) {
                importedClips.push(clip);
                log("成功导入：" + clip.name);
            }
        } else {
            log("警告：无法导入 " + clipPath);
        }
    }

    if (importedClips.length === 0) {
        log("错误：没有成功导入任何素材");
        return;
    }

    // 3. 创建序列
    log("创建序列：" + CONFIG.sequence.name);
    var sequence = project.createNewSequence(
        CONFIG.sequence.name,
        CONFIG.sequence.width,
        CONFIG.sequence.height,
        CONFIG.sequence.fps
    );

    if (!sequence) {
        log("错误：无法创建序列");
        return;
    }

    // 4. 将素材添加到时间线
    var currentTime = 0;
    for (var i = 0; i < importedClips.length; i++) {
        var clip = importedClips[i];
        var duration = CONFIG.clipDurations[i] || 5;

        log("添加片段到时间线：" + clip.name + " (" + duration + "秒)");

        // 创建剪辑实例
        var clipInstance = clip.createClipInstance();
        if (clipInstance) {
            // 设置入点和出点
            clipInstance.inPoint = 0;
            clipInstance.outPoint = timeToTicks(duration);

            // 添加到时间线
            sequence.videoTracks[0].insertClip(clipInstance, currentTime);
            currentTime += timeToTicks(duration);

            log("片段已添加到时间线");
        }
    }

    // 5. 添加文字标题
    log("添加文字标题...");
    for (var i = 0; i < CONFIG.titles.length; i++) {
        var titleConfig = CONFIG.titles[i];

        // 创建标题剪辑
        var titleClip = sequence.createTitleClip(
            titleConfig.text,
            "Arial",
            72,
            [255, 255, 255], // 白色
            [0, 0, 0, 200],  // 半透明黑色背景
            timeToTicks(titleConfig.start),
            timeToTicks(titleConfig.duration)
        );

        if (titleClip) {
            // 添加到视频轨道2（叠加在视频上方）
            sequence.videoTracks[1].insertClip(titleClip, timeToTicks(titleConfig.start));
            log("标题已添加：" + titleConfig.text);
        }
    }

    // 6. 添加交叉溶解转场
    log("添加转场效果...");
    var videoTrack = sequence.videoTracks[0];
    for (var i = 0; i < videoTrack.clips.length - 1; i++) {
        var clip1 = videoTrack.clips[i];
        var clip2 = videoTrack.clips[i + 1];

        // 获取交叉溶解效果
        var crossDissolve = project.findProjectItemByPath("Cross Dissolve");
        if (crossDissolve) {
            // 在两个片段之间添加转场
            var transitionPoint = clip1.end; // 第一个片段的结束位置
            sequence.videoTracks[0].addTransition(
                crossDissolve,
                transitionPoint,
                timeToTicks(CONFIG.transitionDuration)
            );
            log("转场已添加到位置：" + (transitionPoint / 254016000000) + "秒");
        }
    }

    // 7. 添加音频淡入淡出
    log("添加音频效果...");
    if (sequence.audioTracks.length > 0) {
        var audioTrack = sequence.audioTracks[0];
        for (var i = 0; i < audioTrack.clips.length; i++) {
            var audioClip = audioTrack.clips[i];

            // 添加淡入
            audioClip.audioFadeIn = timeToTicks(0.5);
            // 添加淡出
            audioClip.audioFadeOut = timeToTicks(0.5);
        }
    }

    // 8. 导出设置（可选）
    log("设置导出参数...");
    var exportSettings = {
        outputFile: CONFIG.outputPath + "Showcase_Final.mp4",
        format: "H.264",
        preset: "YouTube 1080p HD",
        width: 1920,
        height: 1080,
        fps: 30,
        bitrate: 10 // Mbps
    };

    // 注意：实际导出需要用户手动触发或使用AME
    log("项目配置完成！");
    log("请手动导出或使用Adobe Media Encoder导出到：" + exportSettings.outputFile);

    // 9. 保存项目
    project.save();
    log("项目已保存");

    alert("自动剪辑完成！\n\n" +
          "项目已创建：" + CONFIG.projectName + "\n" +
          "序列：" + CONFIG.sequence.name + "\n" +
          "片段数：" + importedClips.length + "\n" +
          "总时长：" + (currentTime / 254016000000).toFixed(1) + "秒\n\n" +
          "请手动导出或使用Adobe Media Encoder导出最终视频。");
}

// 运行主函数
try {
    main();
} catch (e) {
    log("错误：" + e.toString());
    alert("脚本执行出错：\n" + e.toString());
}
