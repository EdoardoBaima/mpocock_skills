// @ts-check
const path = require("path");

// Deep-module enforcement for dependency-cruiser.
//
// Each immediate child of PACKAGES_ROOT is one package. Root files are public
// entry points. Every nested path is private implementation, including the
// conventional `lib/` and `tests/` folders. A package may expose several small
// entry points instead of one large barrel file.
//
// Set both repository-specific paths before using this template. Change the
// resolver extensions only when the repository uses additional source types.

/** Repository-relative directory containing one flat tier of packages. */
const PACKAGES_ROOT = "src/packages";

/** TypeScript configuration that covers every file in the cruise targets. */
const TYPESCRIPT_CONFIG = "tsconfig.json";

// Dependency-cruiser reports repository paths with forward slashes. Escaping
// the configured root keeps punctuation in a real directory name literal.
const R = PACKAGES_ROOT.replace(/\\/g, "/")
  .replace(/^\.\//, "")
  .replace(/\/+$/, "")
  .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Matches anything nested below a package root. It deliberately excludes root
 * files because those files form the package's public interface.
 */
const PACKAGE_INTERNALS = `^${R}/[^/]+/[^/]+/`;

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "entrypoint-boundary-from-app",
      comment:
        "Code outside packages may import package root files, but not files in package subfolders.",
      severity: "error",
      // A file directly under PACKAGES_ROOT is not inside a package.
      from: { pathNot: `^${R}/[^/]+/` },
      to: { path: PACKAGE_INTERNALS },
    },
    {
      name: "entrypoint-boundary-across-packages",
      comment:
        "Files may use their own package internals, but must enter other packages through root files.",
      severity: "error",
      from: { path: `^${R}/([^/]+)/`, pathNot: `^${R}/[^/]+/tests/` },
      to: {
        path: PACKAGE_INTERNALS,
        pathNot: `^${R}/$1/`,
      },
    },
    {
      name: "tests-through-entrypoints",
      comment:
        "Tests may use public entry points and their own test fixtures, but not package implementation internals.",
      severity: "error",
      from: { path: `^${R}/([^/]+)/tests/` },
      to: {
        path: PACKAGE_INTERNALS,
        pathNot: `^${R}/$1/tests/`,
      },
    },
    {
      name: "tests-folder-is-private",
      comment:
        "Only tests may import files from a package's tests folder.",
      severity: "error",
      from: { pathNot: `^${R}/[^/]+/tests/` },
      to: { path: `^${R}/[^/]+/tests/` },
    },
    {
      name: "no-circular",
      comment:
        "Dependencies may not form cycles. Scope this rule to the packages root only after making that exception explicit.",
      severity: "error",
      from: {},
      to: { circular: true },
    },

    // Interface hiding controls how callers enter a package. Layering controls
    // which packages may depend on each other. Add project-specific layering
    // rules here only after the intended dependency direction is documented.
    // {
    //   name: "ui-may-not-depend-on-billing",
    //   severity: "error",
    //   from: { path: `^${R}/ui/` },
    //   to:   { path: `^${R}/billing/` },
    // },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    // dependency-cruiser can resolve a relative nested tsconfig from the wrong
    // directory on Windows. Anchor it to this root configuration explicitly.
    tsConfig: { fileName: path.resolve(__dirname, TYPESCRIPT_CONFIG) },
    enhancedResolveOptions: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    },
  },
};
