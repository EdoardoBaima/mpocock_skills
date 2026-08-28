#!/usr/bin/env node
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { homedir, platform } from 'node:os';

const args = process.argv.slice(2);
const noOpen = args.includes('--no-open');
const outputArgIndex = args.indexOf('--output');
const outputPath = resolve(outputArgIndex >= 0 ? args[outputArgIndex + 1] : 'docs/skills-inventory-report.html');
const repoRoot = process.cwd();

// Runtime-only policies distinguish deliberate platform scope from unmanaged drift.
// These skills should stay outside the shared Windows/WSL chezmoi source.
const intentionalRuntimeOnlySkills = {
  'inventor-interop': 'Windows-only: Autodesk Inventor and its interop assembly are unavailable on WSL.',
};

const sources = {
  upstream: { label: 'Upstream', description: 'upstream/main skills/', paths: gitSkillFiles('upstream/main', 'skills') },
  branchSkills: { label: 'Branch skills/', description: 'Current branch upstream copy', paths: repoSkillFiles('skills') },
  branchPi: { label: 'Branch pi-skills/', description: 'Curated pi adaptation layer', paths: repoSkillFiles('pi-skills') },
  branchDotPi: { label: 'Branch .pi/skills/', description: 'Repo-local pi skills', paths: repoSkillFiles('.pi/skills') },
  chezmoi: { label: 'Chezmoi', description: '~/.local/share/chezmoi/home/dot_pi/agent/skills/', paths: fsSkillFiles(join(homedir(), '.local/share/chezmoi/home/dot_pi/agent/skills')) },
  runtime: { label: 'Runtime', description: '~/.pi/agent/skills/', paths: fsSkillFiles(join(homedir(), '.pi/agent/skills')) },
};

const index = Object.fromEntries(Object.entries(sources).map(([key, source]) => [key, mapSkills(source.paths, key)]));
const allNames = [...new Set(Object.values(index).flatMap((skills) => Object.keys(skills)))].sort((a, b) => a.localeCompare(b));
const rows = allNames.map((name) => buildRow(name));
const counts = Object.fromEntries(Object.entries(index).map(([key, skills]) => [key, Object.keys(skills).length]));
const generatedAt = new Date().toISOString();

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, renderHtml({ rows, counts, generatedAt }), 'utf8');
console.log(`Wrote ${relative(repoRoot, outputPath)}`);

if (!noOpen) openInBrowser(outputPath);

function gitSkillFiles(ref, prefix) {
  try {
    const out = execFileSync('git', ['ls-tree', '-r', '--name-only', ref], { encoding: 'utf8' });
    return out.split('\n').filter(Boolean).filter((file) => file.startsWith(`${prefix}/`) && file.endsWith('/SKILL.md'));
  } catch (error) {
    return [];
  }
}

function repoSkillFiles(prefix) {
  const root = resolve(repoRoot, prefix);
  if (!existsSync(root)) return [];
  const files = [];
  walk(root, files);
  return files
    .filter((file) => file.replaceAll('\\', '/').endsWith('/SKILL.md'))
    .map((file) => relative(repoRoot, file).replaceAll('\\', '/'));
}

function fsSkillFiles(root) {
  if (!existsSync(root)) return [];
  const files = [];
  walk(root, files);
  return files.filter((file) => file.replaceAll('\\', '/').endsWith('/SKILL.md'));
}

function walk(dir, files) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const entryPath = join(dir, entry.name);
    if (entry.isDirectory()) walk(entryPath, files);
    else files.push(entryPath);
  }
}

function mapSkills(paths, sourceKey) {
  const result = {};
  for (const skillPath of paths) {
    const parts = skillPath.replaceAll('\\', '/').split('/');
    const name = parts.at(-2);
    result[name] = {
      path: skillPath,
      topic: topicFor(skillPath, sourceKey),
      description: readDescription(skillPath, sourceKey),
    };
  }
  return result;
}

function topicFor(skillPath, sourceKey) {
  const parts = skillPath.replaceAll('\\', '/').split('/');
  if (parts[0] === 'skills' || parts[0] === 'pi-skills') return parts[1] ?? 'unknown';
  if (parts[0] === '.pi') return '.pi/skills';
  if (sourceKey === 'chezmoi') return 'chezmoi-local';
  if (sourceKey === 'runtime') return 'runtime-local';
  return 'local';
}

function readDescription(skillPath, sourceKey) {
  try {
    let content;
    if (sourceKey === 'upstream') {
      content = execFileSync('git', ['show', `upstream/main:${skillPath}`], { encoding: 'utf8' });
    } else if (sourceKey.startsWith('branch')) {
      content = readFileSync(resolve(repoRoot, skillPath), 'utf8');
    } else {
      content = readFileSync(skillPath, 'utf8');
    }
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    return match ? frontmatterDescription(match[1]) : '';
  } catch {
    return '';
  }
}

