import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  storage_quota_bytes: z.number().int().nonnegative().default(52428800), // 50 MB
  storage_used_bytes: z.number().int().nonnegative().default(0),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  owner_id: z.string().uuid(),
  title: z.string().min(1).default('Untitled Document'),
  document_ast: z.record(z.string(), z.any()),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const ProjectAssetSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid(),
  owner_id: z.string().uuid(),
  name: z.string().min(1),
  file_type: z.enum(['png', 'jpg', 'jpeg', 'svg', 'pdf', 'csv', 'docx', 'md', 'json']),
  size_bytes: z.number().int().positive(),
  storage_path: z.string(),
  public_url: z.string(),
  role: z.enum(['inline-embed', 'table-source', 'reference-attachment']),
  created_at: z.string().optional(),
});

export type ProjectAsset = z.infer<typeof ProjectAssetSchema>;
