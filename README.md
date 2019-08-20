# What & why

Using electron with next in a safe(ish) way -- especially in prod -- is not exactly easy. The amount of non-obvious configuration required in order to bootsrap an app is huge. This project is simply an accumulation of essential know-how.

The idea with redux here is to manage all actions on the electron-(main)'s side and then sync its state with electron-windows' via ipc.

IPCs are wrapped in IpcScheme which glues main and renderer ipcs together with types providing safer dx.

# I want it to be safer

Typescript' type system is not sound. It is certanly better than vanilla js, but still leaves a lot to be desired. If you want a safer solution you should migrate to ML' family language platforms like elm, reasonml, ocaml, haskel, etc. If kotlin-js matures it would be a good candidate too.

The only safer alternatives to electron-pwa are:

* Actual spa-pwa application in your preffered type-sound language platform
* Actual native app in your preffered type-sound language platform
* Wasm; to incapsulate critical parts of your application
* [Revery](https://github.com/revery-ui/revery) (reasonml-electron-like platform); not mature yet

# Installation & start-up

Project utilizes VS Code' debugger and tasks. For any other IDE you will have to start electron manually: `npm run start && electron .`.

`Start` script does not actually starts the app, but only compiles main package. This is done intentionally to discourage manual start-up, so you wont unintentiannaly skip `tsc` checks (typescript compilation errors).

---

- `npm i`
- press `F5`