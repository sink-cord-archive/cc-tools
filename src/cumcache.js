// @flow strict

// make flow happy with lodash
const _ = window._;

// $FlowExpectedError[cannot-resolve-module]
import { persist } from "@cumcord/pluginData";

/*::
type Nest = {
  // $FlowExpectedError[unclear-type]
  ghost: any,
  // $FlowExpectedError[unclear-type]
  store: any, // Proxy<any> didnt like setting
}
*/

/*::
type TimeOutFunc = (
  key: string,
  val: mixed,
  time: string,
  since?: number
) => void
*/

const broadcastEvent = (cacheName /*: string */, nest /*: Nest */) => {
  nest.store[cacheName] = nest.ghost[cacheName];
};

const parseTime = (raw /*: string */) /*: number */ => {
  const timeNum = parseFloat(raw.slice(0, -1));

  switch (_.last(raw)) {
    case "s":
      return timeNum * 1000;

    case "m":
      return timeNum * 1000 * 60;

    case "h":
      return timeNum * 1000 * 60 * 60;

    case "d":
      return timeNum * 1000 * 60 * 60 * 24;

    case "w":
      return timeNum * 1000 * 60 * 60 * 24 * 7;

    case "y":
      return timeNum * 1000 * 60 * 60 * 24 * 365;

    default:
      throw new Error(`time unit ${_.last(raw)} is not recognised`);
  }
};

const timeOut /*: (string, Nest) => TimeOutFunc */ =
  (cacheName, nest) =>
  (key, val, time, since = Date.now()) => {
    const store /*: Map<string, mixed> */ = nest.ghost[cacheName];
    store.set(key, [val, since + parseTime(time)]);

    broadcastEvent(cacheName, nest);
  };

function clearTime(cacheName /*: string */, nest /*: Nest */) {
  const current = Date.now();
  const store /*: Map<string, mixed> */ = nest.ghost[cacheName];
  for (const [key, val] of store.entries()) {
    if (!Array.isArray(val) || val.length !== 2 || typeof val[1] !== "number")
      throw new Error("cacheName does not point to a cumcache store");

    if (val[1] >= current) store.delete(key);
  }

  broadcastEvent(cacheName, nest);
}

const getProxy = (
  cacheName /*: string */,
  nest /*: Nest */
) /*: Proxy<mixed> */ =>
  new Proxy(nest.ghost[cacheName], {
    get: (_, prop) => nest.ghost[cacheName].get(prop)?.[0],
  });

export default function init(
  cacheName /*: string */ = "cumcache",
  nest /*: Nest */ = persist
) /*: [() => void, TimeOutFunc, Proxy<mixed>, () => void] */ {
  if (!nest.ghost[cacheName]) nest.store[cacheName] = new Map();
  const cancelTimeoutCode = setInterval(() => clearTime(cacheName, nest), 5000);
  clearTime(cacheName, nest);
  return [
    () => clearInterval(cancelTimeoutCode),
    timeOut(cacheName, nest),
    getProxy(cacheName, nest),
    () => clearTime(cacheName, nest),
  ];
}
