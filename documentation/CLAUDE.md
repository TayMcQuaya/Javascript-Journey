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

- **Completed**: Modules 1-2 (9 lessons total)
- **Next Task**: Create Module 3 - Operators & Expressions
- **Design System**: Fully established with yellow/black theme
- **UI Components**: All standardized and documented
- **Coming Soon Notice**: Modules 3-10 currently show a "coming soon" notification when clicked. To remove this once modules are implemented, edit the `startModule()` function in `js/app.js` and remove/modify the condition that checks for `moduleId >= 3 && moduleId <= 10`

## Key Documentation Files

- `LESSON_PLAN.md` - Module progress tracker and technical notes
- `UI_CONTENT_GUIDELINES.md` - Complete UI/UX standards and component guidelines
- `COMPREHENSIVE_LESSON_PLAN.md` - Detailed curriculum for all 10 modules

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

4. **Navigation Patterns**:
   - Previous Module: Only on first lesson of module 2+
   - Next Module: Only on last lesson of each module
   - Complete Module: Replace "Complete Lesson" on last lesson