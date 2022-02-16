// @flow strict
// $FlowExpectedError[cannot-resolve-module]
import { findByDisplayName } from "@cumcord/modules/webpack";
// $FlowExpectedError[cannot-resolve-module]
import { after } from "@cumcord/patcher";

// note: https://lists.sr.ht/~creatable/cumcord-devel/patches/29496
// $FlowExpectedError[cannot-resolve-module]
import { settingsReady } from "@cumcord/ui";
const patchWithPromise = (patch) => {
    let cancel = false;
    let unpatch;

    settingsReady.then((SettingsView) => {
        if (!cancel) unpatch = patch(SettingsView);
    });

    return () => {
        unpatch?.();
        cancel = true;
    };
};

const patchManually = (patch) => {
    let cancel = false;
    let unpatch;
    let ftUnpatch /*: () => void */ = after(
        "default",
        findByDisplayName("FormText", false),
        () => {
            let SettingsView = findByDisplayName("SettingsView");
            if (!SettingsView) return;

            ftUnpatch();
            if (!cancel) unpatch = patch(SettingsView);
        }
    );

    return () => {
        cancel = true;
        unpatch?.();
    };
};

export default (patch /*: (mixed) => () => void */) /*: () => void */ => {
    let SettingsView /*: mixed */;
    if ((SettingsView = findByDisplayName("SettingsView")))
        return patch(SettingsView);

    if (settingsReady) return patchWithPromise(patch);

    return patchManually(patch);
};
