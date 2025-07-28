# Exercise Feedback Guidelines

This document outlines the standardized patterns for implementing interactive exercises and feedback across all JavaScript Journey modules. Follow these guidelines to ensure consistent user experience.

## Table of Contents
1. [Code Execution Feedback](#code-execution-feedback)
2. [Exercise Validation Feedback](#exercise-validation-feedback)
3. [Multiple Choice Questions](#multiple-choice-questions)
4. [Visual Feedback Patterns](#visual-feedback-patterns)
5. [Error Handling](#error-handling)
6. [Implementation Templates](#implementation-templates)

## Code Execution Feedback

### Run Code Function Template
All lessons must include the `runCode` function for interactive code execution:

```javascript
function runCode(editorId) {
    const codeInput = document.getElementById(`${editorId}-code`);
    const outputPane = document.getElementById(`${editorId}-output`);
    
    if (!codeInput || !outputPane) return;
    
    const code = codeInput.value;
    
    // Clear the parent container to remove the "Output will appear here..." label
    const outputContainer = outputPane.parentElement;
    const outputLabel = outputContainer.querySelector('.output-label');
    if (outputLabel) {
        outputLabel.style.display = 'none';
    }
    
    outputPane.innerHTML = '';
    
    const originalConsoleLog = console.log;
    const originalConsoleClear = console.clear;
    const logs = [];
    
    console.log = (...args) => {
        logs.push(args.map(arg => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg, null, 2);
            }
            return String(arg);
        }).join(' '));
    };
    
    // Add console.clear handler if needed (Module 1 Lesson 4 example)
    console.clear = () => {
        logs.length = 0;
        outputPane.innerHTML = '<div class="output-line muted">Console was cleared</div>';
    };
    
    try {
        eval(code);
        
        if (logs.length > 0) {
            outputPane.innerHTML = logs.map(log => 
                `<div class="output-line">${escapeHtml(log)}</div>`
            ).join('');
        } else {
            outputPane.innerHTML = '<div class="output-line muted">No output</div>';
        }
    } catch (error) {
        outputPane.innerHTML = `<div class="output-error">Error: ${escapeHtml(error.message)}</div>`;
    } finally {
        console.log = originalConsoleLog;
        console.clear = originalConsoleClear;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```

### Output Styling Rules
- **Light theme**: Output text should use `var(--js-yellow)` for visibility on dark background
- **Dark theme**: Output text uses default color
- **Error messages**: Always displayed in red (`var(--error-color)`) in both themes
- **Output label removal**: The "Output will appear here..." label must be hidden when code is executed
- Apply styles through CSS, not inline styles
- For Module 3 style outputs, use `textContent` and set color via `outputPane.style.color`

## Exercise Validation Feedback

### Check Exercise Function Template
For code validation exercises:

```javascript
function checkExercise() {
    const code = document.getElementById('exercise-code').value;
    const output = document.getElementById('exercise-output');
    const feedback = document.getElementById('exercise-feedback');
    
    // Clear the parent container to remove the "Output will appear here..." label
    const outputContainer = output.parentElement;
    const outputLabel = outputContainer.querySelector('.output-label');
    if (outputLabel) {
        outputLabel.style.display = 'none';
    }
    
    // Run the code first to show output
    runCode('exercise');
    
    // Validation logic
    const isValid = /* your validation logic */;
    
    // Hide feedback first to create animation effect
    feedback.style.display = 'none';
    feedback.className = 'exercise-feedback'; // Reset to base class
    feedback.classList.remove('show', 'success', 'error');
    
    setTimeout(() => {
        feedback.style.display = 'block';
        if (isValid) {
            feedback.className = 'exercise-feedback show success';
            feedback.textContent = 'Excellent! Your solution is correct!';
        } else {
            feedback.className = 'exercise-feedback show error';
            feedback.textContent = 'Not quite. Check your solution and try again.';
        }
    }, 150);
}
```

### Feedback Animation
All feedback must include a disappear/reappear animation:
1. Hide the feedback element
2. Wait 150ms
3. Show the feedback with new state

This provides visual confirmation that the answer was re-evaluated.

## Multiple Choice Questions

### Check Answer Function Template
For quiz-style questions with multiple options:

```javascript
// Modern implementation using event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Handle all exercise option buttons
    document.querySelectorAll('.option-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Skip if button is already disabled
            if (this.disabled) return;
            
            const exerciseContainer = this.closest('.exercise-options');
            const feedbackDiv = this.closest('.exercise-content').querySelector('.exercise-feedback');
            const isCorrect = this.getAttribute('data-answer') === 'correct';
            
            // Remove previous incorrect selections (but not correct ones)
            exerciseContainer.querySelectorAll('.option-btn').forEach(btn => {
                if (btn.classList.contains('incorrect')) {
                    btn.classList.remove('incorrect', 'selected');
                    btn.disabled = false;
                }
            });
            
            // Hide feedback first to create animation effect
            if (feedbackDiv) {
                feedbackDiv.style.display = 'none';
                feedbackDiv.className = 'exercise-feedback'; // Reset to base class
                feedbackDiv.classList.remove('show', 'success', 'error');
            }
            
            // Mark this button
            this.classList.add('selected');
            this.classList.add(isCorrect ? 'correct' : 'incorrect');
            
            if (isCorrect) {
                // Correct answer - disable all buttons
                exerciseContainer.querySelectorAll('.option-btn').forEach(btn => {
                    btn.disabled = true;
                });
            } else {
                // Wrong answer - disable only this button
                this.disabled = true;
            }
            
            // Show feedback with animation
            if (feedbackDiv) {
                setTimeout(() => {
                    feedbackDiv.style.display = 'block';
                    feedbackDiv.className = 'exercise-feedback show ' + (isCorrect ? 'success' : 'error');
                    feedbackDiv.textContent = isCorrect ? 
                        'Correct! Well done!' : 
                        'Not quite. Try again!';
                }, 150);
            }
        });
    });
});
```

### Button Behavior Rules
1. **Wrong answer selected**: 
   - Only disable the clicked wrong answer
   - Keep other options enabled for retry
   - Show error feedback
   - Previous wrong selections become enabled again

2. **Correct answer selected**:
   - Disable all buttons
   - Show success feedback
   - Prevent any further selections

## Visual Feedback Patterns

### CSS Classes for Feedback
```css
/* Exercise Options Spacing */
.exercise-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem; /* Space between question text and first button */
}

/* Option Button Styles */
.option-btn {
    padding: 1rem;
    background-color: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-md);
    cursor: pointer;
    text-align: left;
    transition: var(--transition);
    color: var(--text-primary);
    width: 100%;
}

.option-btn:hover:not(:disabled):not(.correct):not(.incorrect) {
    border-color: var(--primary-color);
    background-color: var(--bg-tertiary);
}

.option-btn.correct {
    border-color: var(--success-color) !important;
    background-color: rgba(16, 185, 129, 0.25) !important;
    color: var(--success-color) !important;
    font-weight: 600;
}

.option-btn.incorrect {
    border-color: var(--danger-color) !important;
    background-color: rgba(239, 68, 68, 0.25) !important;
    color: var(--danger-color) !important;
    font-weight: 600;
}

.option-btn.correct:disabled,
.option-btn.incorrect:disabled {
    opacity: 1;
    cursor: not-allowed;
}

/* Feedback Styles */
.feedback, .exercise-feedback {
    padding: 1rem;
    border-radius: var(--radius-md);
    margin-top: 1rem;
    display: none;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.feedback.show, .exercise-feedback.show {
    display: block;
    opacity: 1;
}

.feedback.success, .exercise-feedback.success {
    background-color: rgba(16, 185, 129, 0.1);
    border: 1px solid var(--success-color);
    color: var(--success-color);
}

.feedback.error, .exercise-feedback.error {
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid var(--danger-color);
    color: var(--danger-color);
}

/* Dark Mode Specific Styles */
body.dark-theme .feedback,
body.dark-theme .exercise-feedback {
    background-color: var(--bg-secondary) !important;
    border-color: currentColor !important;
}

body.dark-theme .feedback.success,
body.dark-theme .exercise-feedback.success {
    background-color: rgba(16, 185, 129, 0.15) !important;
    color: var(--success-color) !important;
    border-color: var(--success-color) !important;
}

body.dark-theme .feedback.error,
body.dark-theme .exercise-feedback.error {
    background-color: rgba(239, 68, 68, 0.15) !important;
    color: var(--danger-color) !important;
    border-color: var(--danger-color) !important;
}

body.dark-theme .option-btn.correct {
    background-color: var(--success-color) !important;
    color: white !important;
    border-color: var(--success-color) !important;
}

body.dark-theme .option-btn.incorrect {
    background-color: var(--danger-color) !important;
    color: white !important;
    border-color: var(--danger-color) !important;
}
```

### Modal Usage
- Success modals should be **commented out** for exercise completion
- Only use inline feedback text
- Reserve modals for critical errors or navigation confirmations

## Error Handling

### Console Error Display
- Always show syntax errors in red
- Include the error type and message
- Format: `Error: [error message]`

### Validation Error Messages
Be specific about what's missing:
```javascript
if (!hasRequiredElements) {
    let missing = [];
    if (!hasElement1) missing.push('element1');
    if (!hasElement2) missing.push('element2');
    feedback.textContent = `Missing: ${missing.join(', ')}`;
}
```

## Implementation Templates

### Complete Interactive Editor HTML
```html
<div class="code-editor" id="editor1">
    <div class="editor-header">
        <div class="editor-tabs">
            <button class="editor-tab active">Exercise Title</button>
        </div>
        <div class="editor-actions">
            <button class="editor-btn copy-btn" onclick="copyCode('editor1')">
                <i class="fas fa-copy"></i> Copy
            </button>
            <button class="editor-btn run-btn" onclick="runCode('editor1')">
                <i class="fas fa-play"></i> Run Code
            </button>
        </div>
    </div>
    <div class="editor-content">
        <textarea class="code-input" id="editor1-code">// Your code here</textarea>
        <div class="code-output">
            <div class="output-label">Output will appear here...</div>
            <pre id="editor1-output"></pre>
        </div>
    </div>
</div>

<!-- Quiz Exercise HTML Structure -->
<section class="exercise-section">
    <div class="exercise-header">
        <h3><i class="fas fa-puzzle-piece"></i> Practice Exercise 1: Title</h3>
    </div>
    <div class="exercise-content">
        <p>Question text goes here</p>
        <div class="exercise-options" id="exercise1">
            <button class="option-btn" data-answer="wrong">Option 1</button>
            <button class="option-btn" data-answer="correct">Option 2</button>
            <button class="option-btn" data-answer="wrong">Option 3</button>
            <button class="option-btn" data-answer="wrong">Option 4</button>
        </div>
        <div class="exercise-feedback" id="exercise1-feedback"></div>
    </div>
</section>
```

### Copy Code Function
```javascript
function copyCode(editorId) {
    const codeInput = document.getElementById(`${editorId}-code`);
    if (!codeInput) return;
    
    codeInput.select();
    codeInput.setSelectionRange(0, 99999); // For mobile
    
    try {
        document.execCommand('copy');
        // Optional: Show copy confirmation
        const button = event.target.closest('.editor-btn');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}
```

## Multiple Exercise Validation

### Lesson Completion Rules
When a lesson has multiple exercises:
1. **Success messages should only appear when ALL exercises are completed correctly**
2. **Check for actual runtime errors, not just syntax patterns**
3. **Individual exercises show their own feedback**
4. **Overall lesson completion messages appear only after all exercises pass**

Example implementation for multiple exercise validation:
```javascript
function checkFinalExercise() {
    const code = document.getElementById('exercise-code').value;
    const feedback = document.getElementById('exercise-feedback');
    const outputPane = document.getElementById('exercise-output');
    
    runCode('exercise');
    
    // Check if the output contains any errors
    const outputHasError = outputPane.innerHTML.includes('output-error') || 
                          outputPane.innerHTML.includes('Error:');
    
    // Your validation logic
    const syntaxIsCorrect = /* validation checks */;
    
    if (syntaxIsCorrect && !outputHasError) {
        // Show success only if code runs without errors
        feedback.textContent = 'Perfect! All exercises completed!';
    } else {
        // Be specific about the issue
        if (outputHasError) {
            feedback.textContent = 'Your code still has errors. Check the output.';
        } else {
            feedback.textContent = 'Check your syntax and try again.';
        }
    }
}
```

## Summary of Key Rules

1. **Always include animation**: 150ms delay for feedback appearance with opacity transition
2. **Wrong answers are retryable**: Only disable the specific wrong answer
3. **Correct answers are final**: Disable all buttons when correct answer is selected
4. **Use CSS for styling**: Not inline styles
5. **Error text is always red**: In both light and dark themes
6. **Output text styling**: 
   - Light theme: Use `var(--js-yellow)` for visibility
   - Module 3: Use `textContent` with `style.color`
   - Module 4+: Use `innerHTML` with CSS classes
7. **No success modals**: Use inline feedback only (comment out modal calls)
8. **Be specific in error messages**: Tell users exactly what's wrong
9. **Multi-exercise validation**: Success messages only when ALL exercises pass
10. **Check runtime errors**: Validate both syntax AND successful execution
11. **Output label handling**: Always hide "Output will appear here..." when executing code
12. **Quiz spacing**: 1.5rem margin-top between question text and first button
13. **Feedback class naming**: Use `exercise-feedback` as base class, not just `feedback`
14. **Button colors**:
    - Light mode: 0.25 opacity with colored text and borders
    - Dark mode: Solid background colors with white text
15. **Hover states**: Only apply to buttons that are not disabled, correct, or incorrect

### Important CSS Considerations
- Avoid broad selectors in dark-mode-fixes.css that affect all themes
- Use `!important` sparingly and only for correct/incorrect states
- Ensure proper color contrast in both themes
- Test all interactive elements in both light and dark modes

Follow these patterns consistently across all modules to ensure a unified learning experience.