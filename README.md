# CC Tools

A set of absolutely tiny utilities to add to your Discord plugins.

Type checked with Flow, but no type removal needed,
as annotations comments are used exclusively over standard annotations.

These cannot be built with a standard bundler, they must be imported by sperm.

This is tree-shakable by sperm, so you only get what you use.
Even importing and not using will tree shake it.
So no matter how many tools I stuff into this NPM pkg,
your plugin will never be bloaty because of it. :)

See each tool documented below.