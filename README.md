# CC Tools

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

_Current bundled size: 1025 bytes_

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
import { cumcache } from "cc-tools";

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

_Current bundled size: 1183 bytes_

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
import { boundCumcache } from "cc-tools";

let [cleanup, store] = boundCumcache("my-epic-keyval", "10s");

// set key "hello" to value {world: 5}
store.hello = { world: 5 };
// get key
let x = store.hello; // x === {world: 5}
```
