import { getFirestore } from "./client";

export interface UserProfile {
  walletAddress: string;
  role: "grower" | "doctor" | "patient" | "dispensary";
  displayName: string;
  createdAt: string;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  const db = getFirestore();
  await db.collection("profiles").doc(profile.walletAddress).set({
    ...profile,
    updatedAt: new Date().toISOString(),
  });
}

export async function getProfile(walletAddress: string): Promise<UserProfile | null> {
  const db = getFirestore();
  const doc = await db.collection("profiles").doc(walletAddress).get();
  if (!doc.exists) return null;
  return doc.data() as UserProfile;
}
