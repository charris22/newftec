# Emoji To Fluent Icons Plan

## Goal

Replace emoji-based UI markers across the Astro site with a shared icon system based on Fluent 2 iconography.

Primary objectives:

- Remove inconsistent emoji rendering across browsers and platforms.
- Improve accessibility and visual consistency.
- Centralize icon usage so future changes do not require page-by-page markup edits.
- Keep the Astro site framework-light by avoiding a React dependency just for icons.

## Recommended Technical Approach

Use plain SVG assets from the Fluent icon library, not React icon components.

Recommendation:

- Preferred source: `@fluentui/svg-icons`
- Rendering model: a shared Astro `Icon.astro` component backed by a local icon registry
- Content model: page data should reference semantic icon keys like `mail`, `chat`, `cloud`, `chart`, not raw emoji characters and not package-specific filenames

Why this approach fits this repo:

- The site in `astro-site` is plain Astro with no React integration.
- Shared SVG rendering is easier to style and keep accessible than emoji spans.
- A registry-based approach removes repeated icon markup from pages and components.

## Scope

### High-priority shared components

- `astro-site/src/components/ServiceCard.astro`
- `astro-site/src/components/TrustBadges.astro`

### High-priority pages

- `astro-site/src/pages/index.astro`
- `astro-site/src/pages/services.astro`
- `astro-site/src/pages/contact.astro`

### Secondary pages

- `astro-site/src/pages/about.astro`
- `astro-site/src/pages/about-site.astro`
- `astro-site/src/pages/mckinney-map.astro`

### Out of scope for first pass

- README cosmetics
- Non-UI decorative Unicode unless it is visually acting like an icon

## Current Emoji Usage Inventory

### Shared components

#### `astro-site/src/components/TrustBadges.astro`

- `🏅` Cloud Certified
- `🤖` AI Specialist
- `✅` 20+ Years of project experience

#### `astro-site/src/components/ServiceCard.astro`

- Renders `icon` props as raw glyphs

### Pages using data arrays with emoji icons

#### `astro-site/src/pages/index.astro`

- `☁️` Cloud Migration
- `🤖` Generative AI & Automation
- `⚡` Application Modernization

#### `astro-site/src/pages/services.astro`

- `☁️` Cloud Migration
- `🤖` Generative AI & Intelligent Automation
- `⚡` Application Modernization
- `📊` Data & Analytics
- `🔄` DevOps & Platform Engineering
- `🛡️` Security & Compliance

#### `astro-site/src/pages/contact.astro`

- `📧` Email Us
- `💬` Chat with AI
- `📅` Schedule a Call
- `🔒` Your data is secure and never shared
- `⚡` Response within 24 hours guaranteed
- `🤝` No obligation, no pressure

#### `astro-site/src/pages/about.astro`

- Core values: `⚡`, `🎯`, `🛡️`
- Differentiators: `🏪`, `💰`, `📚`, `🚀`
- GenAI section: `💬`, `✍️`, `📊`, `⚙️`

#### `astro-site/src/pages/about-site.astro`

- Ownership benefits: `🔓`, `💵`, `🛠️`, `📦`
- Architecture features: `☁️`, `🤖`, `🔄`, `🧩`
- Pipeline stages currently use `✓`

#### `astro-site/src/pages/mckinney-map.astro`

- Section headings: `📍`, `🏃`, `🏛️`
- Insight cards: `📈`, `💰`, `🎯`, `🌳`

## Semantic Icon Mapping

Use semantic keys in page data and resolve them in one shared registry.

Suggested first-pass mapping:

| Current glyph | Meaning | Semantic key |
| --- | --- | --- |
| `📧` | email | `mail` |
| `💬` | chat | `chat` |
| `📅` | schedule | `calendar` |
| `☁️` | cloud | `cloud` |
| `🤖` | AI agent | `bot` |
| `⚡` | speed or power | `flash` |
| `📊` | analytics | `chart` |
| `📈` | growth | `trending` |
| `🛡️` | security | `shield` |
| `🔒` | privacy or security | `lock` |
| `🎯` | target or precision | `target` |
| `📚` | knowledge | `book` |
| `🚀` | launch or modernization | `rocket` |
| `🔄` | sync or DevOps | `sync` |
| `🤝` | partnership | `handshake` |
| `🏪` | retail or SMB focus | `store` |
| `💰` | pricing or savings | `money` |
| `✍️` | content creation | `edit` |
| `⚙️` | automation or settings | `settings` |
| `🔓` | ownership or freedom | `unlock` |
| `💵` | cost savings | `cash` |
| `🛠️` | customization | `tools` |
| `📦` | complete ownership or packaged delivery | `box` |
| `🧩` | extensibility | `puzzle` |
| `📍` | location | `location` |
| `🏃` | activity or trails | `activity` |
| `🏛️` | civic resources | `city` |
| `🌳` | parks and quality of life | `tree` |
| `✅` | verified experience | `check-circle` |
| `✓` | completed step | `check` |
| `→` | directional CTA | `arrow-right` |

Note:

- Final Fluent asset selection should be based on visual fit, not only literal name matching.
- Some keys may map to a more appropriate Fluent icon than the closest word match.

