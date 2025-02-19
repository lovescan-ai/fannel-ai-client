"use server";

import {
  AutoRespondTo,
  BotSettings,
  Creator,
  CTASettings,
  FollowUpSettings,
  Gender,
  ScheduleItem,
  Subscription,
  User,
} from "@prisma/client";
import prisma from "../db";
import { readUserData } from "./readUser";
import { createClient } from "./server";
import { headers } from "next/headers";
import { Dub } from "dub";
import { LinkSchema } from "dub/dist/commonjs/models/components";
import { isValidUrl } from "../utils";
import { pageTracker } from "../kv/actions";

const dub = new Dub({
  token: process.env.NEXT_PUBLIC_DUB_API_KEY,
});

export const createUser = async (
  email: string,
  id: string,
  fullName: string
): Promise<User> => {
  return prisma.user.create({
    data: { email, id, name: fullName },
  });
};

export const updateUser = async (data: Partial<User>): Promise<User> => {
  const {
    data: { user: userData },
  } = await readUserData();

  if (!userData) {
    throw new Error("User not found");
  }

  return prisma.user.update({
    where: { id: userData.id },
    data,
  });
};

export const getUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

export const getUser = async (): Promise<User | null> => {
  const { data } = await readUserData();
  return prisma.user.findUnique({ where: { id: data.user?.id } });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

export const getCurrentCreator = async (): Promise<Creator | null> => {
  const {
    data: { user },
  } = await readUserData();
  return prisma.creator.findFirst({ where: { userId: user?.id } });
};
export const getCreator = async (userId: string): Promise<Creator | null> => {
  return prisma.creator.findFirst({ where: { userId } });
};

export const getOrCreateCreator = async (userId: string) => {
  const creator = await getCreator(userId);
  if (creator) {
    return creator;
  }
  return createCreator({ creatorName: "", userId });
};

export const disconnectInstagram = async (creatorId: string) => {
  if (!creatorId) {
    throw new Error("Creator ID is required");
  }
  try {
    console.log("Disconnecting Instagram for creator:", creatorId);
    await pageTracker({
      creatorId,
      previousPage: "/dashboard/account",
      isDisconnected: true,
    });
    const response = await prisma.creator.update({
      where: {
        id: creatorId,
      },
      data: {
        connectedCreator: false,
        connectedInstagram: false,
        instagramAccessToken: null,
        instagramAccountId: null,
      },
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to disconnect Instagram: ${error.message}`);
    } else {
      throw new Error(
        "An unexpected error occurred while disconnecting Instagram"
      );
    }
  }
};
interface CreateCreatorParams {
  creatorName: string;
  userId: string;
  gender?: Gender;
  onlyfansUrl?: string;
  instagramAccessToken?: string;
  profileImageUrl?: string;
  instagram_account_id?: string;
  maxCredit?: number;
}

export const createCreator = async ({
  creatorName,
  userId,
  gender,
  onlyfansUrl,
  instagramAccessToken,
  profileImageUrl,
  instagram_account_id,
  maxCredit,
}: CreateCreatorParams): Promise<Creator | null> => {
  const user = await getUserById(userId);
  const subscription = await getSubscriptionById(userId);
  const creators = await getAllCreators(userId);
  if (creators.length >= 5 && subscription?.plan !== "tier-small-agencies") {
    throw new Error(
      "You can't add a creator, please delete the existing creator"
    );
  }
  if (!user) return null;
  let linkSchema: LinkSchema | null = null;

  if (onlyfansUrl) {
    linkSchema = await dub.links.create({
      url: onlyfansUrl,
    });
  }

  const creator = await prisma.$transaction(
    async (tx) => {
      try {
        const creator = await tx.creator.create({
          data: {
            name: creatorName,
            userId: user.id,
            gender,
            onlyFansUrl: linkSchema?.shortLink,
            instagramAccessToken,
            instagramProfileImageUrl: profileImageUrl,
            instagramAccountId: instagram_account_id,
            maxCredit,
            profileImageUrl,
          },
        });

        if (linkSchema) {
          await tx.creatorLink.create({
            data: {
              creatorId: creator.id,
              linkId: linkSchema.id,
              shortLink: linkSchema.shortLink,
              key: linkSchema.key,
            },
          });
        }

        await tx.botSettings.create({
          data: {
            creatorId: creator.id,
            autoRespondTo: AutoRespondTo.ALL,
            greetingMessageDelay: 0,
            followUpMessageDelay: 0,
            messageDelay: 0,
          },
        });
        await tx.cTASettings.create({
          data: {
            creatorId: creator.id,
            ctaButtonLabel: "Subscribe",
          },
        });
        await tx.followUpSettings.create({
          data: {
            creatorId: creator.id,
            followUpButtonLabel: "Spicy 🌶️",
          },
        });

        return creator;
      } catch (error) {
        throw new Error(
          `Failed to create creator: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    {
      timeout: 200000,
      isolationLevel: "Serializable",
    }
  );

  return creator;
};

export const getOrCreateDubLink = async (creatorId: string, url: string) => {
  const link = await prisma.creatorLink.findFirst({
    where: { creatorId: creatorId },
  });

  if (link) {
    return link;
  }

  const linkSchema = await dub.links.create({
    url: url,
  });
  await prisma.creatorLink.create({
    data: {
      creatorId: creatorId,
      linkId: linkSchema.id,
      shortLink: linkSchema.shortLink,
      key: linkSchema.key,
    },
  });
  console.log("Dub link created", linkSchema);
  return linkSchema;
};

export const updateCreator = async (
  creatorId: string,
  data: Partial<Creator>
): Promise<{ success: boolean; creator?: Creator; error?: string }> => {
  console.log("Updating creator", creatorId, data);
  try {
    if (!creatorId) {
      throw new Error("Creator ID is required");
    }
    const existingCreator = await prisma.creatorLink.findFirst({
      where: { creatorId, shortLink: data.onlyFansUrl as string },
    });
    console.log("existingCreator", existingCreator);
    if (
      data.onlyFansUrl !== existingCreator?.shortLink &&
      data.onlyFansUrl &&
      data.onlyFansUrl.length > 0 &&
      isValidUrl(data.onlyFansUrl)
    ) {
      const link = await getOrCreateDubLink(creatorId, data.onlyFansUrl);
      data.onlyFansUrl = link.shortLink;
    }
    const creator = await prisma.creator.update({
      where: { id: creatorId },
      data,
    });
    return { success: true, creator };
  } catch (error) {
    console.error("Error updating creator:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export const updateBot = async (
  creatorId: string,
  data: Partial<BotSettings>
): Promise<BotSettings> => {
  try {
    return prisma.botSettings.update({
      where: { creatorId },
      data,
    });
  } catch (error) {
    throw new Error("Unable to update bot settings");
  }
};

export const createBot = async ({
  creatorId,
}: {
  creatorId: string;
}): Promise<BotSettings> => {
  return prisma.botSettings.create({
    data: {
      creatorId,
      followUpMessageDelay: 0,
      greetingMessageDelay: 0,
      autoRespondTo: AutoRespondTo.ALL,
    },
  });
};

export const createScheduleItem = async (data: {
  scheduleName: string;
  scheduleStart: string;
  scheduleEnd: string;
  scheduleDays: number[];
  botSettingsId: string;
  timeZone: string;
  creatorId: string;
}): Promise<ScheduleItem> => {
  const botSettings = await getBotSettings(data.creatorId);
  console.log("Bot settings:", botSettings);
  if (!botSettings) {
    throw Error("Bot settings not found");
  }

  return prisma.scheduleItem.create({
    data: {
      scheduleName: data.scheduleName || "",
      scheduleStart: data.scheduleStart,
      scheduleEnd: data.scheduleEnd,
      scheduleDays: data.scheduleDays || [],
      timeZone: data.timeZone,
      botSettings: {
        connect: { id: botSettings.id },
      },
    },
  });
};

export const deleteScheduleItem = async (scheduleId: string) => {
  const scheduleItem = await prisma.scheduleItem.delete({
    where: { id: scheduleId },
  });
  return scheduleItem;
};

export const updateScheduleItem = async (
  data: Partial<ScheduleItem>,
  creatorId: string
): Promise<ScheduleItem> => {
  const botSettings = await getBotSettings(creatorId);
  if (!botSettings) {
    throw new Error("Bot settings not found");
  }

  const existingScheduleItem = await prisma.scheduleItem.findUnique({
    where: { id: data.id },
  });

  if (!existingScheduleItem) {
    throw Error(`Schedule item with id ${data.id} not found`);
  }

  return prisma.scheduleItem.update({
    where: { id: data.id },
    data: {
      scheduleName: data.scheduleName,
      scheduleStart: data.scheduleStart,
      scheduleEnd: data.scheduleEnd,
      scheduleDays: data.scheduleDays,
      timeZone: data.timeZone,
      isScheduleEnabled: data.isScheduleEnabled,
      botSettings: {
        connect: { id: botSettings.id },
      },
    },
  });
};

export const getCreatorScheduleItem = async (
  creatorId: string
): Promise<ScheduleItem[] | null> => {
  return await prisma.scheduleItem.findMany({
    where: { botSettings: { creatorId } },
  });
};

export const getScheduleItem = async (
  id: string
): Promise<ScheduleItem | null> => {
  return prisma.scheduleItem.findUnique({ where: { id } });
};

export const getBotSettings = async (
  creatorId: string
): Promise<BotSettings | null> => {
  return prisma.botSettings.findUnique({ where: { creatorId } });
};

export const creatorList = async (): Promise<
  (Creator & { botSettings: BotSettings | null })[] | null
> => {
  const {
    data: { user },
  } = await readUserData();

  if (!user) return null;

  const results = await prisma.creator.findMany({
    where: { userId: user.id },
    include: {
      botSettings: true,
    },
  });
  return results;
};

export const createSubscription = async (
  data: Subscription
): Promise<Subscription> => {
  return prisma.subscription.create({ data });
};

export const updateUserSubscription = async (
  userId: string,
  data: Partial<Subscription>
): Promise<Subscription> => {
  return prisma.subscription.update({
    where: { userId },
    data,
  });
};

export const getSubscriptionByCustomerId = async (
  customerId: string
): Promise<Subscription | null> => {
  const {
    data: { user },
  } = await readUserData();

  if (!user?.id) {
    throw new Error("User ID is missing");
  }

  return prisma.subscription.findUnique({
    where: { userId: user.id, customerId },
  });
};

export const getSubscriptionById = async (
  id: string
): Promise<Subscription | null> => {
  return prisma.subscription.findUnique({
    where: { userId: id },
  });
};

export const getCTASettings = async (
  creatorId: string
): Promise<CTASettings | null> => {
  return prisma.cTASettings.findUnique({ where: { creatorId } });
};

export const updateCTASettings = async (
  creatorId: string,
  data: Partial<CTASettings>
): Promise<CTASettings> => {
  return prisma.cTASettings.update({
    where: { creatorId },
    data,
  });
};

export const getFollowUpSettings = async (
  creatorId: string
): Promise<FollowUpSettings | null> => {
  return prisma.followUpSettings.findUnique({ where: { creatorId } });
};

export const updateFollowUpSettings = async (
  creatorId: string,
  data: Partial<FollowUpSettings>
): Promise<FollowUpSettings> => {
  return prisma.followUpSettings.update({
    where: { creatorId },
    data,
  });
};

export const getCreatorSettings = async (
  creatorId: string
): Promise<{
  ctaSettings: CTASettings | null;
  followUpSettings: FollowUpSettings | null;
}> => {
  const [ctaSettings, followUpSettings] = await Promise.all([
    getCTASettings(creatorId),
    getFollowUpSettings(creatorId),
  ]);

  return { ctaSettings, followUpSettings };
};

export const updateCreatorSettings = async (
  creatorId: string,
  ctaData: Partial<CTASettings>,
  followUpData: Partial<FollowUpSettings>
): Promise<{
  ctaSettings: CTASettings;
  followUpSettings: FollowUpSettings;
}> => {
  const creator = await prisma.creator.findUnique({
    where: { id: creatorId },
    include: {
      ctaSettings: true,
      followUpSettings: true,
    },
  });
  if (!creator) {
    throw new Error("Creator not found");
  }
  return prisma.$transaction(
    async (tx) => {
      if (
        ctaData.ctaButtonLink !== creator.ctaSettings?.ctaButtonLink &&
        ctaData.ctaButtonLink &&
        ctaData.ctaButtonLink.length > 0 &&
        isValidUrl(ctaData.ctaButtonLink)
      ) {
        const ctaTrackableLink = await dub.links.create({
          url: ctaData.ctaButtonLink as string,
        });
        ctaData.ctaButtonLink = ctaTrackableLink.shortLink;
        await tx.creatorLink.create({
          data: {
            creatorId,
            linkId: ctaTrackableLink.id,
            shortLink: ctaTrackableLink.shortLink,
            key: ctaTrackableLink.key,
          },
        });
      }

      if (
        followUpData.followUpButtonLink !==
          creator.followUpSettings?.followUpButtonLink &&
        followUpData.followUpButtonLink &&
        followUpData.followUpButtonLink.length > 0 &&
        isValidUrl(followUpData.followUpButtonLink)
      ) {
        const followUpTrackableLink = await dub.links.create({
          url: followUpData.followUpButtonLink as string,
        });
        followUpData.followUpButtonLink = followUpTrackableLink.shortLink;
        await tx.creatorLink.create({
          data: {
            creatorId,
            linkId: followUpTrackableLink.id,
            shortLink: followUpTrackableLink.shortLink,
            key: followUpTrackableLink.key,
          },
        });
      }

      const ctaSettings = await tx.cTASettings.upsert({
        where: { creatorId },
        update: ctaData,
        create: { creatorId, ...ctaData },
      });

      const followUpSettings = await tx.followUpSettings.upsert({
        where: { creatorId },
        update: followUpData,
        create: { creatorId, ...followUpData },
      });

      return { ctaSettings, followUpSettings };
    },
    {
      timeout: 1000000,
      isolationLevel: "Serializable",
    }
  );
};

export const signInWithPassword = async (email: string, password: string) => {
  try {
    const supabase = createClient();
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {},
    });
    console.log("data", data);
    if (data.user != null && !error) {
      return { redirect: "/dashboard" };
    }
    return {
      redirect: "/auth/signin",
      error: error?.message,
    };
  } catch (error) {
    console.error("Error in handleSignIn:", error);
    return { redirect: "/auth/signin" };
  }
};

export const createUserWithEmail = async (
  email: string,
  password: string,
  fullName: string
) => {
  const origin = headers().get("origin");

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: { full_name: fullName },
    },
  });

  console.log("data", data);
  console.log("error", error);
  return { data, error };
};

