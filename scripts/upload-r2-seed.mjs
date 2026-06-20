#!/usr/bin/env node
/**
 * content/r2-seed/ → Cloudflare R2 업로드
 *
 * 필요 env (.env.local 또는 셸):
 *   CLOUDFLARE_R2_ACCOUNT_ID
 *   CLOUDFLARE_R2_ACCESS_KEY_ID
 *   CLOUDFLARE_R2_SECRET_ACCESS_KEY
 *   CLOUDFLARE_R2_BUCKET_NAME
 *
 * 선택: R2_UPLOAD_PREFIX (기본 content/r2-seed/)
 */
import { existsSync, readFileSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SEED_DIR = join(ROOT, "content", "r2-seed");
const SETS_DIR = join(SEED_DIR, "sets");

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile(join(ROOT, ".env.local"));
loadEnvFile(join(ROOT, ".env"));

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing env: ${name}`);
    console.error("Set in .env.local or shell before running upload:r2");
    process.exit(1);
  }
  return v;
}

function getClient() {
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

function normalizePrefix(prefix) {
  const p = prefix.replace(/^\/+|\/+$/g, "");
  return p ? `${p}/` : "";
}

async function uploadText(client, bucket, key, body) {
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: "application/json; charset=utf-8",
    }),
  );
  console.log(`  ↑ ${key}`);
}

async function main() {
  const prefix = normalizePrefix(
    process.env.R2_UPLOAD_PREFIX ?? "content/r2-seed",
  );
  const bucket = requireEnv("CLOUDFLARE_R2_BUCKET_NAME");
  const client = getClient();

  if (!existsSync(join(SEED_DIR, "index.json"))) {
    console.error("content/r2-seed/index.json not found.");
    console.error("Run quiz generators first, e.g. python scripts/generate-eco-quiz.py");
    process.exit(1);
  }

  console.log(`Uploading to s3://${bucket}/${prefix}`);

  const indexRaw = await readFile(join(SEED_DIR, "index.json"), "utf8");
  await uploadText(client, bucket, `${prefix}index.json`, indexRaw);

  const files = (await readdir(SETS_DIR)).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    console.error("No sets/*.json found.");
    process.exit(1);
  }

  for (const file of files.sort()) {
    const raw = await readFile(join(SETS_DIR, file), "utf8");
    await uploadText(client, bucket, `${prefix}sets/${file}`, raw);
  }

  console.log(`Done: index.json + ${files.length} set files`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
