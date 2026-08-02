---
name: Heritage Artisanal
colors:
  surface: '#fff8f6'
  surface-dim: '#fbd1c4'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ed'
  surface-container: '#ffe9e3'
  surface-container-high: '#ffe2da'
  surface-container-highest: '#ffdbd0'
  on-surface: '#2c160e'
  on-surface-variant: '#504442'
  inverse-surface: '#442a22'
  inverse-on-surface: '#ffede8'
  outline: '#827472'
  outline-variant: '#d3c3c0'
  surface-tint: '#745853'
  primary: '#271310'
  on-primary: '#ffffff'
  primary-container: '#3e2723'
  on-primary-container: '#ae8d87'
  inverse-primary: '#e3beb8'
  secondary: '#5e604d'
  on-secondary: '#ffffff'
  secondary-container: '#e1e1c9'
  on-secondary-container: '#636451'
  tertiary: '#291200'
  on-tertiary: '#ffffff'
  tertiary-container: '#472400'
  on-tertiary-container: '#dd7b00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#e3beb8'
  on-primary-fixed: '#2b1613'
  on-primary-fixed-variant: '#5b403c'
  secondary-fixed: '#e4e4cc'
  secondary-fixed-dim: '#c8c8b0'
  on-secondary-fixed: '#1b1d0e'
  on-secondary-fixed-variant: '#474836'
  tertiary-fixed: '#ffdcc2'
  tertiary-fixed-dim: '#ffb77a'
  on-tertiary-fixed: '#2e1500'
  on-tertiary-fixed-variant: '#6d3a00'
  background: '#fff8f6'
  on-background: '#2c160e'
  surface-variant: '#ffdbd0'
typography:
  headline-xl:
    fontFamily: Chivo
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Chivo
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Chivo
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  price-display:
    fontFamily: Work Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-caps:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  border-gap: 4px
---

## Brand & Style

The design system is rooted in the "Heritage Artisanal" aesthetic, blending the prestige of traditional coffee culture with modern editorial clarity. It evokes an emotional response of reliability, warmth, and timeless quality. 

The style utilizes a **Vintage-Modern** mix:
- **Artisanal Heritage:** Heavy use of decorative borders, parchment-inspired surfaces, and calligraphic focus points.
- **Structured Precision:** A rigorous vertical grid inspired by old ledger books and traditional merchant price lists.
- **Textural Depth:** Subtle grain and paper noise are applied to background surfaces to eliminate "digital flatness" and provide a tactile feel.

## Colors

The palette is anchored in high-contrast earth tones that mimic the materials of a classic coffee roastery.

- **Dark Espresso (#3E2723):** Used for all structural elements, including double-line borders, headers, and primary text. It acts as the "ink" of the design system.
- **Light Parchment (#F5F5DC):** The foundation for all surfaces. It should always include a 2-3% noise overlay to simulate high-quality paper stock.
- **Amber Accent (#FF8F00):** Reserved exclusively for "call to action" elements, heritage ribbons, or highlighting premium product features.
- **Muted Earth (#5D4037):** Used for secondary information, meta-data, and dashed dividers to maintain hierarchy without competing with the primary Espresso.

## Typography

The typography strategy creates a bridge between heritage calligraphic display and functional modernism.

- **Display (Arabic):** For product names and major headings, a sharp, bold Kufic-inspired font should be used to anchor the cultural identity.
- **Display (English/Numbers):** Chivo is used for its aggressive, high-impact personality in headings.
- **Functional Text:** Work Sans provides the necessary legibility for descriptions and pricing, ensuring the "Artisanal" style remains accessible.
- **Metadata:** IBM Plex Sans in all-caps is used for technical labels (e.g., "WEIGHT", "ROAST LEVEL") to give a systematic, organized feel.

## Layout & Spacing

This design system uses a **Fixed Grid** model inspired by traditional broadsheet layouts.

- **The Frame:** Every page is enclosed in a primary frame. This frame consists of a thick outer line (2px) and a thin inner line (1px) with a 4px gap.
- **Vertical Rhythm:** Content is organized in vertical stacks separated by thin dashed horizontal lines (`border-style: dashed; border-width: 1px`).
- **Product Grids:** Products are displayed in a multi-column list (1 column on mobile, 3 on desktop). Each item displays weight variants (Sada, Mehwaj, etc.) in a clear, aligned vertical column on the right side of the card.
- **Breakpoints:**
  - Mobile (<600px): Single column, reduced margins.
  - Desktop (>1024px): 12-column grid with a maximum content width of 1200px.

## Elevation & Depth

To maintain the vintage "printed" feel, this design system avoids soft ambient shadows and instead uses **Tonal Layering** and **Graphic Framing**.

- **Stacked Depth:** Elevation is achieved by placing dark-colored containers (Espresso Brown) on top of the Parchment background.
- **Zero Shadows:** No box-shadows should be used. Hierarchy is strictly defined by border weight and color fill.
- **Corner Ornaments:** Use SVG-based flourishes in the four corners of primary containers to denote "High Elevation" or premium content.
- **Image Integration:** Product photography should have "soft-faded" edges or be masked into organic circular shapes to blend into the parchment background, appearing as if printed directly on the page.

## Shapes

The shape language is primarily **Geometric and Structured**.

- **Primary Corners:** 4px (Soft) radius for standard containers and badges. This prevents the design from feeling too "sharp" or aggressive while maintaining a classic look.
- **The Badge:** Use solid Espresso Brown rectangles with slightly rounded corners for category headers and status indicators.
- **Dividers:** Use 1px dashed lines for internal divisions to mimic the perforated edges of vintage stamps or tickets.

## Components

- **Buttons:** Solid Espresso Brown with white text. Hover state shifts the background to the Amber Accent. Use `label-caps` for button text.
- **Product Cards:** No background or shadow. Defined by a bottom dashed divider. Product name on the left in Bold Arabic, pricing/weight on the right in Sans-serif.
- **Badges/Headers:** Rectangular blocks with a 4px border-radius. Text must be white or light parchment.
- **Input Fields:** 1px solid Espresso Brown border. No rounded corners. Background should be 5% darker than the page parchment.
- **Dividers:** Thin, dark brown dashed lines. Use for separating product list items.
- **Footer:** Centered branding anchored by a double-line top border. Text should be "BUDRAN COFFEE - PREMIUM QUALITY" in `label-caps`.
- **Heritage Ribbons:** Occasional use of the Amber color in a vertical ribbon shape (folded over the top of a card) to denote "Best Seller" or "New Arrival."