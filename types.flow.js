// @flow strict

declare type Nest = {
  // $FlowExpectedError[unclear-type]
  ghost: any,
  // $FlowExpectedError[unclear-type]
  store: any, // Proxy<any> didnt like setting
};

declare type TimeOutFunc = (
  key: string,
  val: mixed,
  time: string,
  since?: number
) => void;
