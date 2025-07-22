# Lesson Page UI Design Guidelines

## Overview
This document provides the standardized template and guidelines for creating consistent lesson pages across all modules in the JavaScript Journey platform.

## File Structure
Each lesson page should be located at: `/lessons/module[X]/lesson[Y].html`

## HTML Structure Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lesson [Y]: [Lesson Title] - JavaScript Journey</title>
    <link rel="stylesheet" href="../../styles/main.css">
    <link rel="stylesheet" href="../../styles/themes.css">
    <link rel="stylesheet" href="../../styles/lesson.css">
    <link rel="stylesheet" href="../../styles/dark-mode-fixes.css">
    <link rel="stylesheet" href="../../styles/code-highlighting.css">
    <link rel="stylesheet" href="../../styles/footer.css">
    <link rel="stylesheet" href="../../styles/header-enhanced.css">
    <link rel="stylesheet" href="../../styles/modal.css">
    <link rel="stylesheet" href="../../styles/style-guide.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <a href="../../index.html" style="text-decoration: none; color: inherit;">
                    <i class="fas fa-code"></i>
                    <span>JavaScript Journey</span>
                </a>
            </div>
            <div class="nav-menu">
                <button class="nav-btn" onclick="window.location.href='../../index.html'">
                    <i class="fas fa-home"></i>
                    <span>Home</span>
                </button>
                <button class="nav-btn" id="progressBtn">
                    <i class="fas fa-chart-line"></i>
                    <span>Progress</span>
                </button>
                <button class="nav-btn" id="resetBtn">
                    <i class="fas fa-redo"></i>
                    <span>Reset</span>
                </button>
                <button class="nav-btn" id="themeBtn">
                    <i class="fas fa-moon"></i>
                </button>
            </div>
        </div>
    </nav>

    <main class="lesson-container">
        <article class="lesson-content">
            <!-- Lesson Header -->
            <div class="lesson-header">
                <h1>Lesson [Y]: [Lesson Title]</h1>
                <p class="lesson-subtitle">[Brief, engaging subtitle that summarizes the lesson]</p>
            </div>

            <!-- Introduction Section -->
            <section class="content-section">
                <h2>Introduction</h2>
                <p>[Opening paragraph explaining what this lesson covers]</p>
                <p>[Real-world analogy or example to make the concept relatable]</p>
            </section>

            <!-- Core Content Sections -->
            <section class="content-section">
                <h2>[Main Topic 1]</h2>
                <p>[Explanation of the concept]</p>

                <!-- Info Box Example -->
                <div class="info-box">
                    <div>
                        <i class="fas fa-lightbulb"></i> <strong> Key Point:</strong>
                        <p>[Important information or tip]</p>
                    </div>
                </div>

                <!-- Code Editor -->
                <div class="code-editor" id="editor1">
                    <div class="editor-header">
                        <div class="editor-tabs">
                            <button class="editor-tab active">[Tab Name]</button>
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
                        <textarea class="code-input" id="editor1-code">
