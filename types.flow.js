// @flow strict

/************\
|* cumcache *|
\************/

declare type Nest<T> = {
  ghost: T,
  store: T, // ew
  set: ({ path: string[], value: any }) => void,
};

declare type CumcacheNest = Nest<{ [string]: Map<string, mixed> }>;

declare type TimeOutFunc = (
  key: string,
  val: mixed,
  time: string,
  since?: number
) => void;

/************\
|* settings *|
\************/

declare type SettingComponent = ({
  k: string,
  depends: ?string,
  children: string,
}) => mixed;

declare type SelectComponent = ({
  k: string,
  options: { value: mixed, label: string }[],
  depends: ?string,
  children: string,
}) => mixed;