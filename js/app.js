class App {
    constructor() {
        this.currentModule = null;
        this.currentLesson = null;
        this.theme = 'light';
        this.timeTracker = null;
        this.sessionStartTime = null;
        
        this.init();
    }

    init() {
        this.detectCurrentModule();
        this.loadTheme();
        this.loadProgress();
        this.setupEventListeners();
        this.checkAchievements();
        this.startSessionTimer();
    }

    detectCurrentModule() {
        // Detect module from URL path
        const path = window.location.pathname;
        const moduleMatch = path.match(/\/module(\d+)\//);
        
        if (moduleMatch) {
            this.currentModule = parseInt(moduleMatch[1]);
            Storage.save(Storage.KEYS.CURRENT_MODULE, this.currentModule);
            
            // Also detect lesson if on a lesson page
            const lessonMatch = path.match(/lesson(\d+)\.html/);
            if (lessonMatch) {
                this.currentLesson = parseInt(lessonMatch[1]);
            }
        }
    }

    loadTheme() {
        const savedTheme = Storage.load(Storage.KEYS.THEME, 'light');
        this.theme = savedTheme;
        this.applyTheme(savedTheme);
    }

    applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            document.querySelector('#themeBtn i').classList.replace('fa-moon', 'fa-sun');
        } else {
            document.body.classList.remove('dark-theme');
            document.querySelector('#themeBtn i').classList.replace('fa-sun', 'fa-moon');
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.theme);
        Storage.save(Storage.KEYS.THEME, this.theme);
    }

    loadProgress() {
        const progress = Storage.getProgress();
        this.updateOverallProgress(progress.overall);
        
        Object.entries(progress.modules).forEach(([moduleId, moduleData]) => {
            this.updateModuleProgress(moduleId, moduleData.progress);
        });
    }

    updateOverallProgress(percentage) {
        const progressFill = document.getElementById('overallProgress');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${percentage}% Complete`;
        }
    }

    updateModuleProgress(moduleId, percentage) {
        const progressFill = document.querySelector(`[data-module-progress="${moduleId}"]`);
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        const moduleCard = document.querySelector(`.module-card[data-module="${moduleId}"]`);
        if (moduleCard && percentage === 100) {
            moduleCard.classList.add('completed');
        }
    }

    setupEventListeners() {
        document.getElementById('themeBtn')?.addEventListener('click', () => this.toggleTheme());
        
        document.getElementById('resetBtn')?.addEventListener('click', () => this.showResetModal());
        
        document.getElementById('progressBtn')?.addEventListener('click', () => this.showProgressDetails());
        
        document.querySelectorAll('.start-module').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const moduleId = e.target.dataset.module;
                this.startModule(moduleId);
            });
        });
        
        document.getElementById('resetAllBtn')?.addEventListener('click', () => this.resetAllProgress());
        
        document.getElementById('resetModuleBtn')?.addEventListener('click', () => this.resetCurrentModule());
        
        document.getElementById('cancelResetBtn')?.addEventListener('click', () => this.hideResetModal());
        
        document.querySelector('.modal')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideResetModal();
            }
        });
    }

    startModule(moduleId) {
        this.currentModule = moduleId;
        Storage.save(Storage.KEYS.CURRENT_MODULE, moduleId);
        
        // Show "coming soon" notification for modules 4-10
        if (moduleId >= 4 && moduleId <= 10) {
            customModal.alert('This module will be coming soon!', 'Coming Soon', {
                icon: 'fas fa-clock',
                confirmText: 'OK'
            });
            return;
        }
        
        window.location.href = `lessons/module${moduleId}/index.html`;
    }

    showResetModal() {
        const modal = document.getElementById('resetModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    hideResetModal() {
        const modal = document.getElementById('resetModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    resetAllProgress() {
        customModal.confirm(
            'Are you sure you want to reset ALL your progress? This cannot be undone.',
            'Reset All Progress',
            () => {
                Storage.resetAll();
                customModal.success('All progress has been reset!', 'Success');
                setTimeout(() => window.location.reload(), 1500);
            }
        );
        this.hideResetModal();
    }

    resetCurrentModule() {
        // Re-detect module in case it wasn't set initially
        this.detectCurrentModule();
        
        if (!this.currentModule) {
            customModal.alert('You must be on a module or lesson page to reset the current module.', 'No Module Detected');
            this.hideResetModal();
            return;
        }
        
        customModal.confirm(
            `Are you sure you want to reset Module ${this.currentModule}? This will reset all progress for lessons in this module.`,
            `Reset Module ${this.currentModule}`,
            () => {
                Storage.resetModule(this.currentModule);
                customModal.success(`Module ${this.currentModule} has been reset!`, 'Success');
                setTimeout(() => window.location.reload(), 1500);
            }
        );
        this.hideResetModal();
    }

    showProgressDetails() {
        const progress = Storage.getProgress();
        const totalTime = Storage.getTotalTimeSpent();
        const achievements = Storage.getAchievements();
        const scores = Storage.load(Storage.KEYS.EXERCISE_SCORES, {});
        
        const hours = Math.floor(totalTime / 3600);
        const minutes = Math.floor((totalTime % 3600) / 60);
        
        // Calculate completed lessons and modules
        let completedLessons = 0;
        let completedModules = 0;
        let totalLessons = 0;
        
        Object.entries(progress.modules).forEach(([moduleId, moduleData]) => {
            if (moduleData.completed) completedModules++;
            Object.entries(moduleData.lessons || {}).forEach(([lessonId, lessonData]) => {
                totalLessons++;
                if (lessonData.completed) completedLessons++;
            });
        });
        
        // Build progress details HTML
        const progressHTML = `
            <div class="progress-modal-content">
                <div class="progress-overview">
                    <div class="progress-stat-card">
                        <i class="fas fa-chart-line"></i>
                        <h3>${progress.overall}%</h3>
                        <p>Overall Progress</p>
                    </div>
                    <div class="progress-stat-card">
                        <i class="fas fa-clock"></i>
                        <h3>${hours}h ${minutes}m</h3>
                        <p>Time Spent</p>
                    </div>
                    <div class="progress-stat-card">
                        <i class="fas fa-trophy"></i>
                        <h3>${Object.keys(achievements).length}</h3>
                        <p>Achievements</p>
                    </div>
                    <div class="progress-stat-card">
                        <i class="fas fa-book-open"></i>
                        <h3>${completedLessons}/${totalLessons}</h3>
                        <p>Lessons Completed</p>
                    </div>
                </div>
                
                <div class="module-progress-list">
                    <h4>Module Progress</h4>
                    ${Object.entries(progress.modules).map(([moduleId, moduleData]) => `
                        <div class="module-progress-item">
                            <div class="module-info">
                                <span class="module-name">Module ${moduleId}</span>
                                <span class="module-percent">${moduleData.progress || 0}%</span>
                            </div>
                            <div class="progress-bar small">
                                <div class="progress-fill" style="width: ${moduleData.progress || 0}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="progress-footer">
                    <p class="last-accessed">Last accessed: ${new Date(progress.lastAccessed).toLocaleDateString()}</p>
                </div>
            </div>
        `;
        
        customModal.show({
            title: 'Your Progress',
            message: progressHTML,
            type: 'info',
            icon: 'fas fa-chart-line',
            buttons: [
                { 
                    text: 'Export Progress', 
                    primary: false, 
                    icon: 'fas fa-download',
                    callback: () => {
                        progressTracker.exportProgress();
                        customModal.success('Progress exported successfully!', 'Export Complete');
                    },
                    keepOpen: true
                },
                { text: 'Close', primary: true }
            ]
        });
    }

    showSuccessMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'success-message';
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--success-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }

    startSessionTimer() {
        this.sessionStartTime = Date.now();
        
        this.timeTracker = setInterval(() => {
            if (this.currentModule && this.currentLesson) {
                const elapsed = Math.floor((Date.now() - this.sessionStartTime) / 1000);
                if (elapsed > 0 && elapsed % 60 === 0) {
                    Storage.trackTime(this.currentModule, this.currentLesson, 60);
                }
            }
        }, 1000);
    }

    checkAchievements() {
        const progress = Storage.getProgress();
        const achievements = Storage.getAchievements();
        const totalTime = Storage.getTotalTimeSpent();
        
        if (progress.overall >= 10 && !achievements.firstSteps) {
            this.unlockAchievement('firstSteps', {
                title: 'First Steps',
                description: 'Complete 10% of the course',
                icon: 'fa-shoe-prints'
            });
        }
        
        if (progress.overall >= 50 && !achievements.halfwayThere) {
            this.unlockAchievement('halfwayThere', {
                title: 'Halfway There',
                description: 'Complete 50% of the course',
                icon: 'fa-star-half-alt'
            });
        }
        
        if (progress.overall === 100 && !achievements.jsHero) {
            this.unlockAchievement('jsHero', {
                title: 'JavaScript Hero',
                description: 'Complete the entire course',
                icon: 'fa-trophy'
            });
        }
        
        if (totalTime >= 3600 && !achievements.dedicated) {
            this.unlockAchievement('dedicated', {
                title: 'Dedicated Learner',
                description: 'Study for 1 hour total',
                icon: 'fa-clock'
            });
        }
    }

    unlockAchievement(id, data) {
        Storage.saveAchievement(id, data);
        this.showAchievementNotification(data);
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <i class="fas ${achievement.icon}"></i>
            <div>
                <h4>Achievement Unlocked!</h4>
                <p>${achievement.title}</p>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: var(--secondary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 1000;
            animation: slideIn 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        this.createConfetti();
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    createConfetti() {
        const celebration = document.createElement('div');
        celebration.className = 'celebration';
        document.body.appendChild(celebration);
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.backgroundColor = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)];
            celebration.appendChild(confetti);
        }
        
        setTimeout(() => celebration.remove(), 4000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});