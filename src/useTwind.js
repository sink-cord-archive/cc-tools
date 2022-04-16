// @flow strict

/* 
this code is hand-optimised to be as teeny tiny as possible.
you're welcome. sorry for bad looking code as a result.
i = twind injection element
c = twind config element
r = reference count
*/

let windowAlias = window;
let TWIND_DATA_KEY = "cct_tw";

export default () /*: () => void */ => {
  if (windowAlias[TWIND_DATA_KEY]) windowAlias[TWIND_DATA_KEY].r++;
  else {
    const newData = {
      r: 1,
      i: document.createElement("script"),
      c: document.createElement("script"),
    };
    newData.i.type = "module";
    newData.i.src = "https://cdn.skypack.dev/twind/shim";
    newData.c.type = "twind-config";
    newData.c.innerText =
      '{"preflight":false,"theme":{"extend":{"fontFamily":{"sans":"var(--font-primary)","code":"var(--font-code)"}}}}';

    document.head?.appendChild(newData.c);
    document.head?.appendChild(newData.i);
  }

  return () => {
    let twindData = windowAlias[TWIND_DATA_KEY];

    twindData.r--;

    if (twindData.r === 0) {
      twindData.i.remove();
      twindData.c.remove();
      delete windowAlias[TWIND_DATA_KEY];
    }
  };
};