function frontmatterDescription(frontmatter) {
  const lines = frontmatter.replaceAll('\r\n', '\n').split('\n');
  const descriptionIndex = lines.findIndex((line) => line.startsWith('description:'));
  if (descriptionIndex < 0) return '';

  const value = lines[descriptionIndex].slice('description:'.length).trim();
  if (!/^[>|][+-]?$/.test(value)) return parseInlineYamlScalar(value);

  const blockLines = [];
  for (const line of lines.slice(descriptionIndex + 1)) {
    if (line && !/^\s/.test(line)) break;
    blockLines.push(line.trim());
  }
  return blockLines.join(' ').replace(/\s+/g, ' ').trim();
}

function parseInlineYamlScalar(value) {
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      return value.slice(1, -1);
    }
  }
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replaceAll("''", "'");
  return value;
}

function buildRow(name) {
  const present = Object.fromEntries(Object.keys(sources).map((key) => [key, Boolean(index[key][name])]));
  const topics = [...new Set(Object.values(index).map((skills) => skills[name]?.topic).filter(Boolean))];
  const runtimeOnlyReason = intentionalRuntimeOnlySkills[name] ?? '';
  if (runtimeOnlyReason) topics.push('windows-only');
  const paths = Object.fromEntries(Object.keys(sources).map((key) => [key, index[key][name]?.path ?? '']));
  const curatedLocations = Object.fromEntries(Object.keys(sources).map((key) => [key, curatedSkillLocation(paths[key], key)]));
  const descriptions = Object.values(index).map((skills) => skills[name]?.description).filter(Boolean);
  return { name, present, topics, paths, curatedLocations, description: descriptions[0] ?? '', runtimeOnlyReason };
}

