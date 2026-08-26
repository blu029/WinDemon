---
name: Clarity & Care
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#43474f'
  inverse-surface: '#303030'
  inverse-on-surface: '#f1f1f1'
  outline: '#747780'
  outline-variant: '#c4c6d0'
  surface-tint: '#3f5f92'
  primary: '#001736'
  on-primary: '#ffffff'
  primary-container: '#002b5c'
  on-primary-container: '#7594cb'
  inverse-primary: '#aac7ff'
  secondary: '#705d00'
  on-secondary: '#ffffff'
  secondary-container: '#fcd400'
  on-secondary-container: '#6e5c00'
  tertiary: '#390002'
  on-tertiary: '#ffffff'
  tertiary-container: '#600007'
  on-tertiary-container: '#ff5a53'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aac7ff'
  on-primary-fixed: '#001b3e'
  on-primary-fixed-variant: '#264779'
  secondary-fixed: '#ffe16d'
  secondary-fixed-dim: '#e9c400'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#544600'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb3ac'
  on-tertiary-fixed: '#410003'
  on-tertiary-fixed-variant: '#930010'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 34px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  label-xl:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
  button-text:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  touch-target-min: 48px
  gutter: 16px
  margin-page: 20px
  stack-gap: 24px
  grid-gap: 16px
---

## Brand & Style
The design system focuses on cognitive ease, visual accessibility, and confidence for elderly users. The personality is supportive, stable, and highly legible, prioritizing function over aesthetic flourish while maintaining a modern "PhonePe-like" slickness.

The design style combines **High-Contrast / Bold** elements with **Corporate / Modern** reliability. It utilizes large, distinct interactive zones and a limited cognitive load per screen to ensure users with varying degrees of visual or cognitive impairment can navigate without friction.

## Colors
The palette is built for maximum WCAG AAA compliance. 

- **Primary & Secondary:** A deep Navy (#002B5C) serves as the anchor, paired with a high-visibility Yellow (#FFD700). In Dark Mode, the background switches to pure Black (#000000) with Yellow or White text.
- **Functional Coding:** Color is used as a wayfinding tool rather than decoration. Red is reserved strictly for SOS/Emergency, Purple for cognitive games, Teal for daily tasks, and Orange for time-sensitive reminders.
- **Contrast:** Avoid using light greys for text. All secondary text must maintain a minimum 7:1 contrast ratio against the background.

## Typography
The system uses **Inter** for its exceptional legibility and tall x-height. 

- **Weight:** Use Bold (700) or ExtraBold (800) for all headings to ensure they stand out as structural landmarks.
- **Size:** Minimum body text size is 18px. For critical labels and button text, 20px+ is required to accommodate users with presbyopia.
- **Scaling:** On mobile devices, keep headings large but ensure they wrap cleanly. Avoid all-caps for long sentences; reserve uppercase for short, high-priority labels only.

## Layout & Spacing
This design system utilizes a **Fixed Grid** approach for predictability. 

- **The 2x2 Grid:** For main navigation dashboards, use a 2-column grid. This minimizes scanning effort and maximizes the size of each touch target.
- **Full-Width Action:** Primary calls to action (like "Call Caregiver" or "Confirm Task") should always be full-width buttons to ensure they are easily clickable regardless of hand dexterity.
- **Breakpoints:** 
  - **Mobile:** 4-column grid for list items, 2-column for large tiles. 20px side margins.
  - **Tablet:** 8-column grid with increased gutters (24px) to prevent the layout from feeling overly stretched.

## Elevation & Depth
To maintain the "lightweight and smooth" feel, the system avoids complex shadows.

- **Tonal Layers:** Use solid fills to denote depth. A light-gray background for the page with white cards creates clear container boundaries.
- **Low-Contrast Outlines:** In Light Mode, use a 2px solid border in a subtle neutral tone to define cards if shadows are not providing enough separation.
- **Interactivity:** When a button is pressed, it should visually "sink" or change color significantly (e.g., Yellow to Orange) to provide immediate haptic and visual feedback.

## Shapes
A **Rounded** (0.5rem) language is used to make the interface feel friendly and non-threatening. 

- **Large Tiles:** Use `rounded-xl` (1.5rem) for main dashboard tiles to create a soft, approachable "toy-like" feel that encourages interaction.
- **Interactive Elements:** Buttons and input fields should utilize `rounded-lg` (1.0rem) for a distinct silhouette that separates them from the background.

## Components
- **Buttons:** Minimum height of 60px. Must include a high-contrast label and, where possible, a large icon.
- **Cards (Tiles):** Dashboard cards are 2x2 grid items. They must contain a centered, thick-stroke icon (32px or larger) and a bold label underneath.
- **Progress Indicators:** Use thick, 12px+ bars. Avoid thin lines or small "dots" which are difficult to see.
- **Input Fields:** 64px height with a 2px border. The active state should use the Primary Navy color for the border to clearly indicate focus.
- **Iconography:** Use a 3px minimum stroke width. Icons must be literal (e.g., a real telephone icon for "Call", not a generic "Communication" bubble).
- **Checkboxes:** Oversized (32x32px) to ensure they are easy to toggle for users with tremors.