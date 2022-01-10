// @flow strict

// $FlowExpectedError[cannot-resolve-module]
import { persist } from "@cumcord/pluginData";

/*::
type TimeOutFunc = (
  key: string,
  val: mixed,
  time: string,
  since?: number
) => void
*/

const broadcastEvent = (cacheName /*: string */) => {
  persist.store[cacheName] = persist.ghost[cacheName];
};

const parseTime = (raw /*: string */) /*: number */ => {
  //TODO: implement a parser for relative human times
};

const timeOut /*: (string) => TimeOutFunc */ =
  (cacheName) =>
  (key, val, time, since = Date.now()) => {
    const store /*: Map<string, mixed> */ = persist.ghost[cacheName];
    store.set(key, [val, since, time]);

    broadcastEvent(cacheName);
  };

function clearTime(cacheName /*: string */) {
  const current = Date.now();
  const store /*: Map<string, mixed> */ = persist.ghost[cacheName];
  Array.from(store.entries()).forEach(([key, val]) => {
    if (
      !Array.isArray(val) ||
      val.length !== 3 ||
      typeof val[1] !== "number" ||
      typeof val[2] !== "string"
    )
      throw new Error("cacheName does not point to a cumcache store");

    if (val[1] + parseTime(val[2]) >= current) store.delete(key);
  });

  broadcastEvent(cacheName);
}

export default function init(
  cacheName /*: string */ = "cumcache"
) /*: [() => void, TimeOutFunc, () => void] */ {
  if (!persist.ghost[cacheName]) persist.store[cacheName] = new Map();
  const cancelTimeoutCode = setTimeout(() => clearTime(cacheName), 5000);
  clearTime(cacheName);
  return [
    () => clearTimeout(cancelTimeoutCode),
    timeOut(cacheName),
    () => clearTime(cacheName),
  ];
}
