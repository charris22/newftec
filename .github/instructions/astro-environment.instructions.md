---
description: "Repository-specific guidance for Astro environment variable usage, client-side script handling, and Azure Static Web Apps deployment in the AgroStay project."
applyTo:
  - 'astro-site/src/**/*.astro'
  - 'astro-site/src/**/*.ts'
  - 'astro-site/src/**/*.js'
---

Use these conventions when editing this repository:

- Astro client-side environment variables must use the `PUBLIC_` prefix if they need to be exposed to browser code.
- `import.meta.env.PUBLIC_*` values are resolved at build time in Astro-processed script blocks; they are not available in raw HTML `<script>` tags emitted directly to the browser.
- For production deployments, ensure environment variables are present in the build environment. In Azure Static Web Apps, that means setting configuration values on the app service or passing them through the GitHub Actions workflow.
- Prefer edits in `astro-site/src/` for UI, client interaction, and map or form behavior.
- When the user asks about deployment or build-time issues, also inspect `.github/workflows/` for missing env var propagation.



# Copilot.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.