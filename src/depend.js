// @flow strict

// based on command palette depend.js, previously located at
// https://github.com/yellowsink/discord-command-palette/blob/2b18023087ca5b7cef5f599cc62f3919f909bc57/depend.js

// $FlowExpectedError[cannot-resolve-module]
import { loaded } from "@cumcord/plugins";

export default (
  urls /*: string[] */,
  patch /*: () => ?() => void */
) /*: () => void */ => {
    
  // users arent this dumb are they?
  /* urls.forEach((v, i) => {
    if (!v.endsWith("/")) urls[i] += "/";
  }); */

  let unpatch = urls.some((v) => loaded.ghost.hasOwnProperty(v))
    ? patch() // if plugin loaded, run patch right now
    : null;

  const setListener = (eventType, { path }) => {
    if (urls.includes(path[0])) {
      unpatch?.();
      unpatch = patch();
    }
  };

  const deleteListener = (eventType, { path }) => {
    if (urls.includes(path[0])) {
      unpatch?.();
      unpatch = null;
    }
  };

  loaded.on("SET", setListener);
  loaded.on("DELETE", deleteListener);

  return () => {
    unpatch?.();
    loaded.off("SET", setListener);
    loaded.off("DELETE", deleteListener);
  };
};
