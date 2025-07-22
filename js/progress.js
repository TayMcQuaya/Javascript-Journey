class ProgressTracker {
    constructor() {
        this.charts = {};
        this.stats = {
            totalLessons: 47,
            totalModules: 10,
            totalExercises: 100
        };
    }

    init() {
        this.updateAllProgress();
        this.createProgressCharts();
        this.updateStats();
    }

    updateAllProgress() {
        const progress = Storage.getProgress();
        
        document.querySelectorAll('[data-module-progress]').forEach(element => {
            const moduleId = element.dataset.moduleProgress;
            const moduleProgress = progress.modules[moduleId]?.progress || 0;
            element.style.width = `${moduleProgress}%`;
            
            const card = element.closest('.module-card');
            if (card) {
                if (moduleProgress === 100) {
                    card.classList.add('completed');
                    const btn = card.querySelector('.start-module');
                    if (btn) {
                        btn.innerHTML = 'Review Module <i class="fas fa-redo"></i>';
                        btn.classList.replace('btn-primary', 'btn-success');
                    }
                } else if (moduleProgress > 0) {
                    card.classList.add('in-progress');
                    const btn = card.querySelector('.start-module');
                    if (btn) {
                        btn.innerHTML = 'Continue Learning <i class="fas fa-arrow-right"></i>';
                    }
                }
            }
        });

        const overallProgress = document.getElementById('overallProgress');
        if (overallProgress) {
            overallProgress.style.width = `${progress.overall}%`;
            this.animateProgress(overallProgress, progress.overall);
        }

        const progressText = document.getElementById('progressText');
        if (progressText) {
            progressText.textContent = `${progress.overall}% Complete`;
        }
    }

    animateProgress(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.style.width = `${current}%`;
        }, 10);
    }

    createProgressCharts() {
        const progress = Storage.getProgress();
        const scores = Storage.load(Storage.KEYS.EXERCISE_SCORES, {});
        
        const moduleProgress = Object.entries(progress.modules).map(([id, data]) => ({
            module: `Module ${id}`,
            progress: data.progress || 0
        }));

        this.createModuleChart(moduleProgress);
        this.createScoreChart(scores);
        this.createTimeChart();
    }

    createModuleChart(data) {
        const chartContainer = document.getElementById('moduleChart');
        if (!chartContainer) return;

        chartContainer.innerHTML = '';
        const maxWidth = 300;
        
        data.forEach(item => {
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.innerHTML = `
                <div class="bar-label">${item.module}</div>
                <div class="bar-container">
                    <div class="bar-fill" style="width: ${(item.progress / 100) * maxWidth}px">
                        ${item.progress}%
                    </div>
                </div>
            `;
            chartContainer.appendChild(bar);
        });
    }

    createScoreChart(scores) {
        const chartContainer = document.getElementById('scoreChart');
        if (!chartContainer) return;

        let totalScore = 0;
        let totalMax = 0;

        Object.values(scores).forEach(module => {
            Object.values(module).forEach(lesson => {
                Object.values(lesson).forEach(exercise => {
                    totalScore += exercise.score;
                    totalMax += exercise.maxScore;
                });
            });
        });

        const percentage = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
        
        chartContainer.innerHTML = `
            <div class="score-display">
                <div class="score-circle">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-tertiary)" stroke-width="10"/>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary-color)" stroke-width="10"
                                stroke-dasharray="${percentage * 2.83} 283"
                                transform="rotate(-90 50 50)"/>
                    </svg>
                    <div class="score-text">${percentage}%</div>
                </div>
                <div class="score-details">
                    <p>Total Score: ${totalScore}/${totalMax}</p>
                    <p>Average: ${percentage}%</p>
                </div>
            </div>
        `;
    }

    createTimeChart() {
        const chartContainer = document.getElementById('timeChart');
        if (!chartContainer) return;

        const timeData = Storage.load(Storage.KEYS.TIME_SPENT, {});
        const moduleTime = {};

        Object.entries(timeData).forEach(([moduleId, lessons]) => {
            moduleTime[moduleId] = Object.values(lessons).reduce((sum, time) => sum + time, 0);
        });

        const totalTime = Object.values(moduleTime).reduce((sum, time) => sum + time, 0);
        const hours = Math.floor(totalTime / 3600);
        const minutes = Math.floor((totalTime % 3600) / 60);

        chartContainer.innerHTML = `
            <div class="time-display">
                <h3>${hours}h ${minutes}m</h3>
                <p>Total Study Time</p>
            </div>
            <div class="time-breakdown">
                ${Object.entries(moduleTime).map(([id, time]) => {
                    const moduleHours = Math.floor(time / 3600);
                    const moduleMinutes = Math.floor((time % 3600) / 60);
                    return `
                        <div class="time-item">
                            <span>Module ${id}</span>
                            <span>${moduleHours}h ${moduleMinutes}m</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    updateStats() {
        const progress = Storage.getProgress();
        const achievements = Storage.getAchievements();
        
        let completedLessons = 0;
        let completedModules = 0;

        Object.values(progress.modules).forEach(module => {
            if (module.completed) completedModules++;
            Object.values(module.lessons || {}).forEach(lesson => {
                if (lesson.completed) completedLessons++;
            });
        });

        const statsContainer = document.getElementById('statsOverview');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat-grid">
                    <div class="stat-item">
                        <i class="fas fa-book-open"></i>
                        <h4>${completedLessons}/${this.stats.totalLessons}</h4>
                        <p>Lessons Completed</p>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-folder-open"></i>
                        <h4>${completedModules}/${this.stats.totalModules}</h4>
                        <p>Modules Completed</p>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-trophy"></i>
                        <h4>${Object.keys(achievements).length}</h4>
                        <p>Achievements</p>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-fire"></i>
                        <h4>${this.calculateStreak()}</h4>
                        <p>Day Streak</p>
                    </div>
                </div>
            `;
        }
    }

    calculateStreak() {
        const progress = Storage.getProgress();
        if (!progress.lastAccessed) return 0;

        const lastDate = new Date(progress.lastAccessed);
        const today = new Date();
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays <= 1 ? 1 : 0;
    }

    createProgressReport() {
        const progress = Storage.getProgress();
        const scores = Storage.load(Storage.KEYS.EXERCISE_SCORES, {});
        const achievements = Storage.getAchievements();
        const totalTime = Storage.getTotalTimeSpent();

        const report = {
            overall: progress.overall,
            modules: {},
            achievements: Object.keys(achievements).length,
            totalTime: totalTime,
            lastAccessed: progress.lastAccessed
        };

        Object.entries(progress.modules).forEach(([moduleId, moduleData]) => {
            report.modules[moduleId] = {
                progress: moduleData.progress,
                completed: moduleData.completed,
                scores: scores[moduleId] || {}
            };
        });

        return report;
    }

    exportProgress() {
        const report = this.createProgressReport();
        const dataStr = JSON.stringify(report, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `javascript_journey_progress_${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    importProgress(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                customModal.confirm(
                    'This will replace all your current progress. Are you sure?',
                    'Import Progress',
                    () => {
                        Object.entries(data.modules).forEach(([moduleId, moduleData]) => {
                            Object.entries(moduleData.scores).forEach(([lessonId, lessonScores]) => {
                                Object.entries(lessonScores).forEach(([exerciseId, score]) => {
                                    Storage.saveExerciseScore(moduleId, lessonId, exerciseId, score.score, score.maxScore);
                                });
                            });
                        });

                        customModal.success('Progress imported successfully!', 'Import Complete');
                        setTimeout(() => window.location.reload(), 1500);
                    }
                );
            } catch (error) {
                customModal.error('Error importing progress. Please check the file format.', 'Import Error');
            }
        };
        reader.readAsText(file);
    }
}

const progressTracker = new ProgressTracker();