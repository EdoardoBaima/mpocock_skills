# Historical Matt Pocock skills fork

This repository is retired from active maintenance. Personal Pi adaptations now belong to the private `pi_config` configuration repository and are deployed through chezmoi on Windows and WSL.

The final active fork checkpoint is [`5978ae6`](https://github.com/EdoardoBaima/mpocock_skills/tree/5978ae656736c28caa7988ced98ecfea1d83e5c6). It contains upstream Matt Pocock skills through [`959a8e9`](https://github.com/mattpocock/skills/tree/959a8e9f1edc3adbe2f7e3054bb6fbefa6696260), plus the curated Pi adaptations.

The files and Git history remain available for reference. The former sync and inventory tools have been removed. This repository no longer publishes updates or installs personal skills.

## Current maintenance

In `pi_config`:

- `vendor/matt-pocock/` holds the recorded upstream source
- `vendor/matt-pocock.json` records provenance and adaptation decisions
- `home/dot_pi/private_agent/skills/matt-pocock/` owns the maintained personal skills
- `/skill:sync-upstream-skills` reviews upstream changes and updates those skills
- `/skill:skills-inventory-report` checks source and installed content

For the original project, see [Matt Pocock's skills](https://github.com/mattpocock/skills). Upstream material retains its [MIT licence](LICENSE).
