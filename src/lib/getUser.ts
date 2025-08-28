import NodeCache from "node-cache";
import { USER_FLAGS, Flag } from "../funcs/Constants";
import { snowflakeToDate } from "../funcs/snowflakeToDate";
import { timeConverter } from "../funcs/timeConverter";

export interface Avatar {
  id: string | null;
  link: string | null;
  is_animated: boolean;
}

export interface Banner {
  id: string | null;
  link: string | null;
  is_animated: boolean;
  color?: number | null;
}

export interface Clan {
  identity_guild_id?: string;
  identity_enabled?: boolean;
  tag: string;
  badge?: string;
}

export interface UserOutput {
  id: string;
  username: string;
  created_at: string;
  avatar: Avatar | null;
  avatar_decoration?: unknown;
  badges: string[];
  premium_type: string;
  accent_color?: number | null;
  global_name?: string | null;
  banner?: Banner | null;
  clan?: Clan | null;
  raw: any;
}

const userCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

const premiumMap: Record<number, string> = {
  0: "None",
  1: "Nitro Classic",
  2: "Nitro",
  3: "Nitro Basic",
};

export async function getUser(
  userId: string,
  accessToken?: string
): Promise<UserOutput | undefined> {
  if (typeof userId !== "string")
    throw new Error(`A string is expected, but a ${typeof userId} is given.`);
  if (!/^\d+$/.test(userId))
    throw new Error(
      `A number is expected, but "${userId}" contains non-numbers.`
    );

  const cachedUser = userCache.get<UserOutput>(userId);
  if (cachedUser) return cachedUser;

  try {
    const response = await fetch(
      `https://canary.discord.com/api/v10/users/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bot ${accessToken ?? process.env.TOKEN}`,
        },
      }
    );

    const json: any = await response.json();

    if (json.code === 10013)
      throw new Error(`The user ${userId} does not exist or is unavailable.`);

    const publicFlags: string[] = [];
    USER_FLAGS.forEach((flag: Flag) => {
      if (json.public_flags & flag.bitwise) publicFlags.push(flag.flag);
    });

    const avatarLink = json.avatar
      ? `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}?size=480`
      : null;

    const bannerLink = json.banner
      ? `https://cdn.discordapp.com/banners/${json.id}/${json.banner}?size=480`
      : null;

    const createdDate = snowflakeToDate(json.id);

    const output: UserOutput = {
      id: json.id,
      username: json.username,
      created_at: timeConverter(createdDate),
      avatar: json.avatar
        ? {
            id: json.avatar,
            link: avatarLink,
            is_animated: json.avatar?.startsWith("a_") ?? false,
          }
        : null,
      avatar_decoration: json.avatar_decoration_data,
      badges: publicFlags,
      premium_type: premiumMap[Number(json.premium_type)] ?? "None",
      accent_color: json.accent_color ?? null,
      global_name: json.global_name ?? null,
      banner: json.banner
        ? {
            id: json.banner,
            link: bannerLink,
            is_animated: json.banner?.startsWith("a_") ?? false,
            color: json.banner_color ?? null,
          }
        : null,
      clan: json.clan
        ? {
            identity_guild_id: json.clan.identity_guild_id,
            identity_enabled: json.clan.identity_enabled,
            tag: json.clan.tag,
            badge: json.clan.badge,
          }
        : null,
      raw: json,
    };

    userCache.set(userId, output);
    return output;
  } catch (err) {
    console.error("Error fetching user data:", err);
    return undefined;
  }
}
