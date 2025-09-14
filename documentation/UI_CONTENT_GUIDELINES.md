# JavaScript Journey - UI & Content Guidelines

## Design System Overview

### Color Palette
```css
/* Core Colors */
--js-yellow: #F7DF1E      /* JavaScript's official yellow */
--js-black: #000000       /* Pure black */
--js-dark-gray: #323330   /* Dark gray for subtle elements */

/* Light Mode (Default) */
Background: #F7DF1E (Yellow)
Text: #000000 (Black)
Secondary BG: #e4ce0d (Darker yellow)
Borders: #000000 (Black)

/* Dark Mode */
Background: #000000 (Black)
Text: #F7DF1E (Yellow)
Secondary BG: #1a1a1a (Dark gray)
Borders: #F7DF1E (Yellow)
```

### Typography
- Primary Font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
- Code Font: 'Monaco', 'Courier New', monospace
- Font Sizes:
  - Hero Title: 3rem (2rem mobile)
  - Section Headers: 2rem
  - Subsection Headers: 1.5rem
  - Body Text: 1rem
  - Small Text: 0.875rem
  - Navbar Brand: 1.875rem (enhanced for better visibility)

### Component Standards

#### Buttons
1. **Primary Button**
   - Light: Black background, yellow text, black border
   - Dark: Yellow background, black text, yellow border
   - Hover: Colors invert

2. **Secondary Button**
   - Light: Darker yellow background, black text
   - Dark: Dark gray background, yellow text

3. **Warning Button**
   - Always: Yellow background, black text
   - Hover: Darker yellow background

4. **Danger Button**
   - Red background, white text (consistent in both themes)

#### Cards & Modules
- Border: 2px solid (black in light, yellow in dark)
- Border Radius: 0.75rem (--radius-lg)
- Shadow: Subtle shadow that increases on hover
- Padding: 2rem

#### Navigation
- Sticky navbar with JavaScript branding
- Black navbar in light mode, yellow in dark mode
- Text colors invert accordingly
- Enhanced navbar with larger font sizes for better visibility
- Brand text: 1.875rem (30px)
- Nav buttons: Increased padding and font size

#### Progress Indicators
- Light: Black fill on yellow background
- Dark: Yellow fill on black background
- Numbers in circles follow same inversion

#### Grid Layouts
- Smart grid system that handles orphaned items
- 3-column desktop, 2-column tablet, 1-column mobile
- Orphaned items center themselves aesthetically
- Progress modal: 4 columns on desktop, 2 on tablet, 1 on mobile
- Use fixed columns for consistent layouts: `grid-template-columns: repeat(4, 1fr)`

#### Modal System
- Custom modals replace browser alerts
- Theme-aware with proper color inversion
- Modal types: alert, success, error, warning, confirm
- Smooth animations (fadeIn, slideIn)
- Keyboard accessible (ESC to close)
- Primary buttons: Black/Yellow theme colors
- Secondary buttons: Subtle background colors

## Content Guidelines

### Lesson Structure
Each lesson MUST follow this structure:

1. **Header Section**
   ```html
   <div class="lesson-header">
       <h1>Lesson X: Lesson Title</h1>
       <p class="lesson-subtitle">Brief description</p>
   </div>
   ```
   - Always include lesson number in the h1 title
   - Format: "Lesson [number]: [title]"

2. **Introduction**
   - What the concept is
   - Why it's important
   - Real-world analogy

3. **Core Content**
   - 2-3 main sections
   - Each with interactive code editor
   - Visual demonstrations where applicable

4. **Practice Exercises**
   - Minimum 2-3 exercises per lesson
   - Mix of multiple choice and coding challenges
   - Immediate feedback

5. **Common Mistakes Section**
   - 2-3 common pitfalls
   - How to avoid them

6. **Summary**
   - Key takeaways
   - Link to next lesson

### Navigation Button Guidelines

1. **First Lesson of Module**
   - No "Previous Lesson" button (use empty div for spacing)
   - Has "Complete Lesson" button (center)
   - Has "Next Lesson" button
   - Exception: If coming from previous module, show "Previous Module" button

2. **Middle Lessons**
   - Has "Previous Lesson" button
   - Has "Complete Lesson" button (center)
   - Has "Next Lesson" button

3. **Last Lesson of Module**
   - Has "Previous Lesson" button
   - Has "Complete Module X" button (center)
   - Has "Start Module X+1" or "Next Module" button
   - No "Next Lesson" button

4. **Navigation Structure**
   ```html
   <div class="lesson-navigation">
       <button class="btn btn-secondary" onclick="window.location.href='lesson3.html'">
           <i class="fas fa-arrow-left"></i> Previous Lesson
       </button>
       
       <button class="btn btn-primary" onclick="completeLesson()">
           Complete Lesson <i class="fas fa-check"></i>
       </button>
       
       <button class="btn btn-secondary" onclick="window.location.href='lesson5.html'">
           Next Lesson <i class="fas fa-arrow-right"></i>
       </button>
   </div>
   ```

### Code Editor Standards
```html
<div class="code-editor" id="editorX">
    <div class="editor-header">
        <div class="editor-tabs">
            <button class="editor-tab active">Tab Name</button>
        </div>
        <div class="editor-actions">
            <button class="editor-btn" onclick="runCode('editorX')">
                <i class="fas fa-play"></i> Run Code
            </button>
        </div>
    </div>
    <div class="editor-content">
        <textarea class="code-input" id="editorX-code">
// Code here
        </textarea>
        <div class="code-output">
            <div class="output-label">Output will appear here...</div>
            <pre id="editorX-output"></pre>
        </div>
    </div>
</div>
```

