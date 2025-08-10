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