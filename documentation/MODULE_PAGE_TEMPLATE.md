# Module Page UI Design Guidelines

## Overview
This document provides the exact template and guidelines for creating consistent module overview pages across the JavaScript Journey platform. All modules (1-10) should follow this exact structure.

## File Structure
Each module page should be located at: `/lessons/module[X]/index.html`

## HTML Structure Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Module [X]: [Module Title] - JavaScript Journey</title>
    <link rel="stylesheet" href="../../styles/main.css">
    <link rel="stylesheet" href="../../styles/themes.css">
    <link rel="stylesheet" href="../../styles/dark-mode-fixes.css">
    <link rel="stylesheet" href="../../styles/code-highlighting.css">
    <link rel="stylesheet" href="../../styles/footer.css">
    <link rel="stylesheet" href="../../styles/header-enhanced.css">
    <link rel="stylesheet" href="../../styles/modal.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
</head>
<body>
    <!-- Navigation Bar (Identical for all pages) -->
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

    <main class="container">
        <div class="module-overview">
            <!-- Module Title and Description -->
            <h1>Module [X]: [Module Title]</h1>
            <p class="module-description">
                [2-3 sentences describing what this module covers and why it's important]
            </p>

            <!-- Learning Objectives Section -->
            <div class="module-objectives">
                <h2><i class="fas fa-bullseye"></i> Learning Objectives</h2>
                <ul>
                    <li>[Objective 1 - What students will learn]</li>
                    <li>[Objective 2 - Key skill or concept]</li>
                    <li>[Objective 3 - Practical application]</li>
                    <li>[Objective 4 - Important technique]</li>
                    <li>[Objective 5 - Best practices]</li>
                    <li>[Objective 6 - Real-world usage]</li>
                </ul>
            </div>

            <!-- Lessons Section -->
            <div class="module-lessons">
                <h2><i class="fas fa-list"></i> Lessons</h2>
                <div class="lessons-grid">
                    <!-- Repeat this structure for each lesson -->
                    <div class="lesson-card" onclick="window.location.href='lesson1.html'">
                        <div class="lesson-number">1</div>
                        <div class="lesson-content">
                            <h3>[Lesson Topic]</h3>
                            <p>[Brief description of what this lesson covers]</p>
                            <div class="lesson-meta">
                                <span><i class="fas fa-clock"></i> [X] min</span>
                                <span><i class="fas fa-signal"></i> [Difficulty]</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Additional Resources Section -->
            <div class="module-resources">
                <h2><i class="fas fa-book"></i> Additional Resources</h2>
                <ul>
                    <li><a href="[URL]" target="_blank" class="resource-link">[Resource Title]</a></li>
                    <li><a href="[URL]" target="_blank" class="resource-link">[Resource Title]</a></li>
                    <li><a href="[URL]" target="_blank" class="resource-link">[Resource Title]</a></li>
                </ul>
            </div>
        </div>
    </main>

    <!-- Embedded Styles (Must be included) -->
    <style>
        .module-overview {
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem 0;
        }

        .module-overview h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: var(--primary-color);
        }

        .module-description {
            font-size: 1.125rem;
            color: var(--text-secondary);
            line-height: 1.8;
            margin-bottom: 3rem;
        }

        .module-objectives, .module-lessons, .module-resources {
            background-color: var(--bg-primary);
            padding: 2rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            margin-bottom: 2rem;
        }

        .module-objectives h2, .module-lessons h2, .module-resources h2 {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
            color: var(--text-primary);
        }

        .module-objectives ul {
            list-style: none;
            padding: 0;
        }

        .module-objectives li {
            padding: 0.75rem 0;
            padding-left: 2rem;
            position: relative;
            color: var(--text-secondary);
        }

        .module-objectives li::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: var(--success-color);
            font-weight: bold;
        }

        .lessons-grid {
            display: grid;
            gap: 1.5rem;
        }

        .lesson-card {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            padding: 1.5rem;
            background-color: var(--bg-secondary);
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: var(--transition);
        }

        .lesson-card:hover {
            background-color: var(--bg-tertiary);
            transform: translateX(4px);
        }

        .lesson-number {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            background-color: var(--primary-color);
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .lesson-content {
            flex: 1;
        }

        .lesson-content h3 {
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }

        .lesson-content p {
            color: var(--text-secondary);
            margin-bottom: 1rem;
        }

        .lesson-meta {
            display: flex;
            gap: 1.5rem;
            font-size: 0.875rem;
            color: var(--text-secondary);
        }

        .lesson-meta span {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .resource-link {
            color: var(--primary-color);
            text-decoration: none;
            transition: var(--transition);
        }

        .resource-link:hover {
            text-decoration: underline;
        }

        .module-resources ul {
            list-style: none;
            padding: 0;
        }

        .module-resources li {
            padding: 0.5rem 0;
        }
    </style>

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

    <!-- Scripts (Order matters) -->
    <script src="../../js/app.js"></script>
    <script src="../../js/storage.js"></script>
    <script src="../../js/progress.js"></script>
    <script src="../../js/modal.js"></script>

    <!-- Footer (Must be last in body) -->
    <footer class="site-footer">
        <div class="footer-content">
            <p>Made by TayMcQuaya with <span class="heart">❤️</span></p>
            <div class="social-links">
                <a href="https://github.com/TayMcQuaya" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <i class="fab fa-github"></i>
                </a>
                <a href="https://x.com/TayMcQuaya" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                    <i class="fa-brands fa-x-twitter"></i>
                </a>
            </div>
            <div class="copyright">
                <p>&copy; 2025 JavaScript Journey&trade; - All rights reserved</p>
            </div>
        </div>
    </footer>
</body>
</html>
```

## Key Design Elements

### 1. Module Title Section
- **h1 format**: `Module [Number]: [Title]`
- **Description**: 2-3 sentences explaining the module's purpose
- Font size: 2.5rem
- Color: var(--primary-color)

### 2. Learning Objectives Section
- **Icon**: fa-bullseye
- **Format**: Unordered list with checkmark (✓) bullets
- **Content**: 5-6 specific learning outcomes
- Each item should start with an action verb (Master, Learn, Understand, etc.)

### 3. Lessons Section
- **Icon**: fa-list
- **Lesson Cards Structure**:
  - Numbered circle (1, 2, 3, etc.) - NOT "Lesson 1:"
  - Lesson title WITHOUT "Lesson X:" prefix
  - Brief description (1 sentence)
  - Duration and difficulty level

### 4. Lesson Card Details
```html
<div class="lesson-card" onclick="window.location.href='lesson[X].html'">
    <div class="lesson-number">[X]</div>
    <div class="lesson-content">
        <h3>[Topic Name Only]</h3>
        <p>[One sentence description]</p>
        <div class="lesson-meta">
            <span><i class="fas fa-clock"></i> [Duration] min</span>
            <span><i class="fas fa-signal"></i> [Difficulty]</span>
        </div>
    </div>
</div>
```

### 5. Difficulty Levels
- **Beginner**: For introductory concepts
- **Intermediate**: For concepts building on basics
- **Advanced**: For complex topics

### 6. Additional Resources
- Always include 3 relevant external links
- Use reputable sources (MDN, W3Schools, official docs)
- All links should open in new tab (`target="_blank"`)

## CSS Requirements
- **MUST** include the embedded `<style>` section
- **MUST** use CSS variables from themes.css
- **MUST** maintain consistent spacing and shadows

## Important Notes

### DO:
- ✅ Keep lesson titles concise (2-4 words)
- ✅ Use consistent icons throughout
- ✅ Include all stylesheets in the same order
- ✅ Place footer as the last element before closing body tag
- ✅ Use semantic HTML structure
- ✅ Include all 4 main scripts in order

### DON'T:
- ❌ Add "Lesson X:" prefix to lesson card titles
- ❌ Use custom colors outside of CSS variables
- ❌ Skip the embedded styles section
- ❌ Change the navigation structure
- ❌ Add breadcrumb navigation
- ❌ Modify the grid layout structure

## Module-Specific Icons (Optional)
You may customize the module title with a relevant icon:
- Module 1: fa-play-circle (Introduction)
- Module 2: fa-database (Variables)
- Module 3: fa-calculator (Operators)
- Module 4: fa-code-branch (Control Flow)
- Module 5: fa-code (Functions)
- Module 6: fa-list (Arrays)
- Module 7: fa-cube (Objects)
- Module 8: fa-file-code (DOM)
- Module 9: fa-mouse-pointer (Events)
- Module 10: fa-rocket (Projects)

## Example Resources by Module Type

### Programming Concept Modules (1-7):
- MDN documentation for the specific topic
- W3Schools tutorial
- JavaScript.info relevant chapter

### DOM/Browser Modules (8-9):
- MDN Web APIs documentation
- Browser compatibility resources
- Interactive demos or playgrounds

### Project Module (10):
- GitHub repositories with examples
- CodePen collections
- Tutorial videos or articles

## Validation Checklist
Before finalizing a module page:
- [ ] All lessons have onclick handlers pointing to correct files
- [ ] Difficulty levels are appropriate and progressive
- [ ] Time estimates are realistic
- [ ] Learning objectives use action verbs
- [ ] Resources links are working and relevant
- [ ] Page follows exact HTML structure
- [ ] Embedded styles are included
- [ ] Footer is properly placed
- [ ] All scripts are loaded in correct order