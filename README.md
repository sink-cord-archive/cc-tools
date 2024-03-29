# CC Tools

> **Warning** |
> This repo depends, directly or indirectly, on [Cumcord](https://github.com/Cumcord).
> Cumcord [has reached end of life](https://cumcord.com/an-exercise-in-futility) and is not supported.  
> As such, this project is now discontinued.  
> **EVERYTHING HERE IS NOW LICENSED UNDER THE [UNLICENSE](https://unlicense.org) AS OF 2022-10-19**

A set of absolutely tiny utilities to add to your Discord plugins.

Type checked with Flow, but no type removal needed,
as annotations comments are used exclusively over standard annotations.

These cannot be built with a standard bundler, they must be imported by sperm.

This is tree-shakable by sperm, so you only get what you use.
Even importing and not using will tree shake it.
So no matter how many tools I stuff into this NPM pkg,
your plugin will never be bloaty because of it. :)

See each tool documented below.

## Cumcache

_Current bundled size: 1033 bytes_

A keyval store that sits on top of your persist nest (or any other nest!) and allows setting expiry times for each pair.

Init the store as follows:

```js
import { cumcache } from "cumcord-tools";

// calling cumcache inits the store, only do this ONCE unless you uninit/cleanup it afterwards
// cumcache takes the key in the nest to use, defaults to cumcache, and a nest, defaults to the persist nest.
// as should be obvious by the fact they have defaults, both these args are optional.

// as JS array destructuring works, feel free to just destructure to [cleanup, timeOut, store]
// use of forceStoreClear is not recommended.
let [cleanup, timeOut, store, forceStoreClear] = cumcache("my-epic-keyval");
```

Then call `cleanup()` once you're done with the store, MAKE SURE YOU DO THIS (usually in your onUnload)

Call `forceStoreClear()` to force removing expired entries.
This is almost never necessary as cumcache clears for you periodically (as of writing this, 5 seconds).

Call `timeOut(key, val, time)` to set a key in the store - it sets key to val, and sets the pair to delete after time.

It has an optional 4th parameter: the time to start counting from.
This is useful if you have past data you need to apply a consistent expiry to.
It defaults to the current time.

The acceptable time values are any number, int or float, followed by a one letter suffix:

- `1s` = 1 second
- `1m` = 1 minute
- `1h` = 1 hour
- `1d` = 1 day
- `1w` = 1 week
- `1y` = 1 year

`store` is a proxy allowing you to get values and `delete` values. Setting is not allowed.

```js
import { cumcache } from "cumcord-tools";

let [cleanup, timeOut, store] = cumcache("my-epic-keyval");

/* 
nest.ghost: {
    cumcache: {
        // this isnt the actual content, for simplicity's sake just the keys and values are shown
    }
}
*/

// sets key hello to value {world:5}, and clears after 10 seconds
timeOut("hello", { world: 5 }, "10s");

let val = store.hello; // val = { world: 5 }

/* 
nest.ghost: {
    cumcache: {
        hello: { world: 5 }
    }
}
*/

// after waiting 10 seconds

/* 
nest.ghost: {
    cumcache: {
    }
}
*/

// im done
cleanup();
// the nest will remain in the state it was in at the time of cleanup
// keys will persist in memory and any that expire while cumcache
// is inactive will be cleared the next time cumcache is inited on the same key.
```

## Bound Cumcache

_Current bundled size: 1191 bytes_

Cumcache packs a huge amount of flexibility into its small footprint, however much of it is likely to go unused.

Specifically, in actual usage, most people do not set a custom `since` date (it can be left blank anyway),
and most will want to use the same expiry for everything in that particular cache.

Bound cumcache takes these two freedoms away from individual key-val pairs,
instead allowing just the expiry time to be set when initing the cache.

In return, the timeout method is replaced by making the store you read from also writable.
The stock cumcache store allows deleting but not setting.
Bound cumcache allows setting, which will use the expiry set in the init.

Just as in stock cumcache, you can also get a func to force remove expired functions, but it is not recommended:
`let [cleanup, store, forceStoreClear] = boundCumcache(...)`.

```js
import { boundCumcache } from "cumcord-tools";

let [cleanup, store] = boundCumcache("my-epic-keyval", "10s");

// set key "hello" to value {world: 5}
store.hello = { world: 5 };
// get key
let x = store.hello; // x === {world: 5}
```

## Find by DOM node

_Current bundled size: 229 bytes_

This tool is highly discouraged except for testing -
you should use a better method to locate modules and not rely on the DOM,
but its here if you need it.

This tool finds a react component from the DOM element.
It optionally gets the module containing the component.

You may optionally require that the element must have a display name.
This will ignore any anonymous components and only get named elements.

```jsx
import { findByDomNode } from "cumcord-tools"
let domNode = /* get a dom node of a component */
let Component = findByDomNode(domNode);
<Component />

// allow strings (div etc)
let ComponentParent = findByDomNode(domNode, true);
ComponentParent === { default: Component }

// must have display name
let ActualComponent = findByDomNode(domNode, false, true);
// <ActualComponent><Component /></ActualComponent>
// where Component is anonymous and ActualComponent is exported
```

## Depend

_Current bundled size: 370 bytes_

Depend is a tool to depend on another plugin's side effects,
while allowing both your code and the depended upon plugin to unload and re-load freely.

A good use case is where plugins export an API on window thats only there while the plugin is loaded.

```js
import { depend } from "cumcord-tools";
let pluginsToDependOn = [
	"https://example.com/cool-plugin/",
	"https://cumcordplugins.github.io/Condom/example.com/cool-plugin/",
];

let undepend = depend(pluginsToDependOn, () => {
	console.log(
		"One of the plugins listed has been loaded, or already was loaded"
	);
	// let unpatch = after("cool_function", obj, () => {/* ... */});

	// this return is optional, returning nothing will simply not bother
	return () => {
		console.log("One of the plugins listed has been unloaded.");
		// cleanup stuff in here.
		// unpatch();
	};
});

// i'm done with this code and wish to stop listening for dep un/load events, and cleanly finish
undepend();
```

## Settings

_Current bundled size: 1522 bytes, tree-shakes down further_

CC tools has a full api designed to make working with settings as easy as possible.

Use the tools here correctly and then simply read from the ghost,
and write to the store if you need any more complex settings modification.

### `setDefaults`

This allows you to set defaults for any `undefined` nest keys:

```js
import { setDefaults } from "cumcord-tools";
setDefaults({
	anOption: true,
	anotherOption: false,
	aValue: 5,
});
```

### `dependPersist`

Makes a given component rerender on nest change

```jsx
import { dependPersist } from "cumcord-tools";

export const settings = dependPersist(() => <>{/* settings here */}</>);
```

### Settings components

All settings components have the following props:

- `k` (string) - The key on the nest
- `children` (React component) - The label text
- `depends` (optional string) - If present, the key to require to be truthy to enable this setting

The select component also has

- `options` (`{value:any, label:string}`) - The list of options to select from. No selection = undefined

They are as follows:

- `SSwitch`: a switch.
- `SText`: a textbox.
- `SSelect`: a dropdown selection box.

```jsx
export const Settings = (
	<SettingsRoot>
		<SSwitch k="details">Show user details</SSwitch>
		<SText k="name" depends="details">
			User name
		</SText>

		<SSelect
			k="utype"
			depends="details"
			options={[
				{ value: "NORMAL", label: "Normal user" },
				{ value: "ADMIN", label: "Administrator" },
				{ value: "SADMIN", label: "Super Admin" },
			]}
		>
			User type
		</SSelect>
	</SettingsRoot>
);
```
