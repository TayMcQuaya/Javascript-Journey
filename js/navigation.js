class Navigation {
    constructor() {
        this.currentModule = Storage.load(Storage.KEYS.CURRENT_MODULE, 1);
        this.currentLesson = Storage.load(Storage.KEYS.CURRENT_LESSON, 1);
        this.modules = this.getModulesData();
    }

    getModulesData() {
        return {
            1: {
                title: 'Introduction & Setup',
                lessons: [
                    { id: 1, title: 'What is JavaScript?', duration: '15 min' },
                    { id: 2, title: 'Setting Up Your Environment', duration: '20 min' },
                    { id: 3, title: 'Your First JavaScript Code', duration: '25 min' },
                    { id: 4, title: 'Using the Browser Console', duration: '15 min' }
                ]
            },
            2: {
                title: 'Variables & Data Types',
                lessons: [
                    { id: 1, title: 'Understanding Variables', duration: '20 min' },
                    { id: 2, title: 'let, const, and var', duration: '25 min' },
                    { id: 3, title: 'Numbers and Strings', duration: '30 min' },
                    { id: 4, title: 'Booleans and Null/Undefined', duration: '20 min' },
                    { id: 5, title: 'Type Conversion', duration: '25 min' }
                ]
            },
            3: {
                title: 'Operators & Expressions',
                lessons: [
                    { id: 1, title: 'Arithmetic Operators', duration: '20 min' },
                    { id: 2, title: 'Comparison Operators', duration: '25 min' },
                    { id: 3, title: 'Logical Operators', duration: '25 min' },
                    { id: 4, title: 'Assignment Operators', duration: '20 min' }
                ]
            },
            4: {
                title: 'Control Flow',
                lessons: [
                    { id: 1, title: 'if/else Statements', duration: '30 min' },
                    { id: 2, title: 'switch Statements', duration: '25 min' },
                    { id: 3, title: 'for Loops', duration: '30 min' },
                    { id: 4, title: 'while and do-while Loops', duration: '25 min' },
                    { id: 5, title: 'break and continue', duration: '20 min' }
                ]
            },
            5: {
                title: 'Functions',
                lessons: [
                    { id: 1, title: 'Function Basics', duration: '25 min' },
                    { id: 2, title: 'Function Parameters', duration: '30 min' },
                    { id: 3, title: 'Return Values', duration: '25 min' },
                    { id: 4, title: 'Arrow Functions', duration: '30 min' },
                    { id: 5, title: 'Scope and Hoisting', duration: '35 min' },
                    { id: 6, title: 'Closures', duration: '40 min' }
                ]
            },
            6: {
                title: 'Arrays',
                lessons: [
                    { id: 1, title: 'Creating and Accessing Arrays', duration: '25 min' },
                    { id: 2, title: 'Array Methods: push, pop, shift, unshift', duration: '30 min' },
                    { id: 3, title: 'Iterating Through Arrays', duration: '30 min' },
                    { id: 4, title: 'Array Methods: map, filter, reduce', duration: '40 min' },
                    { id: 5, title: 'Array Destructuring', duration: '25 min' }
                ]
            },
            7: {
                title: 'Objects',
                lessons: [
                    { id: 1, title: 'Object Literals', duration: '25 min' },
                    { id: 2, title: 'Properties and Methods', duration: '30 min' },
                    { id: 3, title: 'The this Keyword', duration: '35 min' },
                    { id: 4, title: 'Object Destructuring', duration: '25 min' },
                    { id: 5, title: 'JSON', duration: '20 min' }
                ]
            },
            8: {
                title: 'DOM Manipulation',
                lessons: [
                    { id: 1, title: 'Introduction to the DOM', duration: '20 min' },
                    { id: 2, title: 'Selecting Elements', duration: '30 min' },
                    { id: 3, title: 'Modifying Elements', duration: '35 min' },
                    { id: 4, title: 'Creating and Removing Elements', duration: '30 min' },
                    { id: 5, title: 'Styling with JavaScript', duration: '25 min' }
                ]
            },
            9: {
                title: 'Events',
                lessons: [
                    { id: 1, title: 'Event Listeners', duration: '30 min' },
                    { id: 2, title: 'Event Types', duration: '35 min' },
                    { id: 3, title: 'Event Object', duration: '30 min' },
                    { id: 4, title: 'Event Delegation', duration: '35 min' }
                ]
            },
            10: {
                title: 'Final Projects',
                lessons: [
                    { id: 1, title: 'Project: Todo List', duration: '120 min' },
                    { id: 2, title: 'Project: Calculator', duration: '90 min' },
                    { id: 3, title: 'Project: Quiz Game', duration: '120 min' },
                    { id: 4, title: 'Project: Weather App', duration: '150 min' }
                ]
            }
        };
    }

    getCurrentModuleData() {
        return this.modules[this.currentModule];
    }

    getCurrentLessonData() {
        const module = this.getCurrentModuleData();
        return module?.lessons.find(l => l.id === this.currentLesson);
    }

    getNextLesson() {
        const module = this.getCurrentModuleData();
        const currentIndex = module.lessons.findIndex(l => l.id === this.currentLesson);
        
        if (currentIndex < module.lessons.length - 1) {
            return {
                moduleId: this.currentModule,
                lessonId: module.lessons[currentIndex + 1].id
            };
        } else if (this.currentModule < 10) {
            return {
                moduleId: this.currentModule + 1,
                lessonId: 1
            };
        }
        
        return null;
    }

    getPreviousLesson() {
        const module = this.getCurrentModuleData();
        const currentIndex = module.lessons.findIndex(l => l.id === this.currentLesson);
        
        if (currentIndex > 0) {
            return {
                moduleId: this.currentModule,
                lessonId: module.lessons[currentIndex - 1].id
            };
        } else if (this.currentModule > 1) {
            const prevModule = this.modules[this.currentModule - 1];
            return {
                moduleId: this.currentModule - 1,
                lessonId: prevModule.lessons[prevModule.lessons.length - 1].id
            };
        }
        
        return null;
    }

    navigateToLesson(moduleId, lessonId) {
        this.currentModule = moduleId;
        this.currentLesson = lessonId;
        
        Storage.save(Storage.KEYS.CURRENT_MODULE, moduleId);
        Storage.save(Storage.KEYS.CURRENT_LESSON, lessonId);
        
        window.location.href = `/lessons/module${moduleId}/lesson${lessonId}.html`;
    }

    createBreadcrumb() {
        const module = this.getCurrentModuleData();
        const lesson = this.getCurrentLessonData();
        
        return `
            <nav class="breadcrumb">
                <a href="/">Home</a>
                <span class="separator">/</span>
                <a href="/lessons/module${this.currentModule}/">Module ${this.currentModule}: ${module.title}</a>
                <span class="separator">/</span>
                <span class="current">Lesson ${this.currentLesson}: ${lesson.title}</span>
            </nav>
        `;
    }

    createLessonNavigation() {
        const prev = this.getPreviousLesson();
        const next = this.getNextLesson();
        
        return `
            <div class="lesson-navigation">
                ${prev ? `
                    <button class="btn btn-secondary" onclick="navigation.navigateToLesson(${prev.moduleId}, ${prev.lessonId})">
                        <i class="fas fa-arrow-left"></i> Previous Lesson
                    </button>
                ` : '<div></div>'}
                
                <button class="btn btn-primary" onclick="navigation.completeCurrentLesson()">
                    Complete Lesson <i class="fas fa-check"></i>
                </button>
                
                ${next ? `
                    <button class="btn btn-secondary" onclick="navigation.navigateToLesson(${next.moduleId}, ${next.lessonId})">
                        Next Lesson <i class="fas fa-arrow-right"></i>
                    </button>
                ` : '<div></div>'}
            </div>
        `;
    }

    completeCurrentLesson() {
        Storage.saveProgress(this.currentModule, this.currentLesson, true);
        
        const next = this.getNextLesson();
        if (next) {
            this.showCompletionMessage();
            setTimeout(() => {
                this.navigateToLesson(next.moduleId, next.lessonId);
            }, 2000);
        } else {
            this.showCourseCompletionMessage();
        }
    }

    showCompletionMessage() {
        const message = document.createElement('div');
        message.className = 'completion-message';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Lesson Complete!</h3>
            <p>Great job! Moving to the next lesson...</p>
        `;
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: var(--success-color);
            color: white;
            padding: 2rem 3rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            text-align: center;
            z-index: 1000;
            animation: scaleIn 0.3s ease-out;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => message.remove(), 2000);
    }

    showCourseCompletionMessage() {
        const message = document.createElement('div');
        message.className = 'course-completion';
        message.innerHTML = `
            <i class="fas fa-trophy"></i>
            <h2>Congratulations!</h2>
            <p>You've completed the entire JavaScript Journey course!</p>
            <button class="btn btn-primary" onclick="window.location.href='/'">Back to Home</button>
        `;
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: var(--bg-primary);
            padding: 3rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            text-align: center;
            z-index: 1000;
            animation: scaleIn 0.5s ease-out;
        `;
        
        document.body.appendChild(message);
        
        app.createConfetti();
    }

    createModuleSidebar() {
        const module = this.getCurrentModuleData();
        const progress = Storage.getProgress();
        
        return `
            <aside class="module-sidebar">
                <h3>Module ${this.currentModule}: ${module.title}</h3>
                <ul class="lesson-list">
                    ${module.lessons.map(lesson => {
                        const isCompleted = progress.modules[this.currentModule]?.lessons[lesson.id]?.completed;
                        const isCurrent = lesson.id === this.currentLesson;
                        
                        return `
                            <li class="lesson-item ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}">
                                <a href="/lessons/module${this.currentModule}/lesson${lesson.id}.html">
                                    <i class="fas ${isCompleted ? 'fa-check-circle' : 'fa-circle'}"></i>
                                    <span>${lesson.title}</span>
                                    <span class="duration">${lesson.duration}</span>
                                </a>
                            </li>
                        `;
                    }).join('')}
                </ul>
            </aside>
        `;
    }
}

const navigation = new Navigation();