export const signUserOut = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const forgotPassword = async (email: string) => {
  try {
    const origin = headers().get("origin");
    if (!origin) {
      throw new Error("Origin header is missing");
    }

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/reset-password`,
    });

    if (error) {
      console.error("Password reset error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error during password reset:", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
};

export const googleSignIn = async () => {
  const origin = headers().get("origin");
  if (!origin) {
    throw new Error("Origin header is missing");
  }
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });
  return { data, error };
};

interface UserMetadata {
  full_name?: string;
  [key: string]: any;
}

interface AuthUserData {
  id: string;
  email: string | undefined;
  user_metadata?: UserMetadata;
}

interface SafeUser {
  id: string;
  email: string;
  name?: string;
}

export const deleteCreator = async (creatorId: string) => {
  const creator = await prisma.creator.delete({
    where: { id: creatorId },
  });
  return creator;
};

async function findOrCreateUser(userData: AuthUserData): Promise<User> {
  try {
    // First try to find user by ID
    let user = await getUserById(userData.id);

    if (!user && userData.email) {
      // Try to find user by email
      user = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (user) {
        // Update existing user's name if needed
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: userData.user_metadata?.full_name || user.name,
          },
        });
      } else if (userData.email) {
        // Check email existence before creating
        // Create new user
        user = await createUser(
          userData.email,
          userData.id,
          userData.user_metadata?.full_name || ""
        );
      }
    }

    if (!user) {
      throw new Error("Failed to create or find user");
    }

    return user;
  } catch (error) {
    console.error("Error in findOrCreateUser:", error);
    throw error;
  }
}

export async function getAllCreators(userId: string) {
  return prisma.creator.findMany({
    where: { userId },
  });
}

async function findOrCreateCreator(user: SafeUser): Promise<Creator | null> {
  try {
    let creator = await getCreator(user.id);

    if (!creator) {
      creator = await createCreator({
        creatorName: user.name || "",
        userId: user.id,
      });
    }

    return creator;
  } catch (error) {
    console.error("Error in findOrCreateCreator:", error);
    throw error;
  }
}

export async function getUserData(): Promise<
  { user: User } | { redirect: string }
> {
  try {
    // Get authenticated user data
    const {
      data: { user: authData },
    } = await readUserData();

    if (!authData) {
      console.log("No authenticated user found");
      throw new Error("No authenticated user found");
    }

    // Find or create user and creator
    const user = await findOrCreateUser({
      id: authData.id,
      email: authData.email,
      user_metadata: authData.user_metadata,
    });

    // Create a safe user object with guaranteed fields
    const safeUser: SafeUser = {
      id: user.id,
      email: user.email || "",
      name: user.name || "",
    };

    console.log("safeUser", safeUser);
    const creator = await findOrCreateCreator(safeUser);

    // Handle various states
    if (!creator) {
      console.log("No creator found for user");
      return { redirect: "/auth/signin" };
    }

    const isAnyInstagramConnected = await prisma.creator.findFirst({
      where: {
        userId: user.id,
        connectedInstagram: true,
      },
    });

    if (!isAnyInstagramConnected) {
      console.log("Creator not connected to Instagram");
      return { redirect: "/auth/connect-social" };
    }

    // redirect to pricing page if user is not subscribed
    const subscription = await getSubscriptionById(user.id);
    if (
      !subscription &&
      user.onboardedDefaultCreator &&
      creator.connectedInstagram
    ) {
      return { redirect: "/auth/pricing" };
    }

    return { user };
  } catch (error) {
    console.error("Error in getUserData:", error);

    if (error instanceof Error) {
      console.error({
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    return { redirect: "/auth/signin" };
  }
}
