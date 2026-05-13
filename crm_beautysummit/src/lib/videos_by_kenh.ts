// src/lib/videos_by_kenh.ts
import { videoSchema, type Video } from "@/app/(main)/orders/[customerId]/_components/schema";
import { getDB } from "@/lib/db";

type Paging = { page?: number; pageSize?: number | "all" | -1 };

export async function getVideosByChannel(
  idKenhRaw: string,
  paging?: Paging,
): Promise<{ rows: Video[]; total: number }> {
  const idKenh = String(idKenhRaw || "").replace(/^@/, "");
  const wantAll = !paging || paging.pageSize === undefined || paging.pageSize === "all" || Number(paging.pageSize) <= 0;

  const page = Number(paging?.page ?? 1) || 1;
  const pageSize = wantAll ? undefined : Number(paging?.pageSize) || 20;
  const offset = pageSize ? (page - 1) * pageSize : undefined;

  const db = getDB();

  // ===== helper build =====
  const limitSql = pageSize ? " LIMIT ? OFFSET ? " : "";
  const limitParams = pageSize ? [pageSize, offset!] : [];

  // ---- A) Theo id_kenh
  const selectBaseA = `
    SELECT
      video_id, title, hashtag,
      view, likes, comment, share, download,
      duration, collect, create_time, tiktok_id, thumbnail_ai_dyamic, id_kenh
    FROM video
    WHERE REPLACE(id_kenh,'@','') = ?
    ORDER BY create_time DESC
    ${limitSql}
  `;

  const [rowsA] = await db.query<any[]>(selectBaseA, [idKenh, ...limitParams]);

  // total cho A
  let totalA: number;
  if (wantAll) {
    totalA = rowsA.length;
  } else {
    const [cntA] = await db.query<any[]>(`SELECT COUNT(*) AS total FROM video WHERE REPLACE(id_kenh,'@','') = ?`, [
      idKenh,
    ]);
    totalA = Number(cntA?.[0]?.total ?? 0);
  }

  let rows = rowsA;
  let total = totalA;

  // ---- B) Nếu A không có dữ liệu, thử JOIN theo tiktok_id
  if (!rows?.length) {
    const selectBaseB = `
      SELECT
        v.video_id, v.title, v.hashtag,
        v.view, v.likes, v.comment, v.share, v.download,
        v.duration, v.collect, v.create_time, v.tiktok_id, v.thumbnail_ai_dyamic, v.id_kenh
      FROM video v
      JOIN kenh k ON k.tiktok_id = v.tiktok_id
      WHERE REPLACE(k.id_kenh,'@','') = ?
      ORDER BY v.create_time DESC
      ${limitSql}
    `;
    const [rowsB] = await db.query<any[]>(selectBaseB, [idKenh, ...limitParams]);

    if (wantAll) {
      const [allB] = await db.query<any[]>(
        `
        SELECT
          v.video_id, v.title, v.hashtag,
          v.view, v.likes, v.comment, v.share, v.download,
          v.duration, v.collect, v.create_time, v.tiktok_id, v.thumbnail_ai_dyamic, v.id_kenh
        FROM video v
        JOIN kenh k ON k.tiktok_id = v.tiktok_id
        WHERE REPLACE(k.id_kenh,'@','') = ?
        ORDER BY v.create_time DESC
        `,
        [idKenh],
      );
      rows = allB;
      total = allB.length;
    } else {
      rows = rowsB;
      const [cntB] = await db.query<any[]>(
        `SELECT COUNT(*) AS total
         FROM video v JOIN kenh k ON k.tiktok_id = v.tiktok_id
         WHERE REPLACE(k.id_kenh,'@','') = ?`,
        [idKenh],
      );
      total = Number(cntB?.[0]?.total ?? 0);
    }
  }

  const parsed = (rows ?? []).map((r) =>
    videoSchema.parse({
      video_id: String(r.video_id),
      title: String(r.title ?? ""),
      hashtag: r.hashtag ? String(r.hashtag) : "",
      likes: Number(r.likes) || 0,
      view: Number(r.view) || 0,
      comment: Number(r.comment) || 0,
      share: Number(r.share ?? 0),
      download: Number(r.download ?? 0),
      duration: Number(r.duration ?? 0),
      collect: Number(r.collect ?? 0),
      create_time: new Date(r.create_time),
      tiktok_id: String(r.tiktok_id ?? ""),
      thumbnail_ai_dyamic: String(r.thumbnail_ai_dyamic ?? ""),
      id_kenh: String(r.id_kenh ?? idKenh),
    }),
  );

  return { rows: parsed, total };
}
