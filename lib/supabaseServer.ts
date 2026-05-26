import { createClient } from "@supabase/supabase-js";
import { createNameSlug, getScatterPosition } from "./positions";
import { memorySites } from "./memorySites";
import type { MessageRow, MessageSubmission, PublicMessage } from "./types";

type StoreState = {
  messages: MessageRow[];
  nextIndex: number;
};

const seedMessages: MessageRow[] = [
  {
    id: "seed-1",
    display_name: "Mina",
    name_slug: "mina",
    message: "Happy birthday. This world feels like a tiny memory garden.",
    avatar: {
      skinColor: "#f5d0b5",
      hairColor: "#2b1b12",
      shirtColor: "#0ea5e9",
      headShape: "round",
      torsoShape: "box",
      hairStyle: "cap",
      eyes: "dots",
      mouth: "smile",
      accessory: "none",
    },
    position_x: 4.1,
    position_y: 0,
    position_z: -3.2,
    approved: true,
    created_at: new Date("2026-01-01T00:00:00Z").toISOString(),
  },
  {
    id: "seed-2",
    display_name: "Jordan",
    name_slug: "jordan",
    message: "Wishing you an easy, bright year ahead.",
    avatar: {
      skinColor: "#d9a066",
      hairColor: "#6b4b3a",
      shirtColor: "#22c55e",
      headShape: "wide",
      torsoShape: "oval",
      hairStyle: "sidePart",
      eyes: "oval",
      mouth: "flat",
      accessory: "glasses",
    },
    position_x: -5.2,
    position_y: 0,
    position_z: 2.8,
    approved: true,
    created_at: new Date("2026-01-01T00:10:00Z").toISOString(),
  },
];

const globalState = globalThis as typeof globalThis & {
  __lawrenceBirthdayStore?: StoreState;
};

function getMemoryStore() {
  if (!globalState.__lawrenceBirthdayStore) {
    globalState.__lawrenceBirthdayStore = {
      messages: [...seedMessages],
      nextIndex: seedMessages.length,
    };
  }

  return globalState.__lawrenceBirthdayStore;
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function toPublicMessage(row: MessageRow): PublicMessage {
  return {
    id: row.id,
    displayName: row.display_name,
    nameSlug: row.name_slug,
    message: row.message,
    avatar: row.avatar,
    position: {
      x: row.position_x ?? 0,
      y: row.position_y ?? 0,
      z: row.position_z ?? 0,
    },
    approved: row.approved,
    createdAt: row.created_at,
  };
}

function isAutoApproveEnabled() {
  return process.env.AUTO_APPROVE_MESSAGES?.toLowerCase() === "true";
}

export async function listPublicMessages() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return getMemoryStore()
      .messages.filter((message) => message.approved)
      .map(toPublicMessage);
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => toPublicMessage(row as MessageRow));
}

export async function listAdminMessages() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return getMemoryStore().messages.map(toPublicMessage);
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => toPublicMessage(row as MessageRow));
}

export async function createMessage(input: MessageSubmission) {
  const supabase = getSupabaseClient();
  const approved = isAutoApproveEnabled();
  const nameSlug = createNameSlug(input.displayName);

  if (!supabase) {
    const store = getMemoryStore();
    const position = getScatterPosition(store.nextIndex);
    const row: MessageRow = {
      id: `local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      display_name: input.displayName,
      name_slug: nameSlug,
      message: input.message,
      avatar: input.avatar,
      position_x: position.x,
      position_y: position.y,
      position_z: position.z,
      approved,
      created_at: new Date().toISOString(),
    };

    store.messages.push(row);
    store.nextIndex += 1;

    return toPublicMessage(row);
  }

  const { count, error: countError } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true });

  if (countError) {
    throw countError;
  }

  const position = getScatterPosition(count ?? 0);

  const payload = {
    display_name: input.displayName,
    name_slug: nameSlug,
    message: input.message,
    avatar: input.avatar,
    position_x: position.x,
    position_y: position.y,
    position_z: position.z,
    approved,
  };

  const { data, error } = await supabase
    .from("messages")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return toPublicMessage(data as MessageRow);
}

export async function approveMessage(id: string) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    const store = getMemoryStore();
    const message = store.messages.find((entry) => entry.id === id);

    if (!message) {
      return null;
    }

    message.approved = true;
    return toPublicMessage(message);
  }

  const { data, error } = await supabase
    .from("messages")
    .update({ approved: true })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return toPublicMessage(data as MessageRow);
}

export async function deleteMessage(id: string) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    const store = getMemoryStore();
    store.messages = store.messages.filter((entry) => entry.id !== id);
    return true;
  }

  const { error } = await supabase.from("messages").delete().eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}

export function getStaticMemorySites() {
  return memorySites.filter((site) => site.enabled);
}
