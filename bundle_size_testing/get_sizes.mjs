#!/usr/bin/env -S zx --quiet

const emptyPlugin = "export default { onUnload() {} }";

const testPlugin = (test) =>
  `import {${test}} from "../../src/index";export default { onUnload() {${test}()} }`;

const initManifest = () =>
  $`npm exec sperm init -- -n test -d test -a test -l test -f index.js`;

const tests = ["cumcache"];

// BUILD ALL PLUGINS
for (const test of tests) {
  // go to dir for test
  await $`mkdir ${test}`;
  cd(test);
  // build a plugin
  await initManifest();
  await $`echo ${testPlugin(test)} > index.js`;
  await $`npm exec sperm build`;
  // come back up again
  cd(".");
}


// build a base to test against
await $`mkdir base_comparison`;
cd("base_comparison");
await initManifest();
await $`echo ${emptyPlugin} > index.js`;
await $`npm exec sperm build`;
cd(".");

// get sizes
const sizes = {};
for (const test of [...tests, "base_comparison"]) {
  const {stdout} = await $`du -B 1 --apparent-size ${test}/dist/plugin.js`;
  sizes[test] = parseInt(stdout.split(" ")[0]);
}

for (const test of tests) {
  console.log(`${test}: ${sizes[test] - sizes["base_comparison"]} bytes`);
}

// remove any directories we created
await $`rm -rf ${[...tests, "base_comparison"]}`