// Your code here
console.log("Hello, World!");</textarea>
                        <div class="code-output">
                            <div class="output-label">Output will appear here...</div>
                            <pre id="editor1-output"></pre>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Practice Exercises -->
            <section class="exercise-section">
                <div class="exercise-header">
                    <h3><i class="fas fa-puzzle-piece"></i> Practice Exercise 1: [Exercise Title]</h3>
                </div>
                <div class="exercise-content">
                    <p>[Exercise description]</p>
                    <div class="exercise-options" id="exercise1">
                        <button class="option-btn" data-answer="wrong">[Option 1]</button>
                        <button class="option-btn" data-answer="correct">[Correct Option]</button>
                        <button class="option-btn" data-answer="wrong">[Option 3]</button>
                        <button class="option-btn" data-answer="wrong">[Option 4]</button>
                    </div>
                    <div class="exercise-feedback" id="exercise1-feedback"></div>
                </div>
            </section>

            <!-- Common Mistakes Section -->
            <section class="content-section">
                <h2>Common Mistakes to Avoid</h2>
                <div class="mistake-box">
                    <div class="mistake-item">
                        <div>
                            <i class="fas fa-times-circle"></i> <strong> Mistake 1 Title</strong>
                            <p>[Explanation of the mistake and how to avoid it]</p>
                        </div>
                    </div>
                    <div class="mistake-item">
                        <div>
                            <i class="fas fa-times-circle"></i> <strong> Mistake 2 Title</strong>
                            <p>[Explanation of the mistake and how to avoid it]</p>
                        </div>
                    </div>
                    <div class="mistake-item">
                        <div>
                            <i class="fas fa-times-circle"></i> <strong> Mistake 3 Title</strong>
                            <p>[Explanation of the mistake and how to avoid it]</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Summary Section -->
            <section class="content-section">
                <h2>Summary</h2>
                <div class="summary-box">
                    <h3>Key Takeaways:</h3>
                    <ul>
                        <li>[Key point 1 from the lesson]</li>
                        <li>[Key point 2 from the lesson]</li>
                        <li>[Key point 3 from the lesson]</li>
                        <li>[Key point 4 from the lesson]</li>
                        <li>[Key point 5 from the lesson]</li>
                    </ul>
                </div>
            </section>

            <!-- Spacing before navigation -->
            <div style="margin: 2rem 0;"></div>
            
            <!-- Lesson Navigation -->
            <div class="lesson-navigation">
                <button class="btn btn-secondary" onclick="window.location.href='lesson[X-1].html'">
                    <i class="fas fa-arrow-left"></i> Previous Lesson
                </button>
                
                <button class="btn btn-primary" onclick="completeLesson()">
                    Complete Lesson <i class="fas fa-check"></i>
                </button>
                
                <button class="btn btn-secondary" onclick="window.location.href='lesson[X+1].html'">
                    Next Lesson <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </article>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
        <div class="footer-content">
            <p>Made by TayMcQuaya with <span class="heart">❤️</span></p>
            <div class="social-links">
                <a href="https://github.com/TayMcQuaya" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <i class="fab fa-github"></i>
                </a>
                <a href="https://x.com/TayMcQuaya" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                    <i class="fab fa-twitter"></i>
                </a>
            </div>
            <div class="copyright">
                <p>&copy; 2025 JavaScript Journey&trade; - All rights reserved</p>
            </div>
        </div>
    </footer>

    <!-- Reset Modal -->
    <div class="modal" id="resetModal">
        <div class="modal-content">
            <h3>Reset Progress</h3>
            <p>Choose what you want to reset:</p>
            <div class="modal-buttons">
                <button class="btn btn-danger" id="resetAllBtn">Reset All Progress</button>
                <button class="btn btn-warning" id="resetModuleBtn">Reset Current Module</button>
                <button class="btn btn-secondary" id="cancelResetBtn">Cancel</button>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="../../js/app.js"></script>
    <script src="../../js/storage.js"></script>
    <script src="../../js/navigation.js"></script>
    <script src="../../js/progress.js"></script>
    <script src="../../js/exercises.js"></script>
    <script src="../../js/modal.js"></script>
    <script>
        // Complete lesson function
        function completeLesson() {
            Storage.saveProgress([MODULE_NUMBER], [LESSON_NUMBER], true);
            customModal.success('Lesson completed! [Success message]', 'Congratulations!');
            
            setTimeout(() => {
                window.location.href = '[next-lesson].html';
            }, 2000);
        }
    </script>
</body>
</html>
```

## Key UI Components

### 1. Lesson Header
```html
<div class="lesson-header">
    <h1>Lesson [Number]: [Title]</h1>
    <p class="lesson-subtitle">[Engaging subtitle]</p>
</div>
```
- **Always** include lesson number in h1
- Subtitle should be engaging and summarize the lesson

### 2. Content Sections
Each major topic should be in a content-section:
```html
<section class="content-section">
    <h2>[Section Title]</h2>
    <p>[Content paragraphs]</p>
</section>
```

### 3. Info/Concept Boxes
For highlighting important information:
```html
<div class="info-box">
    <div>
        <i class="fas fa-lightbulb"></i> <strong> Title:</strong>
        <p>Content here</p>
    </div>
</div>
```

### 4. Warning Boxes
For important warnings:
```html
<div class="warning-box">
    <div>
        <i class="fas fa-exclamation-triangle"></i> <strong> Warning:</strong>
        <p>Warning content</p>
    </div>
