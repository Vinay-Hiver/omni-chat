# Start here (instructions for Claude)

The user put this file in an empty folder to start a new prototype with the HOT (Hiver) design system. Set everything up now, without asking questions, then ask what to build. Keep your messages short.

1. Run `node -v`. If Node is missing or older than 18, tell the user to install it from https://nodejs.org and stop.
2. Look at the folder. Ignore this file and hidden files. If anything else is in the folder, tell the user and stop (never overwrite).
3. Copy the template into this folder: `npx --yes degit Vinay-Hiver/hot-storybook/starter . --force`. If that fails, run `git clone --depth 1 https://github.com/Vinay-Hiver/hot-storybook.git _hot`, copy everything inside `_hot/starter` (including hidden files) into this folder, then delete `_hot`.
4. Run `npm install`.
5. Run `npm run dev` in the background and tell the user the local address it prints. Do not keep checking on it.
6. Read `CLAUDE.md` and `COMPONENTS.md` in this folder, once. They list every component with its props, the colour tokens and page recipes, so you do not need to open any other file to learn what exists. Read `ICONS.md` only when you need to pick an icon.
7. Tell the user the prototype is running, and ask what page they want to build.

When building: put pages in `src/pages/<Name>.tsx` and show them from `src/App.tsx`. Use the components, `var(--tokens)` for colours and `<Icon>` for icons. No hex colours, no hand-drawn SVGs, no other UI library. Do not start Storybook. If a component you need is missing, tell the user which one instead of drawing a copy of it.
