import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const INDEX_KEY = "index.json";

/** 버킷 루트 또는 저장소와 동일한 `content/r2-seed/` 접두 경로 */
export const INDEX_KEY_CANDIDATES = [
  "index.json",
  "content/r2-seed/index.json",
] as const;

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_R2_ACCOUNT_ID &&
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
      process.env.CLOUDFLARE_R2_BUCKET_NAME,
  );
}

export function getR2Client(): S3Client {
  const accountId = requireEnv("CLOUDFLARE_R2_ACCOUNT_ID");
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("CLOUDFLARE_R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("CLOUDFLARE_R2_SECRET_ACCESS_KEY"),
    },
  });
}

export function getBucket(): string {
  return requireEnv("CLOUDFLARE_R2_BUCKET_NAME");
}

export { INDEX_KEY };

export function setObjectKey(slug: string): string {
  return `sets/${slug}.json`;
}

export function setObjectKeyCandidates(slug: string): string[] {
  const safe = slug.replace(/[/\\]/g, "");
  if (!safe) return [];
  return [`sets/${safe}.json`, `content/r2-seed/sets/${safe}.json`];
}

export async function getObjectTextFirst(
  keys: readonly string[],
): Promise<string | null> {
  for (const key of keys) {
    const text = await getObjectText(key);
    if (text) return text;
  }
  return null;
}

async function bodyToString(body: unknown): Promise<string> {
  if (!body) return "";
  if (typeof (body as { transformToString?: () => Promise<string> }).transformToString === "function") {
    return (body as { transformToString: () => Promise<string> }).transformToString();
  }
  const chunks: Uint8Array[] = [];
  for await (const chunk of body as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

export async function getObjectText(key: string): Promise<string | null> {
  if (!isR2Configured()) return null;
  const client = getR2Client();
  const bucket = getBucket();
  try {
    const out = await client.send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );
    return bodyToString(out.Body);
  } catch (e: unknown) {
    const name = e && typeof e === "object" && "name" in e ? String((e as { name: string }).name) : "";
    if (name === "NoSuchKey" || name === "NotFound") return null;
    throw e;
  }
}
