# SIZU project approval rollout checklist

## Confirmed submission path
`src/hooks/useProjectSubmission.ts` inserts directly into `public.projects`, using `status` for project progress and `organization_id` from the authenticated user. It currently shows “Project created” immediately after insertion. Do not reinterpret `status` as review status.

## Safe rollout order
1. Provision an isolated Supabase development project with non-production credentials, auth and storage. Point a dedicated Vercel preview at it; do not use real organization data for tests.
2. Inspect the actual schema, all insert/update paths, the public `projects` Edge Function, project detail queries, storage permissions, and admin authorization mechanism. Validate the draft SQL against that schema.
3. Apply `supabase/review_workflow_draft.sql` to development only. Backfill existing imported public projects to `approved` by an explicit reviewed list, never blindly.
4. Add database-level enforcement: default new rows to `pending_review`, prevent organization users from changing review fields, restrict read access to unpublished rows to the owning organization and authorized admins, and require admin-only review transitions. Audit each transition transactionally.
5. Update the submission hook to show “Submitted for review” only after the new schema and policies are deployed; update organization dashboard to show review status and feedback.
6. Add admin queue with approve, reject and request-changes actions; verify authorization server-side.
7. Filter public search Edge Function, directory, detail pages and other public queries to approved projects; test direct URL access, API calls, anonymous users and image access.
8. Run automated and manual tests against development; prepare reversible migration, existing project classification, and coordinated production release.

## Required tests
- New organization project stays private to public search, direct project URL and API.
- Owner sees its own pending project; another organization cannot.
- Non-admin cannot approve by modifying request payload or calling Supabase directly.
- Admin can approve/reject/request changes; feedback and audit event persist.
- Approved project becomes public; rejected or pending projects remain private.
- Existing production project visibility does not change unexpectedly.
- Progress `status` remains independent from `review_status`.
- Failed approval/audit writes roll back together.

**Deployment gate:** No production database migration, RLS change, or preview writes to the existing production Supabase project until these tests pass.
