# Installation & start-up

Project utilizes VS Code' debugger and tasks. For any other IDE you will have to start electron manually: `npm run start && electron .`.

`Start` script does not actually starts the app, but only compiles main package. This is done intentionally to discourage manual start-up, so you wont unintentiannaly skip `tsc` checks (typescript compilation errors).

---

- `npm i`
- press `F5`