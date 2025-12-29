# Accessibility Manual Testing Script

Use this script to verify WCAG 2.1 AA compliance manually.

## 1. Keyboard Navigation Speed Run
- [ ] **Load Page**: Refresh the page.
- [ ] **Focus Start**: Press `Tab`. Focus should appear on the first interactive element (References or Settings).
- [ ] **Visibility**: Verify the focus ring (Teal outline) is clearly visible around the focused element.
- [ ] **Navigation**: Tab through the entire configuration panel.
- [ ] **Interaction**:
    - Use `Space` or `Enter` to toggle Checkboxes.
    - Use `Arrow Keys` to change Radio selections (if any) or Select dropdowns.
- [ ] **Modals**: Open "Preview" (if available). Press `Esc`. Does it close?

## 2. Screen Reader Walkthrough (NVDA / VoiceOver)
- [ ] **Enable SR**: Turn on your Screen Reader.
- [ ] **Landmarks**: Navigate by landmarks (`D` in NVDA). Should announce "Main", "Banner" (Header).
- [ ] **Buttons**: Tab to "Theme Toggle". SR should say "Switch to dark mode" (or similar label), NOT just "button".
- [ ] **Alerts**: Trigger an error (e.g., try to generate without settings). SR should interrupt or announce the alert message immediately (`role="alert"`).
- [ ] **Success**: Save an item. SR should announce "Success" or the toast content.

## 3. Zoom & Reflow
- [ ] **Zoom**: Set browser zoom to **200%**.
- [ ] **Layout**: Ensure no content overlaps or becomes unreachable.
- [ ] **Horizontal Scroll**: Ensure NO horizontal scrollbar appears for the main content (reflow works).

## 4. Mobile Touch Targets
- [ ] **Device Mode**: Open DevTools (`F12`) -> Toggle Device Toolbar (`Ctrl+Shift+M`).
- [ ] **Target Size**: Select "iPhone 12" or similar.
- [ ] **Verify**: Inspect buttons. Computed height should be >= 44px.
- [ ] **Spacing**: Verify links/buttons aren't too close (min 8px gap).

## 5. Dark Mode High Contrast
- [ ] **Toggle**: Switch to Dark Mode.
- [ ] **Text**: Check grey text against dark background. Is it legible?
- [ ] **Interactive**: Hover over buttons. Is the hover state visible?
- [ ] **Focus**: Tab through elements. Is the focus ring still visible against dark bg?
