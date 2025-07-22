class ExerciseSystem {
    constructor() {
        this.exercises = {
            fillInBlank: this.createFillInBlankValidator(),
            multipleChoice: this.createMultipleChoiceValidator(),
            codeChallenge: this.createCodeChallengeValidator(),
            trueFalse: this.createTrueFalseValidator()
        };
        
        this.currentExercise = null;
        this.attempts = 0;
        this.maxAttempts = 3;
    }

    createFillInBlankValidator() {
        return {
            validate: (userAnswer, correctAnswers, options = {}) => {
                const normalized = userAnswer.trim().toLowerCase();
                const isCorrect = correctAnswers.some(answer => {
                    if (options.exactMatch) {
                        return userAnswer.trim() === answer;
                    }
                    return normalized === answer.toLowerCase();
                });
                
                return {
                    correct: isCorrect,
                    feedback: isCorrect 
                        ? "Correct! Great job!" 
                        : `Not quite. The correct answer is: ${correctAnswers[0]}`
                };
            }
        };
    }

    createMultipleChoiceValidator() {
        return {
            validate: (selectedIndex, correctIndex) => {
                const isCorrect = selectedIndex === correctIndex;
                return {
                    correct: isCorrect,
                    feedback: isCorrect 
                        ? "Correct! Well done!" 
                        : "That's not right. Try again!"
                };
            }
        };
    }

    createTrueFalseValidator() {
        return {
            validate: (userAnswer, correctAnswer) => {
                const isCorrect = userAnswer === correctAnswer;
                return {
                    correct: isCorrect,
                    feedback: isCorrect 
                        ? "Correct!" 
                        : `Actually, it's ${correctAnswer ? 'True' : 'False'}.`
                };
            }
        };
    }

    createCodeChallengeValidator() {
        return {
            validate: (userCode, testCases) => {
                const results = [];
                let allPassed = true;
                
                for (const testCase of testCases) {
                    try {
                        const wrappedCode = `
                            (function() {
                                ${userCode}
                                return ${testCase.call};
                            })()
                        `;
                        
                        const result = eval(wrappedCode);
                        const passed = this.deepEqual(result, testCase.expected);
                        
                        results.push({
                            input: testCase.input,
                            expected: testCase.expected,
                            actual: result,
                            passed
                        });
                        
                        if (!passed) allPassed = false;
                        
                    } catch (error) {
                        results.push({
                            input: testCase.input,
                            expected: testCase.expected,
                            actual: `Error: ${error.message}`,
                            passed: false
                        });
                        allPassed = false;
                    }
                }
                
                return {
                    correct: allPassed,
                    results,
                    feedback: allPassed 
                        ? "All tests passed! Excellent work!" 
                        : "Some tests failed. Check the results below."
                };
            }
        };
    }

    deepEqual(a, b) {
        if (a === b) return true;
        
        if (a instanceof Date && b instanceof Date) {
            return a.getTime() === b.getTime();
        }
        
        if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
            return a === b;
        }
        
        if (a === null || a === undefined || b === null || b === undefined) {
            return false;
        }
        
        if (a.prototype !== b.prototype) return false;
        
        const keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length) return false;
        
        return keys.every(k => this.deepEqual(a[k], b[k]));
    }

    createExercise(type, config) {
        const exercise = {
            id: config.id || Date.now().toString(),
            type,
            ...config,
            attempts: 0,
            completed: false,
            score: 0
        };
        
        this.currentExercise = exercise;
        return exercise;
    }

    validateExercise(type, userAnswer, correctAnswer, options = {}) {
        if (!this.exercises[type]) {
            throw new Error(`Unknown exercise type: ${type}`);
        }
        
        this.attempts++;
        const result = this.exercises[type].validate(userAnswer, correctAnswer, options);
        
        if (this.currentExercise) {
            this.currentExercise.attempts = this.attempts;
            this.currentExercise.completed = result.correct;
            
            if (result.correct) {
                const score = Math.max(0, 100 - (this.attempts - 1) * 20);
                this.currentExercise.score = score;
                
                if (this.currentExercise.moduleId && this.currentExercise.lessonId) {
                    Storage.saveExerciseScore(
                        this.currentExercise.moduleId,
                        this.currentExercise.lessonId,
                        this.currentExercise.id,
                        score,
                        100
                    );
                }
            }
        }
        
        return result;
    }

    createInteractiveCodeEditor(config) {
        const editorId = `editor-${Date.now()}`;
        
        return `
            <div class="code-editor" id="${editorId}">
                <div class="editor-header">
                    <div class="editor-tabs">
                        <button class="editor-tab active" data-tab="js">JavaScript</button>
                        <button class="editor-tab" data-tab="output">Output</button>
                        ${config.showTests ? '<button class="editor-tab" data-tab="tests">Tests</button>' : ''}
                    </div>
                    <div class="editor-actions">
                        <button class="editor-btn" onclick="exercises.runCode('${editorId}')">
                            <i class="fas fa-play"></i> Run Code
                        </button>
                        ${config.showHint ? `
                            <button class="editor-btn hint-btn" onclick="exercises.showHint('${editorId}')">
                                <i class="fas fa-lightbulb"></i> Hint
                            </button>
                        ` : ''}
                        ${config.showSolution ? `
                            <button class="editor-btn solution-btn" onclick="exercises.showSolution('${editorId}')">
                                <i class="fas fa-eye"></i> Solution
                            </button>
                        ` : ''}
                    </div>
                </div>
                <div class="editor-content">
                    <div class="editor-pane" data-pane="js">
                        <textarea class="code-input" id="${editorId}-code">${config.starterCode || ''}</textarea>
                    </div>
                    <div class="editor-pane" data-pane="output" style="display: none;">
                        <div class="code-output" id="${editorId}-output">
                            <div class="output-label">Output will appear here...</div>
                        </div>
                    </div>
                    ${config.showTests ? `
                        <div class="editor-pane" data-pane="tests" style="display: none;">
                            <div class="test-results" id="${editorId}-tests"></div>
                        </div>
                    ` : ''}
                </div>
                ${config.hint ? `
                    <div class="hint-content" id="${editorId}-hint" style="display: none;">
                        <i class="fas fa-lightbulb"></i> ${config.hint}
                    </div>
                ` : ''}
                ${config.solution ? `
                    <div class="solution-content" id="${editorId}-solution" style="display: none;">
                        <pre><code>${config.solution}</code></pre>
                    </div>
                ` : ''}
            </div>
        `;
    }

    runCode(editorId) {
        const codeInput = document.getElementById(`${editorId}-code`);
        const outputPane = document.getElementById(`${editorId}-output`);
        
        if (!codeInput || !outputPane) return;
        
        const code = codeInput.value;
        outputPane.innerHTML = '';
        
        const originalConsoleLog = console.log;
        const logs = [];
        
        console.log = (...args) => {
            logs.push(args.map(arg => {
                if (typeof arg === 'object') {
                    return JSON.stringify(arg, null, 2);
                }
                return String(arg);
            }).join(' '));
        };
        
        try {
            const result = eval(`
                (function() {
                    ${code}
                })()
            `);
            
            if (logs.length > 0) {
                outputPane.innerHTML = logs.map(log => 
                    `<div class="output-line">${this.escapeHtml(log)}</div>`
                ).join('');
            } else if (result !== undefined) {
                outputPane.innerHTML = `<div class="output-line">${this.escapeHtml(String(result))}</div>`;
            } else {
                outputPane.innerHTML = '<div class="output-line muted">Code executed successfully (no output)</div>';
            }
            
            this.showTab(editorId, 'output');
            
        } catch (error) {
            outputPane.innerHTML = `<div class="output-error">Error: ${this.escapeHtml(error.message)}</div>`;
            this.showTab(editorId, 'output');
        } finally {
            console.log = originalConsoleLog;
        }
        
        if (this.currentExercise && this.currentExercise.testCases) {
            this.runTests(editorId, code);
        }
    }

    runTests(editorId, code) {
        const testsPane = document.getElementById(`${editorId}-tests`);
        if (!testsPane || !this.currentExercise?.testCases) return;
        
        const result = this.exercises.codeChallenge.validate(code, this.currentExercise.testCases);
        
        testsPane.innerHTML = `
            <div class="test-summary ${result.correct ? 'passed' : 'failed'}">
                ${result.correct ? '✓ All tests passed!' : '✗ Some tests failed'}
            </div>
            <div class="test-list">
                ${result.results.map((test, index) => `
                    <div class="test-case ${test.passed ? 'passed' : 'failed'}">
                        <div class="test-header">
                            ${test.passed ? '✓' : '✗'} Test Case ${index + 1}
                        </div>
                        <div class="test-details">
                            <div>Input: <code>${this.escapeHtml(test.input)}</code></div>
                            <div>Expected: <code>${this.escapeHtml(JSON.stringify(test.expected))}</code></div>
                            <div>Actual: <code>${this.escapeHtml(JSON.stringify(test.actual))}</code></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        this.showTab(editorId, 'tests');
        
        if (result.correct) {
            this.showSuccessAnimation();
        }
    }

    showTab(editorId, tabName) {
        const editor = document.getElementById(editorId);
        if (!editor) return;
        
        editor.querySelectorAll('.editor-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        editor.querySelectorAll('.editor-pane').forEach(pane => {
            pane.style.display = pane.dataset.pane === tabName ? 'block' : 'none';
        });
    }

    showHint(editorId) {
        const hint = document.getElementById(`${editorId}-hint`);
        if (hint) {
            hint.style.display = hint.style.display === 'none' ? 'block' : 'none';
        }
    }

    showSolution(editorId) {
        const solution = document.getElementById(`${editorId}-solution`);
        if (solution) {
            solution.style.display = solution.style.display === 'none' ? 'block' : 'none';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showSuccessAnimation() {
        const celebration = document.createElement('div');
        celebration.className = 'exercise-success';
        celebration.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Excellent!</h3>
            <p>You've completed this exercise!</p>
        `;
        celebration.style.cssText = `
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
        
        document.body.appendChild(celebration);
        
        setTimeout(() => celebration.remove(), 3000);
    }

    setupCodeEditor() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('editor-tab')) {
                const editor = e.target.closest('.code-editor');
                const tab = e.target.dataset.tab;
                if (editor && tab) {
                    this.showTab(editor.id, tab);
                }
            }
        });
    }
}

const exercises = new ExerciseSystem();
exercises.setupCodeEditor();