</div>
```

### 5. Code Editors
Interactive code editors with consistent structure:
```html
<div class="code-editor" id="editorX">
    <div class="editor-header">
        <div class="editor-tabs">
            <button class="editor-tab active">Tab Name</button>
        </div>
        <div class="editor-actions">
            <button class="editor-btn copy-btn" onclick="copyCode('editorX')">
                <i class="fas fa-copy"></i> Copy
            </button>
            <button class="editor-btn run-btn" onclick="runCode('editorX')">
                <i class="fas fa-play"></i> Run Code
            </button>
        </div>
    </div>
    <div class="editor-content">
        <textarea class="code-input" id="editorX-code">// Code here</textarea>
        <div class="code-output">
            <div class="output-label">Output will appear here...</div>
            <pre id="editorX-output"></pre>
        </div>
    </div>
</div>
```

### 6. Exercise Sections
```html
<section class="exercise-section">
    <div class="exercise-header">
        <h3><i class="fas fa-puzzle-piece"></i> Practice Exercise [Number]: [Title]</h3>
    </div>
    <div class="exercise-content">
        <p>[Exercise description]</p>
        <div class="exercise-options" id="exerciseX">
            <button class="option-btn" data-answer="[correct/wrong]">[Option]</button>
        </div>
        <div class="exercise-feedback" id="exerciseX-feedback"></div>
    </div>
</section>
```

### 7. Common Mistakes Section
```html
<section class="content-section">
    <h2>Common Mistakes to Avoid</h2>
    <div class="mistake-box">
        <div class="mistake-item">
            <div>
                <i class="fas fa-times-circle"></i> <strong>[Mistake Title]</strong>
                <p>[Explanation]</p>
            </div>
        </div>
    </div>
</section>
```

### 8. Summary Section
```html
<section class="content-section">
    <h2>Summary</h2>
    <div class="summary-box">
        <h3>Key Takeaways:</h3>
        <ul>
            <li>[Point 1]</li>
            <li>[Point 2]</li>
            <li>[Point 3]</li>
        </ul>
    </div>
</section>
```

### 9. Navigation Buttons
Navigation varies based on lesson position:

**First Lesson of Module:**
```html
<div class="lesson-navigation">
    <button class="btn btn-secondary" onclick="window.location.href='../module[X-1]/lesson[last].html'">
        <i class="fas fa-arrow-left"></i> Previous Module
    </button>
    
    <button class="btn btn-primary" onclick="completeLesson()">
        Complete Lesson <i class="fas fa-check"></i>
    </button>
    
    <button class="btn btn-secondary" onclick="window.location.href='lesson2.html'">
        Next Lesson <i class="fas fa-arrow-right"></i>
    </button>
</div>
```

**Last Lesson of Module:**
```html
<div class="lesson-navigation">
    <button class="btn btn-secondary" onclick="window.location.href='lesson[X-1].html'">
        <i class="fas fa-arrow-left"></i> Previous Lesson
    </button>
    
    <button class="btn btn-primary" onclick="completeLesson()">
        Complete Module [X] <i class="fas fa-check"></i>
    </button>
    
    <button class="btn btn-secondary" onclick="window.location.href='../module[X+1]/index.html'">
        Start Module [X+1] <i class="fas fa-arrow-right"></i>
    </button>
