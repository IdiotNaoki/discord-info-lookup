export { getUser } from "./lib/getUser";
export { getGuild } from "./lib/getGuild";

import * as userModule from "./lib/getUser";
import * as guildModule from "./lib/getGuild";

const commonJSExports = {
  ...userModule,
  ...guildModule,
};

module.exports = commonJSExports;
