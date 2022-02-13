// @flow strict
/*
 * patches the context menus lazily.
 * THIS CODE IS REFACTORED FROM
 * https://github.com/swishs-client-mod-plugins/cumcord-plugins/blob/5f81c10857b20741272a8d7b6becec3cc29f0520/plugins/pronoun-bio-scraper/apis/Patcher.js
 * -- sink
 */

/*::
type PatcherReturn = () => void;
type PatchFunc = (mixed) => PatcherReturn;
type ExportFunc = (string, PatchFunc) => PatcherReturn;
type DefaultExport = (string, string, PatchFunc) => PatcherReturn;
*/

// $FlowExpectedError[cannot-resolve-module]
import { before } from "@cumcord/patcher";
// $FlowExpectedError[cannot-resolve-module]
import { findByDisplayName, findByProps } from "@cumcord/modules/webpack";

let patches /*: [symbol, PatcherReturn][] */ = [];

const curriedPatch = (lazyModule) => (displayName, patch) => {
  // used in unpatch logic
  const id = Symbol();
  let cancelPatch = false;

  const module /*: mixed */ = findByDisplayName(displayName, false);

  // if the webpack module already exists, just patch it
  if (module != undefined) {
    patches.push([id, patch(module)]);
  } else {
    // patch the module that lazily loads what we want
    const unpatchLazyPatch /*: () => void */ = before(
      lazyModule,
      findByProps(lazyModule),
      (args /*: [mixed, (mixed) => Promise<(mixed) => mixed>] */) => {
        // modify the lazy render to run the desired patch, and remove this one
        const lazyRender = args[1];
        args[1] = async () => {
          const render = await lazyRender(args[0]);

          return (config /*: mixed */) => {
            const menu = render(config);

            // $FlowExpectedError[incompatible-use]
            if (menu?.type?.displayName === displayName && patch) {
              unpatchLazyPatch();
              if (!cancelPatch)
                patches.push([
                  id,
                  patch(findByDisplayName(displayName, false)),
                ]);
              // $FlowExpectedError[reassign-const]
              patch = false;
            }

            return menu;
          };
        };
        return args;
      }
    );
  }

  return () => {
    // remove patch and call it too
    patches = patches.filter((p) => (p[0] === id ? (p[1](), false) : true));
    // if unpatching before the module is lazy loaded
    // this makes it not patch in the first place
    // else we'd be too late by unpatching it here
    cancelPatch = true;
  };
};

const patchContextMenu /*: ExportFunc */ = curriedPatch("openContextMenuLazy");

const patch /*: DefaultExport */ = (lazyModule, displayName, patch) => curriedPatch(lazyModule)(displayName, patch);

export default { patch, patchContextMenu };
