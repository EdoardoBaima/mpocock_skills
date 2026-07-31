---
name: setup-ts-deep-modules
description: Set up dependency-cruiser in a TypeScript repository so package root files form the public interface and package subfolders remain private. User-invoked.
disable-model-invocation: true
---

# Set up TypeScript deep modules

Use dependency-cruiser to make each package a deep module: substantial behaviour behind a small public interface.

A package's root files are its public entry points. Everything below a package subfolder is private. Use the `/skill:codebase-design` vocabulary for deep modules, interfaces, seams, and depth.

This skill is also a reference implementation for other languages and frameworks. Preserve the architectural invariants when adapting it. Replace the TypeScript tool and path syntax rather than copying them blindly.

## Package shape

```text
src/packages/
  <name>/
    index.ts        <- public entry point
    client.ts       <- another public entry point
    lib/            <- private implementation
    tests/          <- private tests and fixtures
```

A package may expose several focused root files. Do not force every public symbol through one barrel file.

The configuration enforces five rules:

1. Code outside a package may import its root entry points, but not its subfolders.
2. One package may import another package's root entry points, but not its subfolders.
3. Tests may import entry points and fixtures under their own `tests/` folder, but not implementation internals.
4. Non-test code may not import anything from a package's `tests/` folder.
5. Dependencies may not form cycles.

Files within one package may import that package's own implementation freely. Layering between packages is a separate decision. The template leaves layering disabled.

## 1. Detect the repository shape

Inspect before changing files:

- detect pnpm from `pnpm-lock.yaml`
- detect Yarn from `yarn.lock`
- detect Bun from `bun.lock` or `bun.lockb`
- otherwise use npm
- find the actual packages root from workspace configuration and existing source directories
- use `src/packages` or `packages` only when it matches the repository
- find the repository's target Node.js version from `package.json` engines, version files, continuous integration, and the active `node --version`
- find the TypeScript configuration that covers the files dependency-cruiser will inspect
- find every existing `.dependency-cruiser.*` configuration
- find the existing typecheck and continuous integration commands

If several TypeScript configurations could apply, ask the user which one represents the boundary check. Do not assume a root `tsconfig.json`.

If a dependency-cruiser configuration exists, merge this skill's rules and required options into it. Preserve unrelated rules and options. Resolve rule-name collisions explicitly rather than overwriting the file.

Done when the package manager, Node.js target, packages root, TypeScript configuration, cruise targets, and existing configuration status are known.

## 2. Install dependency-cruiser

Check the `engines.node` requirement of the dependency-cruiser release before installing it. Select the newest release compatible with the repository's target Node.js version. If the repository does not define a target and the active runtime would force a lasting version choice, ask the user.

Install the selected `dependency-cruiser` release as a development dependency with the detected package manager. Record an explicit version through the package manager and lockfile.

Done when the repository records a Node-compatible release in `devDependencies`.

## 3. Add the configuration

Copy [`dependency-cruiser.config.cjs`](./dependency-cruiser.config.cjs) to the repository root as `.dependency-cruiser.cjs`.

Set:

- `PACKAGES_ROOT` to the repository-relative packages directory
- `TYPESCRIPT_CONFIG` to the selected TypeScript configuration
- `enhancedResolveOptions.extensions` only when the repository resolves additional source extensions

Keep `.cjs` so `module.exports` works in repositories that set `"type": "module"`.

Done when the configuration contains all five forbidden rules and points to the correct repository paths.

## 4. Add the boundary check

Add a `lint:boundaries` package script that runs dependency-cruiser with `.dependency-cruiser.cjs`.

Cruise every importer that the rules should govern, not only the packages directory. For example:

```json
{
  "scripts": {
    "lint:boundaries": "depcruise --config .dependency-cruiser.cjs src"
  }
}
```

If packages and application code have separate roots, include both:

```json
{
  "scripts": {
    "lint:boundaries": "depcruise --config .dependency-cruiser.cjs packages src"
  }
}
```

Add `lint:boundaries` to the existing umbrella `check`, `validate`, or continuous integration command that runs typechecking. Do not change TypeScript path aliases merely to support this check.

If no umbrella command exists, add `lint:boundaries` and tell the user where continuous integration must call it.

Done when the command inspects every governed importer and runs alongside typechecking.

## 5. Add a copyable example

Create `<packages-root>/example/`:

- `index.ts` exports one public function that delegates to `lib/impl.ts`
- `lib/impl.ts` contains the private implementation
- `tests/example.test.ts` imports only `../index` and tests the public function

Commit the example as a template the user can copy or delete.

Done when the example exposes behaviour through a root entry point and keeps its implementation in a subfolder.

## 6. Prove every rule

A boundary configuration is complete only after each rule has rejected a representative violation.

First run `lint:boundaries` against the clean repository. It must pass. Then make and immediately revert one temporary violation for each rule:

1. Import `example/lib/impl` from governed application code. Expect `entrypoint-boundary-from-app`.
2. Import `example/lib/impl` from a different package. Expect `entrypoint-boundary-across-packages`.
3. Import `../lib/impl` from `example/tests/example.test.ts`. Expect `tests-through-entrypoints`.
4. Import an `example/tests/` fixture from non-test code. Expect `tests-folder-is-private`.
5. Add a temporary two-file dependency cycle. Expect `no-circular`.

Run the clean check again after reverting every probe. It must pass.

If any probe passes unexpectedly, fix the configuration or cruise targets before finishing. Do not leave probe files, imports, or cycles in the repository.

Done when you have recorded one clean pass, five expected failures with the correct rule names, and a final clean pass.

## 7. Document the convention

Write `<packages-root>/README.md` beside the packages. Keep it short and include:

- the package layout
- root files as public entry points
- subfolders as private implementation
- `lib/` and `tests/` conventions
- the five enforced rules
- the `lint:boundaries` command
- a warning against large barrel files

Add one pointer to this README from `AGENTS.md` when it exists. Otherwise use `CLAUDE.md`. Create `AGENTS.md` when neither file exists.

For example:

```markdown
Packages are deep modules. Read [the package boundary guide](./src/packages/README.md) before adding or importing a package.
```

Done when the package README explains the contract and the repository's agent instructions link to it.

## Adapt the pattern to another stack

Preserve these invariants:

- packages expose explicit, small interfaces
- callers cannot reach private implementation by path
- code inside a package can use its own implementation
- tests exercise public interfaces and keep fixtures private
- dependency cycles fail an automated check
- the boundary check runs in the normal verification command
- a positive fixture passes and deliberate violations fail

Choose the target language's native dependency analyser when it can enforce these invariants. Record any invariant the replacement cannot enforce. Do not claim parity without executable probes.

## Configuration notes

- Dependency-cruiser's `$1` back-reference lets a package reach its own internals while blocking other packages.
- Public and private status comes from path depth, not a hardcoded `lib/` name.
- Packages must be one tier of immediate children under `PACKAGES_ROOT`.
- Package internals may nest to any depth.
- Adding a public entry point means adding a root file, not extending the configuration.
