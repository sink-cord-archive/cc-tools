// @flow strict

// $FlowExpectedError[cannot-resolve-module]
import { getReactInstance } from "@cumcord/utils";
// $FlowExpectedError[cannot-resolve-module]
import { find } from "@cumcord/modules/webpack";

export default (
  node /*: HTMLElement */,
  parent /*: boolean */ = false,
  displayName /*: boolean */ = false
) /*: mixed */ => {
  // NOTE: no recursion limit, but *should* be okay
  const walk = (fiber) =>
    typeof fiber?.type === "string" ||
    (displayName && !fiber?.type?.displayName)
      ? walk(fiber.return)
      : fiber?.type;

  const type = walk(getReactInstance(node));

  return parent ? find((m) => m?.default === type) : type;
};
