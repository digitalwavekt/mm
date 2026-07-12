import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { uploadImage } from "./lib/storage";
import {
  getAllMedia,
  getMediaByFolder,
  getMediaByType,
  addMediaItem,
  updateMediaItem,
  deleteMediaItem,
  searchMedia,
  getMediaFolders,
} from "./queries/media";

export const mediaRouter = createRouter({
  // Public
  list: publicQuery.query(async () => {
    return getAllMedia();
  }),

  byFolder: publicQuery
    .input(z.object({ folder: z.string() }))
    .query(async ({ input }) => {
      return getMediaByFolder(input.folder);
    }),

  folders: publicQuery.query(async () => {
    return getMediaFolders();
  }),

  // Admin
  adminList: adminQuery.query(async () => {
    return getAllMedia();
  }),

  byType: adminQuery
    .input(z.object({ fileType: z.enum(["image", "video"]) }))
    .query(async ({ input }) => {
      return getMediaByType(input.fileType);
    }),

  search: adminQuery
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      return searchMedia(input.query);
    }),

  create: adminQuery
    .input(
      z.object({
        fileName: z.string().min(1),
        originalName: z.string().optional(),
        fileUrl: z.string().min(1),
        thumbnailUrl: z.string().optional(),
        fileType: z.enum(["image", "video"]).optional(),
        mimeType: z.string().optional(),
        size: z.number().optional(),
        folder: z.string().optional(),
        alt: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return addMediaItem(input);
    }),

  // Uploads a base64-encoded image to Supabase Storage and records it in
  // the media library in one step. Returns the created media row (with its
  // public fileUrl), ready to plug straight into a form field.
  upload: adminQuery
    .input(
      z.object({
        fileName: z.string().min(1),
        mimeType: z.string().min(1),
        dataBase64: z.string().min(1),
        folder: z.string().min(1).default("uploads"),
      })
    )
    .mutation(async ({ input }) => {
      const uploaded = await uploadImage({
        dataBase64: input.dataBase64,
        mimeType: input.mimeType,
        folder: input.folder,
      });

      return addMediaItem({
        fileName: input.fileName,
        originalName: input.fileName,
        fileUrl: uploaded.url,
        fileType: "image",
        mimeType: input.mimeType,
        size: uploaded.size,
        folder: input.folder,
      });
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        fileName: z.string().optional(),
        originalName: z.string().optional(),
        fileUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        fileType: z.enum(["image", "video"]).optional(),
        mimeType: z.string().optional(),
        size: z.number().optional(),
        folder: z.string().optional(),
        alt: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateMediaItem(id, data);
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteMediaItem(input.id);
    }),
});