function curatedSkillLocation(skillPath, sourceKey) {
  const normalizedPath = skillPath.replaceAll('\\', '/');
  if (sourceKey === 'branchPi') return normalizedPath.replace(/^pi-skills\//, '');
  if (sourceKey !== 'chezmoi' && sourceKey !== 'runtime') return '';
  const namespaceMarker = '/matt-pocock/';
  const markerIndex = normalizedPath.indexOf(namespaceMarker);
  return markerIndex >= 0 ? normalizedPath.slice(markerIndex + namespaceMarker.length) : '';
}

function renderHtml({ rows, counts, generatedAt }) {
  const sourceKeys = Object.keys(sources);
  const curatedMissingChezmoi = rows.filter((row) => row.present.branchPi && !row.present.chezmoi).map((row) => row.name);
  const curatedChezmoiPathDrift = rows.filter((row) => row.present.branchPi && row.present.chezmoi && row.curatedLocations.branchPi !== row.curatedLocations.chezmoi).map((row) => row.name);
  const curatedRuntimePathDrift = rows.filter((row) => row.present.branchPi && row.present.runtime && row.curatedLocations.branchPi !== row.curatedLocations.runtime).map((row) => row.name);
  const chezmoiOnly = rows.filter((row) => row.present.chezmoi && !row.present.branchPi && !row.present.upstream).map((row) => row.name);
  const runtimeMissingChezmoi = rows.filter((row) => row.present.chezmoi && !row.present.runtime).map((row) => row.name);
  const runtimeOnly = rows.filter((row) => row.present.runtime && !row.present.chezmoi && !row.runtimeOnlyReason).map((row) => row.name);
  const intentionalRuntimeOnly = rows.filter((row) => row.present.runtime && !row.present.chezmoi && row.runtimeOnlyReason);
  const platformScopedInChezmoi = rows.filter((row) => row.present.chezmoi && row.runtimeOnlyReason).map((row) => row.name);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Skills Inventory Report</title>
<style>
:root { color-scheme: light dark; --bg:#0f172a; --panel:#111827; --text:#e5e7eb; --muted:#94a3b8; --line:#334155; --yes:#22c55e; --no:#475569; --warn:#f59e0b; --accent:#38bdf8; }
body { margin:0; font-family: Inter, ui-sans-serif, system-ui, Segoe UI, sans-serif; background:linear-gradient(135deg,#020617,#111827); color:var(--text); }
main { max-width:1400px; margin:auto; padding:32px; }
h1 { font-size:42px; margin:0 0 8px; } h2 { margin-top:34px; } p { color:var(--muted); }
.cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:14px; margin:24px 0; }
.card { background:rgba(17,24,39,.85); border:1px solid var(--line); border-radius:18px; padding:18px; box-shadow:0 10px 30px rgba(0,0,0,.25); }
.card .num { font-size:34px; font-weight:800; color:var(--accent); }
.alerts { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:14px; }
.alert { border:1px solid var(--line); border-left:5px solid var(--warn); background:rgba(15,23,42,.85); border-radius:14px; padding:14px; }
.table-wrap { overflow:auto; border:1px solid var(--line); border-radius:18px; background:rgba(15,23,42,.75); }
table { width:100%; border-collapse:collapse; font-size:14px; }
th,td { padding:10px 12px; border-bottom:1px solid var(--line); vertical-align:top; } th { position:sticky; top:0; background:#111827; text-align:left; z-index:1; }
.badge { display:inline-block; border-radius:999px; padding:2px 8px; margin:2px; background:#1e293b; color:#cbd5e1; border:1px solid #334155; font-size:12px; }
.yes { color:var(--yes); font-weight:800; } .no { color:var(--no); } code { color:#bae6fd; }
.paths { font-size:12px; color:var(--muted); max-width:360px; } .desc { color:#cbd5e1; max-width:420px; }
footer { margin:28px 0; color:var(--muted); font-size:12px; }
@media (prefers-color-scheme: light) { :root { --bg:#f8fafc; --panel:#fff; --text:#0f172a; --muted:#475569; --line:#cbd5e1; } body { background:linear-gradient(135deg,#f8fafc,#e0f2fe); } th { background:#e2e8f0; } .card,.alert,.table-wrap { background:rgba(255,255,255,.86); } }
</style>
</head>
<body><main>
<h1>Skills Inventory Report</h1>
<p>Comparison of upstream, this branch, curated pi skills, chezmoi source, and installed runtime skills. Generated ${escapeHtml(generatedAt)}.</p>
<section class="cards">${sourceKeys.map((key) => `<div class="card"><div>${escapeHtml(sources[key].label)}</div><div class="num">${counts[key]}</div><p>${escapeHtml(sources[key].description)}</p></div>`).join('')}</section>
<section class="alerts">
${alertBlock('Curated pi skills missing from chezmoi', curatedMissingChezmoi)}
${alertBlock('Curated pi skills at stale chezmoi paths', curatedChezmoiPathDrift)}
${alertBlock('Curated pi skills at stale runtime paths', curatedRuntimePathDrift)}
${alertBlock('Chezmoi local-only skills', chezmoiOnly)}
${alertBlock('Chezmoi skills missing from runtime install', runtimeMissingChezmoi)}
${alertBlock('Unexpected runtime skills missing from chezmoi', runtimeOnly)}
${runtimePolicyBlock('Intentional platform-specific runtime skills', intentionalRuntimeOnly)}
${alertBlock('Platform-specific runtime skills incorrectly in shared chezmoi', platformScopedInChezmoi)}
</section>
<h2>Skill matrix</h2>
<div class="table-wrap"><table><thead><tr><th>Skill</th><th>Macro folder / topic</th>${sourceKeys.map((key) => `<th>${escapeHtml(sources[key].label)}</th>`).join('')}<th>Description</th><th>Paths</th></tr></thead><tbody>
${rows.map((row) => `<tr><td><strong>${escapeHtml(row.name)}</strong></td><td>${row.topics.map((topic) => `<span class="badge">${escapeHtml(topic)}</span>`).join('')}</td>${sourceKeys.map((key) => `<td class="${row.present[key] ? 'yes' : 'no'}">${row.present[key] ? 'yes' : '-'}</td>`).join('')}<td class="desc">${escapeHtml(row.description)}</td><td class="paths">${sourceKeys.map((key) => row.paths[key] ? `<div><strong>${escapeHtml(sources[key].label)}:</strong> <code>${escapeHtml(row.paths[key])}</code></div>` : '').join('')}</td></tr>`).join('\n')}
</tbody></table></div>
<footer>Generated by <code>/skill:skills-inventory-report</code>. Re-run the script to update this persisted HTML file.</footer>
</main></body></html>`;
}

function alertBlock(title, names) {
  return `<div class="alert"><strong>${escapeHtml(title)}</strong><p>${names.length ? names.map((name) => `<span class="badge">${escapeHtml(name)}</span>`).join('') : 'None'}</p></div>`;
}

function runtimePolicyBlock(title, rows) {
  const details = rows.map((row) => `<span class="badge">${escapeHtml(row.name)}</span> ${escapeHtml(row.runtimeOnlyReason)}`).join('<br>');
  return `<div class="alert"><strong>${escapeHtml(title)}</strong><p>${details || 'None'}</p></div>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function openInBrowser(file) {
  const target = `file://${file.replaceAll('\\', '/')}`;
  const command = platform() === 'win32' ? 'cmd' : platform() === 'darwin' ? 'open' : 'xdg-open';
  const commandArgs = platform() === 'win32' ? ['/c', 'start', '', target] : [target];
  const child = spawn(command, commandArgs, { detached: true, stdio: 'ignore' });
  child.unref();
}