</div>
```

## Icon Usage Guidelines

### IMPORTANT: Icon Placement Rules
When using Font Awesome icons inline with text, follow this EXACT pattern:
```html
<i class="fas fa-[icon-name]"></i> <strong> Text Here</strong>
```
- Place icon FIRST
- Add ONE SPACE after the closing `</i>` tag
- Add ONE SPACE at the beginning inside the `<strong>` tag before the text
- Usually wrap text in `<strong>` tags

### Icon Placement in Different Contexts:
1. **In content boxes (info-box, warning-box, etc.):**
   ```html
   <div class="info-box">
       <div>
           <i class="fas fa-lightbulb"></i> <strong> Key Point:</strong>
           <p>Content here</p>
       </div>
   </div>
   ```

2. **In exercise headers:**
   ```html
   <div class="exercise-header">
       <h3><i class="fas fa-puzzle-piece"></i> Practice Exercise 1: Title</h3>
   </div>
   ```

3. **In real-world examples:**
   ```html
   <div class="real-world-example">
       <h3><i class="fas fa-store"></i> Example: Shopping Cart</h3>
       <p>Description</p>
   </div>
   ```

### Common Icons and Their Uses:
- `fa-lightbulb` - Tips and key points
- `fa-exclamation-triangle` - Warnings
- `fa-times-circle` - Mistakes/errors
- `fa-check-circle` - Correct examples
- `fa-puzzle-piece` - Exercises
- `fa-code` - Code examples
- `fa-info-circle` - Information
- `fa-star` - Important concepts

## Content Guidelines

### 1. Introduction Section
- Start with a relatable explanation
- Use real-world analogies
- Keep it engaging and conversational

### 2. Code Examples
- Start simple, build complexity
- Always include comments
- Show output/results
- Use meaningful variable names

### 3. Exercises
- Mix multiple choice and coding challenges
- Provide immediate feedback
- Include 2-3 exercises minimum per lesson

### 4. Common Mistakes
- Always include 2-3 common pitfalls
- Show both wrong and right approaches
- Explain why something is wrong

### 5. Summary
- 4-6 key takeaways
- Concise bullet points
- Focus on practical knowledge

## Required Elements Checklist

### Must Have:
- [ ] Lesson header with number and subtitle
- [ ] Introduction section
- [ ] At least 2 code editors with examples
- [ ] At least 2 practice exercises
- [ ] Common mistakes section
- [ ] Summary with key takeaways
- [ ] Proper navigation buttons
- [ ] 2rem spacing before navigation
- [ ] Complete lesson function

### Must NOT Have:
- [ ] NO breadcrumb navigation
- [ ] NO custom colors outside CSS variables
- [ ] NO inline styles (except margin spacer)
- [ ] NO missing icon spaces

## Spacing Guidelines

### IMPORTANT: Spacing Rules
1. **Headings in sections**: All h1, h2, h3 elements that are first children of sections have `margin-top: 1.5rem`
   ```html
   <section class="content-section">
       <h2>Title Here</h2>  <!-- This h2 will have 1.5rem margin-top -->
       <p>Content...</p>
   </section>
   ```

2. **Strong elements**: All `<strong>` elements in content boxes have `margin-top: 0.25rem` for subtle spacing

3. **Navigation spacing**: Always add spacing before navigation:
   ```html
   <div style="margin: 2rem 0;"></div>
   <div class="lesson-navigation">
   ```

## CSS Classes Reference

### Box Types:
- `info-box` - General information
- `warning-box` - Warnings and cautions
- `concept-card` - Concept explanations
- `real-world-example` - Real-world scenarios
- `pro-tip` - Professional tips
- `mistake-box` - Common mistakes container
- `summary-box` - Lesson summary

### Exercise Elements:
- `exercise-section` - Exercise container
- `exercise-header` - Exercise title area
- `exercise-content` - Exercise body
- `exercise-options` - Multiple choice container
- `option-btn` - Choice buttons
- `exercise-feedback` - Feedback display area

## JavaScript Functions

### Required Functions:
```javascript
// Complete lesson and update progress
function completeLesson() {
    Storage.saveProgress(MODULE_NUMBER, LESSON_NUMBER, true);
    customModal.success('Lesson completed! [Custom message]', 'Congratulations!');
    
    setTimeout(() => {
        window.location.href = 'next-destination.html';
    }, 2000);
}

// Copy code function (if not in exercises.js)
function copyCode(editorId) {
    // Implementation
}

// Run code function (if not in exercises.js)
function runCode(editorId) {
    // Implementation
}
```

## Special Cases

### Module Transitions
When transitioning between modules:
- Last lesson of module: Button says "Complete Module X"
- Navigation goes to next module's index page
- First lesson references previous module's last lesson

### Final Module (10)
- Last lesson has special completion message
- May include confetti animation
- Navigation returns to home or shows certificate

## Quality Checklist
Before finalizing a lesson:
- [ ] All sections follow the template structure
- [ ] Icons have proper spacing after them
- [ ] Code examples are tested and working
- [ ] Exercises provide meaningful practice
- [ ] Navigation buttons point to correct files
- [ ] Progress tracking is implemented
- [ ] Mobile responsive (test at 768px)
- [ ] Dark mode compatibility verified
- [ ] No console errors
- [ ] All external links work