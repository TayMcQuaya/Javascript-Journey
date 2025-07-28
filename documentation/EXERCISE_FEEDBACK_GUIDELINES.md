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
- Apply styles through CSS, not inline styles

## Exercise Validation Feedback

### Check Exercise Function Template
For code validation exercises:

```javascript
function checkExercise() {
    const code = document.getElementById('exercise-code').value;
    const feedback = document.getElementById('exercise-feedback');
    
    // Run the code first to show output
    runCode('exercise');
    
    // Validation logic
    const isValid = /* your validation logic */;
    
    // Hide feedback first to create animation effect
    feedback.style.display = 'none';
    feedback.className = 'feedback';
    
    setTimeout(() => {
        feedback.style.display = 'block';
        if (isValid) {
            feedback.className = 'feedback show success';
            feedback.textContent = 'Excellent! Your solution is correct!';
        } else {
            feedback.className = 'feedback show error';
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
function checkAnswer(button, isCorrect) {
    const options = button.parentElement.querySelectorAll('.option-btn');
    const feedback = button.closest('.quiz-question').querySelector('.feedback');
    
    // Remove previous incorrect selections
    options.forEach(opt => {
        if (opt.classList.contains('incorrect')) {
            opt.classList.remove('incorrect');
            opt.disabled = false;
        }
    });
    
    // Hide feedback first to create animation effect
    feedback.classList.remove('show');
    feedback.style.display = 'none';
    
    setTimeout(() => {
        if (isCorrect) {
            // Correct answer - disable all buttons
            options.forEach(opt => {
                opt.disabled = true;
            });
            button.classList.add('correct');
            feedback.className = 'feedback show success';
            feedback.textContent = 'Correct! Well done!';
        } else {
            // Wrong answer - mark as incorrect but keep buttons enabled
            button.classList.add('incorrect');
            button.disabled = true; // Disable only this wrong answer
            feedback.className = 'feedback show error';
            feedback.textContent = 'Not quite. Try again!';
        }
        feedback.style.display = 'block';
    }, 150);
}
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
.feedback {
    padding: 1rem;
    border-radius: var(--radius-md);
    margin-top: 1rem;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.feedback.show {
    opacity: 1;
}

.feedback.success {
    background-color: rgba(13, 124, 13, 0.1);
    border: 1px solid var(--success-color);
    color: var(--success-color);
}

.feedback.error {
    background-color: rgba(220, 38, 38, 0.1);
    border: 1px solid var(--danger-color);
    color: var(--danger-color);
}

.option-btn.correct {
    border-color: var(--success-color);
    background-color: rgba(13, 124, 13, 0.1);
}

.option-btn.incorrect {
    border-color: var(--danger-color);
    background-color: rgba(220, 38, 38, 0.1);
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
            <button class="editor-btn" onclick="runCode('editor1')">
                <i class="fas fa-play"></i> Run Code
            </button>
            <button class="editor-btn" onclick="copyCode('editor1')">
                <i class="fas fa-copy"></i> Copy
            </button>
        </div>
    </div>
    <div class="editor-content">
        <textarea class="code-input" id="editor1-code">// Your code here</textarea>
        <div class="code-output" id="editor1-output">
            <div class="output-label">Output will appear here...</div>
        </div>
    </div>
</div>
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

## Summary of Key Rules

1. **Always include animation**: 150ms delay for feedback appearance
2. **Wrong answers are retryable**: Only disable the specific wrong answer
3. **Correct answers are final**: Disable all options
4. **Use CSS for styling**: Not inline styles
5. **Error text is always red**: In both light and dark themes
6. **Output text is yellow in light theme**: For visibility on dark background
7. **No success modals**: Use inline feedback only
8. **Be specific in error messages**: Tell users exactly what's wrong

Follow these patterns consistently across all modules to ensure a unified learning experience.