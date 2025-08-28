export { getUser, UserOutput } from "./lib/getUser";
export { getGuild, DiscordGuildOutput } from "./lib/getGuild";

import * as userModule from "./lib/getUser";
import * as guildModule from "./lib/getGuild";

const commonJSExports = {
  ...userModule,
  ...guildModule,
};

export default commonJSExports;
