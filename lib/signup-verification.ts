import crypto from "crypto";

type VerificationPayload = {
  email: string;
  exp: number;
};

function base64url(input: string) {
  return Buffer.from(input).toString("base64url");
}

export function signVerificationToken(email: string, expiresInSeconds = 600) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is missing");
  }

  const payload: VerificationPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = crypto.createHmac("sha256", secret).update(encodedPayload).digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function verifyVerificationToken(token: string): VerificationPayload | null {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = crypto.createHmac("sha256", secret).update(encodedPayload).digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as VerificationPayload;

  if (!payload.email || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}
