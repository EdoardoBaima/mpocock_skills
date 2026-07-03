# Expose upstream `code-review` as `matt-review` in pi

Upstream names the two-axis review skill `code-review`.

Pi already has several review skills and review extensions in circulation. A generic `/skill:code-review` name is easy to confuse with those tools.

We expose Matt Pocock's upstream `code-review` skill as `/skill:matt-review` in `pi-skills/`.

This is a pi-specific naming exception. The upstream source stays `skills/engineering/code-review`, and upstream changes should still be received from there. The pi adaptation lives at `pi-skills/engineering/matt-review` and keeps its frontmatter name as `matt-review`.

References from pi-adapted skills should use `/skill:matt-review`, including `tdd`, `implement`, and `ask-matt`.

Future upstream syncs must map changes from upstream `code-review` into pi `matt-review`, rather than reintroducing a pi `code-review` skill.
