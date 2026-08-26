---
name: Clarity & Care
colors:
  surface: '#fdf8fd'
  surface-dim: '#ddd9de'
  surface-bright: '#fdf8fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f2f8'
  surface-container: '#f1ecf2'
  surface-container-high: '#ebe7ec'
  surface-container-highest: '#e5e1e7'
  on-surface: '#1c1b1f'
  on-surface-variant: '#4b4452'
  inverse-surface: '#313034'
  inverse-on-surface: '#f4eff5'
  outline: '#7c7483'
  outline-variant: '#cdc3d4'
  surface-tint: '#7841b9'
  primary: '#470085'
  on-primary: '#ffffff'
  primary-container: '#5f259f'
  on-primary-container: '#cda3ff'
  inverse-primary: '#dab9ff'
  secondary: '#0058bb'
  on-secondary: '#ffffff'
  secondary-container: '#1471e6'
  on-secondary-container: '#fefcff'
  tertiary: '#670026'
  on-tertiary: '#ffffff'
  tertiary-container: '#910038'
  on-tertiary-container: '#ff98aa'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eedbff'
  primary-fixed-dim: '#dab9ff'
  on-primary-fixed: '#2a0053'
  on-primary-fixed-variant: '#5f259f'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc7ff'
  on-secondary-fixed: '#001a41'
  on-secondary-fixed-variant: '#004493'
  tertiary-fixed: '#ffd9de'
  tertiary-fixed-dim: '#ffb2be'
  on-tertiary-fixed: '#400014'
  on-tertiary-fixed-variant: '#900038'
  background: '#fdf8fd'
  on-background: '#1c1b1f'
  surface-variant: '#e5e1e7'
typography:
  headline-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 20px
  gutter: 16px
  stack-gap-sm: 12px
  stack-gap-md: 24px
  stack-gap-lg: 40px
---

## Brand & Style
The design system is engineered for a demographic that prioritizes legibility, cognitive ease, and reassurance. The brand personality is **Empathetic, Dependable, and Vital**. It bridges the gap between high-tech utility and human-centric care.

The visual style is a blend of **Corporate Modern and Tactile Softness**. It uses generous whitespace and a "container-first" philosophy to group related information, reducing cognitive load. While the core is clean and professional, subtle depth and high-contrast interactions provide the tactile feedback necessary for users with varying levels of digital literacy or visual acuity.

## Colors
The palette is anchored by a **Vibrant Deep Purple**, derived from the reference, used primarily for branding, primary actions, and top-level navigation. 

- **Primary Purple:** Used for critical touchpoints and brand presence.
- **Secondary Blue:** Reserved for informative actions and secondary utility features (e.g., rewards, referrals).
- **Status Colors:** These are high-chroma variants to ensure they are distinguishable even for users with color vision deficiencies. **Emergency Red** is particularly saturated for instant recognition.
- **Surface Strategy:** In light mode, surfaces use a very soft violet-tinted off-white to reduce glare while maintaining contrast. In dark mode, surfaces utilize deep charcoals rather than pure black to preserve readability of white text.

## Typography
This design system exclusively uses **Atkinson Hyperlegible Next**. This typeface was specifically designed to increase character recognition and improve legibility for low-vision readers.

- **Scale:** All font sizes are increased by approximately 20% compared to standard SaaS defaults.
- **Weight:** Avoid 'Thin' or 'Light' weights. Use 'Regular' (400) for body and 'SemiBold/Bold' (600+) for headlines to ensure stroke thickness remains visible against high-contrast backgrounds.
- **Paragraphs:** Line height is generous (1.5x) to prevent "line crowding" during reading.

## Layout & Spacing
The layout follows a **Fluid Grid with Safe Margins**. To accommodate elderly users, touch targets and spacing are significantly larger than industry averages.

- **Touch Targets:** Any interactive element must have a minimum hit area of 48x48dp, though 56dp is preferred for primary actions.
- **Grouping:** Use the "Stack" method. Group related items into cards with 24px of vertical space between sections to provide clear visual "chapters" in the interface.
- **Breakpoints:**
  - **Mobile:** 4-column grid, 20px side margins.
  - **Tablet:** 8-column grid, 32px side margins.
  - **Desktop:** 12-column grid, max-width 1280px, centered.

## Elevation & Depth
Depth is used functionally to indicate interactivity. This design system avoids complex 3D skeuomorphism in favor of **Tonal Layering and Soft Ambient Shadows**.

1.  **Level 0 (Background):** The base canvas, slightly tinted.
2.  **Level 1 (Cards):** White (Light Mode) or Dark Gray (Dark Mode) surfaces with a subtle 1px border (`#00000010`) and a soft, wide-spread shadow.
3.  **Level 2 (Floating/Modals):** High-contrast shadows (15% opacity) to create a distinct physical separation from the background, ensuring the user knows where the focus lies.
4.  **Active States:** Interactive elements like buttons should use a subtle inner-glow or "pressed" depth change to provide tactile confirmation of a click.

## Shapes
The shape language is **Warm and Approachable**. 

- **Base Radius:** 16px (`rounded-lg`) is the standard for most containers and cards to avoid "sharp" industrial corners that can feel aggressive.
- **Buttons:** Use a 12px radius or full pills for high-visibility action buttons.
- **Icons:** Icons should be contained within rounded-square enclosures (24px radius) to mimic the "app icon" familiarity found in mobile operating systems, making them easier to identify and tap.

## Components
- **Buttons:** High-contrast backgrounds. Primary buttons use White text on the Purple base. Use "Heavy" icons (2pt stroke) alongside text labels to ensure the action is unmistakable.
- **Cards:** White or very light gray backgrounds with 20px internal padding. Always include a subtle border to define the clickable area for users with reduced contrast sensitivity.
- **Input Fields:** Large 56px height. Labels must always be visible (not floating placeholders). Use a 2px border for the 'Focused' state in the Primary Purple.
- **Chips:** Used for filtering and status. Must have a minimum height of 40px for easy tapping.
- **Emergency Button:** A dedicated, persistent component. High-contrast Red background, always accompanied by an icon (e.g., a bell or life-ring) and clear "HELP" or "EMERGENCY" text.
- **Lists:** Use "Divided" lists with at least 16px of vertical padding per item. Avoid compact lists; each list item should feel like a substantial horizontal target.