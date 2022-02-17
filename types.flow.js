// @flow strict

declare type Nest<T> = {
  ghost: T,
  store: T, // ew
  set: ({path: string[], value: any}) => void,
};

declare type CumcacheNest = Nest<{ [string]: Map<string, mixed> }>;

declare type TimeOutFunc = (
  key: string,
  val: mixed,
  time: string,
  since?: number
) => void;
