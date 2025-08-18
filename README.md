# discord-info-lookup

This package utilises the Discord API to retrieve information about users and guilds using the user's or guild's ID. This package also has a function to cache the data in-memory (obviously reset upon restart) for 1 hour to reduce API calls made to the Discord API. Made because I'm unsure if there's an actual package to do this and I can't be assed to look it up.

## Installation

Using NPM:

```bash
npm install discord-info-lookup
```

Or using Bun:

```bash
bun install discord-info-lookup
```

## Usage

```js
const { getUser, getGuild } = require('discord-info-lookup');

const user = await getUser('123456789012345678');
const guild = await getGuild('123456789012345678');

console.log(user);
console.log(guild);
```

## Extra
Recently, added a part in the code to check whether if the string passed only contains numbers and will return an error if it doesn't. No errors will be thrown if the string only contains numbers. But if you pass a string that contains non-numbers, for example, "123abc", an error will be thrown. There's probably a better way to do this check but this works fine for now.