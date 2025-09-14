# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JavaScript Journey is an interactive JavaScript learning platform designed for complete beginners. It features a structured curriculum with 10 modules, interactive code editors, progress tracking, and a custom theme based on JavaScript's official colors (yellow #F7DF1E and black).

## Development Commands

This is a static HTML/CSS/JavaScript project with no build process or package manager. To develop:

1. **Run locally**: Open `index.html` in a web browser or use a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (if http-server is installed globally)
   http-server -p 8000
   ```

2. **Test changes**: Refresh the browser (F5 or Ctrl+R)

3. **Check console**: Open browser DevTools (F12) to see console logs and errors

## Architecture & Key Systems

### 1. Progress Tracking System
- **Storage**: Uses localStorage with keys prefixed `jsJourney_`
- **Time Tracking**: Automatically tracks time spent per lesson in 60-second intervals
- **Progress Calculation**: Based on completed lessons per module
- **Key Files**: 
  - `js/storage.js` - LocalStorage wrapper with progress methods
  - `js/progress.js` - Progress visualization and export functionality
  - `js/app.js` - Session management and module detection

### 2. Navigation System
- **Module Detection**: Automatically detects current module/lesson from URL path
- **Smart Navigation**: First lessons don't show "Previous", last lessons show "Next Module"
- **Completion Flow**: `completeLesson()` → updates progress → navigates to next
- **Key Files**:
  - `js/navigation.js` - Lesson navigation logic
  - Each lesson has `.lesson-navigation` section at bottom

### 3. Interactive Code Editors
- **Structure**: Each editor has unique ID (editor1, editor2, etc.)
- **Execution**: `runCode()` function captures textarea content and evaluates
- **Output**: Results displayed in `.code-output` div with dark theme
- **Key Files**:
  - `js/exercises.js` - Code execution and validation
  - Inline scripts in each lesson for specific functionality

### 4. Theme System
- **Light Mode**: Yellow (#F7DF1E) background, black text
- **Dark Mode**: Black background, yellow text
- **Code Blocks**: Always dark (#1e1e1e) background in both themes
- **Key Files**:
  - `styles/themes.css` - Theme variables and dark mode
  - `styles/dark-mode-fixes.css` - Specific dark mode overrides
  - `styles/code-highlighting.css` - Consistent code block styling

### 5. Custom Modal System
- **Types**: alert, confirm, success, error, warning, info
- **Features**: Theme-aware, keyboard support (ESC), custom buttons
- **Progress Modal**: Special 4-column layout showing detailed stats
- **Key Files**:
  - `js/modal.js` - Modal class and methods
  - `styles/modal.css` - Modal styling
  - Used via global `customModal` object

## Module Development Workflow

When creating a new module/lesson:

1. **Create Module Structure**:
   ```
   lessons/moduleX/
   ├── index.html (module overview)
   ├── lesson1.html
   ├── lesson2.html
   └── ...
   ```

2. **Use Existing Templates**: Copy structure from completed modules (1 or 2)

3. **Required Elements**:
   - Lesson header with number: `<h1>Lesson X: Title</h1>`
   - Navigation buttons (follow guidelines in UI_CONTENT_GUIDELINES.md)
   - Include all CSS files in order (see existing lessons)
   - Include JS files: app.js, storage.js, progress.js, modal.js

4. **Code Editors**: Use unique IDs and follow pattern:
   ```html
   <div class="code-editor" id="editorX">
       <!-- editor structure -->
   </div>
   ```

## Current Status & Next Steps

- **Completed**: Modules 1-4 (16 lessons total)
- **Next Task**: Create Module 5 - Functions
- **Design System**: Fully established with yellow/black theme
- **UI Components**: All standardized and documented
- **Coming Soon Notice**: 
  - **Home Page**: Modules 5-10 currently show a "coming soon" notification when clicked from the home page
  - **Last Lesson Navigation**: The last lesson of the most recently implemented module (currently Module 4) uses `app.startNextModule()` to show the same "coming soon" modal instead of directly navigating
  - **To update when implementing new modules**:
    1. Edit the `startModule()` and `startNextModule()` functions in `js/app.js` to update the condition (currently `moduleId >= 5 && moduleId <= 10`)
    2. Update the last lesson of the newly implemented module to use `app.startNextModule(currentModuleNumber)` instead of direct navigation
    3. Remove the `app.startNextModule()` call from the previous module's last lesson and restore normal navigation with `window.location.href='../moduleX/index.html'`

## Key Documentation Files

- `LESSON_PLAN.md` - Module progress tracker and technical notes
- `UI_CONTENT_GUIDELINES.md` - Complete UI/UX standards and component guidelines
- `COMPREHENSIVE_LESSON_PLAN.md` - Detailed curriculum for all 10 modules
- `MODULE_PAGE_TEMPLATE.md` - Complete template and guidelines for creating module index pages
- `LESSON_PAGE_TEMPLATE.md` - Complete template and guidelines for creating lesson pages with proper icon placement and spacing rules
- `EXERCISE_FEEDBACK_GUIDELINES.md` - Comprehensive guidelines for implementing interactive exercises with consistent feedback patterns

## Important Patterns

1. **LocalStorage Keys**:
   - `jsJourney_progress` - Overall and module progress
   - `jsJourney_theme` - User's theme preference
   - `jsJourney_timeSpent` - Time tracking data
   - `jsJourney_exerciseScores` - Exercise results

2. **Module Progress States**:
   - Not started: 0% progress
   - In progress: 1-99% progress
   - Completed: 100% progress + `completed` flag

3. **CSS Variable Usage**:
   - Always use `var(--js-yellow)` and `var(--js-black)`
   - For text on colored backgrounds: `var(--bg-primary)`
   - Code areas: Hard-coded `#1e1e1e` for consistency

4. **External Dependencies**:
   - Font Awesome: Version 6.5.2 (updated from 6.4.0 for X/Twitter icon support)
   - X/Twitter icon: Use `fa-brands fa-x-twitter` (not `fab fa-twitter` or `fab fa-x`)
   - CDN Link: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css`

5. **Navigation Patterns**:
   - Previous Module: Only on first lesson of module 2+
   - Next Module: Only on last lesson of each module
   - Complete Module: Replace "Complete Lesson" on last lesson

5. **Interactive Code Editors**:
   - Every lesson with code editors MUST include `runCode` and `copyCode` functions in the script section
   - These functions should be defined before any other custom functions (like completeLesson)
   - Standard implementation:
     ```javascript
     // Run code function
     function runCode(editorId) {
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
             eval(code);
             
             if (logs.length > 0) {
                 outputPane.textContent = logs.join('\n');
             } else {
                 outputPane.textContent = 'No output';
            }
         } catch (error) {
             outputPane.textContent = 'Error: ' + error.message;
        } finally {
             console.log = originalConsoleLog;
         }
     }

     // Copy code function
     function copyCode(editorId) {
         const codeInput = document.getElementById(`${editorId}-code`);
         if (!codeInput) return;
         
         codeInput.select();
         codeInput.setSelectionRange(0, 99999); // For mobile devices
         
         try {
             document.execCommand('copy');
             customModal.success('Code copied to clipboard!', 'Copied');
         } catch (err) {
             customModal.error('Failed to copy code', 'Error');
         }
     }
     ```