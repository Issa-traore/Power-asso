import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const MEMBER_COOKIE = "wce_member_session";
const TTL_SECONDS = 60 * 60 * 24 * 30;

function secretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export type MemberSessionPayload = { memberId: string; organizationId: string; fullName: string };

export async function createMemberSessionCookie(payload: MemberSessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TTL_SECONDS}s`)
    .sign(secretKey());
  const cookieStore = await cookies();
  cookieStore.set(MEMBER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TTL_SECONDS,
  });
}

export async function getMemberSession(): Promise<MemberSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(MEMBER_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as unknown as MemberSessionPayload;
  } catch {
    return null;
  }
}

export async function clearMemberSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(MEMBER_COOKIE);
}