#### Code Block Standards
- All code areas use dark background (#1e1e1e) in both themes
- Text color: #d4d4d4
- Border: 1px solid #333
- Output placeholder text: #888 with italic style
- Copy buttons follow theme colors (not white/gray)

#### Interactive Demo Building Standards (DOM Manipulation Lessons)
**IMPORTANT**: For Module 8 (DOM Manipulation) and similar interactive lessons:

1. **Build Outside Output Box**: 
   - Interactive demos that create visual elements should be built OUTSIDE the small output box
   - Output box should only show console logs and indicate "Building demo outside of this box..."
   - Demos appear as full-width components below the code editor

2. **Implementation Pattern**:
   ```javascript
   function runCode(editorId) {
       // For DOM manipulation lessons (Module 8, etc.)
       outputPane.innerHTML = '<div class="output-line muted">Building demo outside of this box...</div>';
       
       // Create demo container after the code editor
       const demoContainer = document.createElement('div');
       demoContainer.id = `${editorId}-demo`;
       demoContainer.style.cssText = 'margin: 2rem 0; padding: 1rem; background: var(--bg-secondary); border-radius: 0.5rem;';
       
       // Insert after code editor or exercise section
       const insertTarget = editorId.includes('exercise') 
           ? document.getElementById(editorId).closest('.exercise-section')
           : document.getElementById(editorId);
       insertTarget.insertAdjacentElement('afterend', demoContainer);
       
       // Override document.body.appendChild to redirect to demo container
       const originalAppendChild = document.body.appendChild;
       document.body.appendChild = function(element) {
           return demoContainer.appendChild(element);
       };
       
       // Execute code
       eval(code);
       
       // Restore original method
       document.body.appendChild = originalAppendChild;
   }
   ```

3. **Applies To**:
   - All Module 8 lessons (DOM Manipulation)
   - Any lesson creating interactive UI components
   - Exercises that build visual elements (theme switchers, todo lists, etc.)
   - Code examples with document.body.appendChild() calls

4. **Benefits**:
   - Better visibility of interactive components
   - Full-width display for complex demos
   - Prevents cramped UI in small output boxes
   - More realistic preview of DOM manipulation results

### Exercise Standards
```html
<div class="exercise-section">
    <div class="exercise-header">
        <i class="fas fa-puzzle-piece"></i>
        <h3>Exercise Title</h3>
    </div>
    <div class="exercise-content">
        <p>Exercise description</p>
        <div class="exercise-options">
            <!-- Options here -->
        </div>
    </div>
</div>
```

### Visual Elements
- Use Font Awesome icons consistently
- Icons should be black in light mode, yellow in dark mode
- Use semantic icons (fa-code for functions, fa-database for data, etc.)

### Writing Style
1. **Tone**: Friendly, encouraging, conversational
2. **Complexity**: Start simple, build gradually
3. **Examples**: Use everyday scenarios (shopping cart, todo list, etc.)
4. **Analogies**: Compare to real-world concepts
5. **Length**: Keep paragraphs short (3-4 sentences max)

### Spacing Guidelines
1. **Between Major Sections**: Add 2rem margin between content sections
2. **After Info Boxes**: Add spacing before next section
3. **Pro Tips**: Should have clear separation from following content
4. **Code Examples**: Proper margin above and below
5. **Use**: `<div style="margin: 2rem 0;"></div>` for manual spacing when needed

### Interactive Elements
1. **Immediate Feedback**: All exercises provide instant results
2. **Hints**: Available but not shown by default
3. **Success States**: Celebrate correct answers with custom success modals
4. **Error States**: Encouraging messages, guide to solution
5. **Modals**: Use customModal instead of browser alerts:
   - `customModal.alert(message, title)`
   - `customModal.success(message, title)`
   - `customModal.error(message, title)`
   - `customModal.confirm(message, title, onConfirm, onCancel)`

### Module Organization
1. **Module 1-3**: Foundation (variables, operators, control flow)
2. **Module 4-7**: Core Concepts (functions, arrays, objects)
3. **Module 8-9**: DOM & Events
4. **Module 10**: Real Projects

### Accessibility
- All interactive elements keyboard accessible
- Proper ARIA labels where needed
- Color contrast meets WCAG standards
- Focus indicators visible

### Footer Requirements
Every page must include:
```html
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
```

### Image Assets
Replace placeholders with actual logos:
- Chrome: Use official Chrome logo (images/chrome-logo.svg)
- Firefox: Use official Firefox logo (images/firefox-logo.svg)
- Edge: Use official Edge logo (images/edge-logo.png)
- VS Code: Use official VS Code logo (images/vscode-logo.png)
- Use SVG when possible for scalability
- PNG for logos that don't have SVG versions

### Consistency Checklist
Before adding any new component:
- [ ] Colors follow theme variables
- [ ] Text readable in both light/dark modes
- [ ] Hover states defined
- [ ] Mobile responsive
- [ ] Follows established patterns
- [ ] Icons are semantic
- [ ] Code examples are practical
- [ ] Uses custom modals instead of browser alerts
- [ ] Download buttons have proper text color
- [ ] Footer included with correct social links
- [ ] Code output areas have dark background (#1e1e1e) in both themes
- [ ] Copy buttons: black bg/yellow text (light), yellow bg/black text (dark)
- [ ] Lesson titles include lesson number
- [ ] Proper spacing between major sections (2rem gaps)
- [ ] Any element with colored background uses contrasting text (use var(--bg-primary) for text on var(--primary-color) background)

### Testing Requirements
- Test in both light and dark modes
- Test on mobile devices
- Test keyboard navigation
- Test with different browsers
- Verify all interactive elements work

This document should be referenced when creating any new content or UI elements to maintain consistency throughout the JavaScript Journey platform.