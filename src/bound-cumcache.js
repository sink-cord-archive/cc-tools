// @flow strict
import cumcache from "./cumcache";
// $FlowExpectedError[cannot-resolve-module]
import { persist } from "@cumcord/pluginData";

export default function init(
  cacheName /*: string */,
  timeOut /*: string */,
  nest /*: Nest */ = persist
) /*: [() => void, Proxy<mixed>, () => void] */ {
  const [cleanup, timeout, readonlyStore, forceStoreClear] = cumcache(
    cacheName,
    nest
  );

  const proxy = new Proxy(readonlyStore, {
    // $FlowExpectedError[prop-missing]
    get: (_, key) => readonlyStore[key],
    // $FlowExpectedError[prop-missing]
    deleteProperty: (_, key) => delete readonlyStore[key],

    set: (_, key, val) => {
      timeout(key, val, timeOut);
      return true;
    },
  });

  return [cleanup, proxy, forceStoreClear];
}
