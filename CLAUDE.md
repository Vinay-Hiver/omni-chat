# Prototype built with the HOT design system

- Read `COMPONENTS.md` first. It lists every component with its props, the colour tokens, icons (names are in `ICONS.md`) and page recipes. That is all you need: do not open files under `src/components` or `src/patterns` to find out what exists.
- Run the app with `npm run dev`. Do not start Storybook and do not scaffold a new project: this one is ready.
- Build pages in `src/pages/<Name>.tsx` and show them from `src/App.tsx`.
- Use the components, `var(--tokens)` for colours and `<Icon>` for icons. No hex colours, no hand-drawn SVGs, no other UI library.
- If a component you need is missing, tell the user which one instead of drawing a copy.
- The `sample…` data files only fill navigation with example entries; replace them with real items.
