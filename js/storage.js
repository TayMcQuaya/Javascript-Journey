const Storage = {
    KEYS: {
        PROGRESS: 'js_journey_progress',
        THEME: 'js_journey_theme',
        COMPLETED_LESSONS: 'js_journey_completed_lessons',
        EXERCISE_SCORES: 'js_journey_exercise_scores',
        CURRENT_MODULE: 'js_journey_current_module',
        CURRENT_LESSON: 'js_journey_current_lesson',
        CODE_HISTORY: 'js_journey_code_history',
        ACHIEVEMENTS: 'js_journey_achievements',
        TIME_SPENT: 'js_journey_time_spent'
    },

    save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    load(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return defaultValue;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    clear() {
        try {
            Object.values(this.KEYS).forEach(key => this.remove(key));
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    getProgress() {
        return this.load(this.KEYS.PROGRESS, {
            modules: {},
            overall: 0,
            lastAccessed: new Date().toISOString()
        });
    },

    saveProgress(moduleId, lessonId, completed = false) {
        const progress = this.getProgress();
        
        if (!progress.modules[moduleId]) {
            progress.modules[moduleId] = {
                lessons: {},
                completed: false,
                progress: 0
            };
        }

        progress.modules[moduleId].lessons[lessonId] = {
            completed,
            lastAccessed: new Date().toISOString()
        };

        const moduleProgress = this.calculateModuleProgress(moduleId);
        progress.modules[moduleId].progress = moduleProgress;
        progress.modules[moduleId].completed = moduleProgress === 100;

        progress.overall = this.calculateOverallProgress(progress.modules);
        progress.lastAccessed = new Date().toISOString();

        this.save(this.KEYS.PROGRESS, progress);
        return progress;
    },

    calculateModuleProgress(moduleId) {
        const progress = this.getProgress();
        const module = progress.modules[moduleId];
        
        if (!module || !module.lessons) return 0;

        const totalLessons = this.getModuleLessonCount(moduleId);
        const completedLessons = Object.values(module.lessons).filter(l => l.completed).length;
        
        return Math.round((completedLessons / totalLessons) * 100);
    },

    calculateOverallProgress(modules) {
        const totalModules = 10;
        const moduleProgresses = Object.values(modules).map(m => m.progress || 0);
        const sum = moduleProgresses.reduce((acc, curr) => acc + curr, 0);
        
        return Math.round(sum / totalModules);
    },

    getModuleLessonCount(moduleId) {
        const lessonCounts = {
            1: 4,
            2: 5,
            3: 4,
            4: 5,
            5: 6,
            6: 5,
            7: 5,
            8: 5,
            9: 4,
            10: 4
        };
        return lessonCounts[moduleId] || 4;
    },

    saveExerciseScore(moduleId, lessonId, exerciseId, score, maxScore) {
        const scores = this.load(this.KEYS.EXERCISE_SCORES, {});
        
        if (!scores[moduleId]) scores[moduleId] = {};
        if (!scores[moduleId][lessonId]) scores[moduleId][lessonId] = {};
        
        scores[moduleId][lessonId][exerciseId] = {
            score,
            maxScore,
            timestamp: new Date().toISOString()
        };

        this.save(this.KEYS.EXERCISE_SCORES, scores);
        return scores;
    },

    getExerciseScores(moduleId, lessonId) {
        const scores = this.load(this.KEYS.EXERCISE_SCORES, {});
        return scores[moduleId]?.[lessonId] || {};
    },

    saveCodeHistory(code, moduleId, lessonId) {
        const history = this.load(this.KEYS.CODE_HISTORY, []);
        
        history.unshift({
            code,
            moduleId,
            lessonId,
            timestamp: new Date().toISOString()
        });

        if (history.length > 50) {
            history.pop();
        }

        this.save(this.KEYS.CODE_HISTORY, history);
        return history;
    },

    getCodeHistory(moduleId, lessonId) {
        const history = this.load(this.KEYS.CODE_HISTORY, []);
        
        if (moduleId && lessonId) {
            return history.filter(h => h.moduleId === moduleId && h.lessonId === lessonId);
        }
        
        return history;
    },

    saveAchievement(achievementId, data) {
        const achievements = this.load(this.KEYS.ACHIEVEMENTS, {});
        
        achievements[achievementId] = {
            ...data,
            unlockedAt: new Date().toISOString()
        };

        this.save(this.KEYS.ACHIEVEMENTS, achievements);
        return achievements;
    },

    getAchievements() {
        return this.load(this.KEYS.ACHIEVEMENTS, {});
    },

    trackTime(moduleId, lessonId, seconds) {
        const timeData = this.load(this.KEYS.TIME_SPENT, {});
        
        if (!timeData[moduleId]) timeData[moduleId] = {};
        if (!timeData[moduleId][lessonId]) timeData[moduleId][lessonId] = 0;
        
        timeData[moduleId][lessonId] += seconds;
        
        this.save(this.KEYS.TIME_SPENT, timeData);
        return timeData;
    },

    getTotalTimeSpent() {
        const timeData = this.load(this.KEYS.TIME_SPENT, {});
        let total = 0;
        
        Object.values(timeData).forEach(module => {
            Object.values(module).forEach(time => {
                total += time;
            });
        });
        
        return total;
    },

    resetModule(moduleId) {
        const progress = this.getProgress();
        const scores = this.load(this.KEYS.EXERCISE_SCORES, {});
        const timeData = this.load(this.KEYS.TIME_SPENT, {});
        
        if (progress.modules[moduleId]) {
            delete progress.modules[moduleId];
            progress.overall = this.calculateOverallProgress(progress.modules);
            this.save(this.KEYS.PROGRESS, progress);
        }
        
        if (scores[moduleId]) {
            delete scores[moduleId];
            this.save(this.KEYS.EXERCISE_SCORES, scores);
        }
        
        if (timeData[moduleId]) {
            delete timeData[moduleId];
            this.save(this.KEYS.TIME_SPENT, timeData);
        }
        
        return true;
    },

    resetAll() {
        return this.clear();
    }
};