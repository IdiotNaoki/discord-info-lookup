export { getUser, UserOutput } from "./lib/getUser.js";
export { getGuild, DiscordGuildOutput } from "./lib/getGuild.js";
import * as userModule from "./lib/getUser.js";
import * as guildModule from "./lib/getGuild.js";

const commonJSExports = {
  ...userModule,
  ...guildModule,
};

export default commonJSExports;