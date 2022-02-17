// @flow strict

const dePromisifyPatch = (
  promise /*: Promise<mixed> */,
  patch /*: (mixed) => () => void */
) /*: () => void */ => {
  let cancel = false;
  let unpatch;

  promise.then((SettingsView) => {
    if (!cancel) unpatch = patch(SettingsView);
  });

  return () => {
    unpatch?.();
    cancel = true;
  };
};

export default dePromisifyPatch;