## Proposed File Additions

### New shared files

- `astro-site/src/components/Icon.astro`
- `astro-site/src/lib/icon-registry.ts`

Optional if styling grows:

- `astro-site/src/styles/icons.css`

## Component Design

### `Icon.astro`

Recommended props:

- `name: string`
- `size?: number | string`
- `label?: string`
- `decorative?: boolean`
- `class?: string`

Behavior:

- Resolve icon key through the registry.
- Render inline SVG with predictable width and height.
- Apply `aria-hidden="true"` for decorative usage.
- Apply `role="img"` and accessible labeling when meaning is not duplicated by nearby text.

### `icon-registry.ts`

Responsibilities:

- Map semantic keys to SVG imports or raw SVG content.
- Keep all icon-source details out of page components.
- Make it easy to swap or refine icons later without touching content arrays.

## Migration Phases

### Phase 1: Foundation

1. Add the shared `Icon.astro` component.
2. Add the icon registry with the initial semantic key set.
3. Define shared CSS behavior for icon wrappers:
   - inline icon
   - badge icon
   - card icon

Success criteria:

- One reusable icon primitive exists.
- No page imports raw icon assets directly.

### Phase 2: Shared component refactor

1. Refactor `ServiceCard.astro` to accept semantic icon keys and render `Icon.astro`.
2. Refactor `TrustBadges.astro` to use semantic icon keys.

Success criteria:

- Shared components no longer render emoji spans.
- Styling remains visually stable in light and dark themes.

### Phase 3: Primary page migration

1. Convert `index.astro`
2. Convert `services.astro`
3. Convert `contact.astro`

Success criteria:

- Main landing and conversion pages are emoji-free.
- CTA cards and contact cards maintain alignment and spacing.

### Phase 4: Secondary page migration

1. Convert `about.astro`
2. Convert `about-site.astro`
3. Convert `mckinney-map.astro`

Success criteria:

- Editorial and informational sections follow the same visual system.
- Hardcoded icon markup is removed or minimized.

### Phase 5: Symbol cleanup

Replace symbol-like markers still functioning as icons:

- `✓`
- `→`
- icon-like heading prefixes in map sections

This should happen after the main icon primitive is in place.

## Accessibility Rules

### Decorative usage

Use decorative icons when text already communicates the meaning.

Examples:

- service cards with visible headings
- trust badges with visible labels
- insight cards with visible headings

Implementation:

- `aria-hidden="true"`
- no redundant spoken label

### Informative usage

Use a label only when the icon itself carries meaning not already present in adjacent text.

Examples:

- icon-only controls if they are added later
- status indicators without nearby descriptive text

## Visual Design Guidance

### Container consistency

Replace emoji-specific font sizing with explicit icon sizing.

Recommended patterns:

- 20px icons for inline labels and compact cards
- 24px icons for section cards and contact methods
- 28px or 32px icons only for hero-adjacent or emphasis use

### Styling rules

- Use `currentColor` SVGs so icons inherit text color naturally.
- Continue using existing gradient-backed wrappers where the current UI already uses them.
- Keep icon wrapper dimensions fixed to prevent layout shift.
- Ensure icons align optically with text, not just mathematically.

### Dark mode

Verify icon contrast in:

- neutral cards
- gradient-backed icon boxes
- dark sections like trust and CTA areas

## Risks And Mitigations

### Risk: package-specific naming leaks into content

Mitigation:

- Use semantic keys like `chart` and `mail`, not raw asset filenames.

### Risk: inconsistent icon box sizing after replacing emojis

Mitigation:

- Standardize wrapper width, height, and alignment in shared CSS.

### Risk: over-scoping the first pass

Mitigation:

- Prioritize shared components and top-traffic pages first.

### Risk: implementation blocked by package tooling

Mitigation:

- Keep the registry abstraction independent from the icon source.
- If package installation is unstable, local SVG assets can be vendored temporarily without changing page code.

## Acceptance Criteria

The migration is complete when:

- No customer-facing page uses emoji as a UI icon.
- Shared components render icons only through the shared `Icon.astro` primitive.
- Icon keys in page data are semantic and centralized.
- Light and dark modes remain visually correct.
- Decorative icons are hidden from assistive tech.
- CTA arrows and pipeline checks are visually consistent with the new icon system.

## Recommended Execution Order

1. Create `Icon.astro`
2. Create `icon-registry.ts`
3. Refactor `ServiceCard.astro`
4. Refactor `TrustBadges.astro`
5. Migrate `index.astro`
6. Migrate `services.astro`
7. Migrate `contact.astro`
8. Migrate `about.astro`
9. Migrate `about-site.astro`
10. Migrate `mckinney-map.astro`
11. Replace remaining `✓` and `→` markers
12. Run build and visual QA

## QA Checklist

- Build passes in `astro-site`
- No missing icon references
- No layout shift in service cards or trust badges
- Contact methods still align cleanly on mobile
- Icon wrappers maintain contrast in dark mode
- Screen readers do not announce decorative icons redundantly
- Map page headings remain readable and balanced after icon replacement