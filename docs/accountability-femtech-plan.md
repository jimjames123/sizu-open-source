# SIZU accountability and FemTech expansion — implementation brief

Status: design proposal; **not** approved for production or implemented beyond initial navigation and FemTech landing page.

## Product model
- Organizations and social entrepreneurs register projects, set measurable targets, and submit self-evaluations.
- SIZU evaluators conduct commissioned field visits, record observations and supporting evidence, and issue independent findings.
- Authorized government users can review commissioned evaluations and track responses, corrective actions, and outcomes.
- The public can browse projects and approved, privacy-reviewed summaries; raw evidence and sensitive government communications stay restricted.
- FemTech remains a dedicated hub, sharing the evaluation architecture while using sector-specific indicators.

## Core indicators
Funding source and budget (where publishable); implementation area; project objectives; baseline; target and actual reach; disaggregated beneficiary counts where safe; outputs; outcomes; functionality; environmental and community suitability; barriers; evidence; evaluator confidence; recommendations; responsible party; action due date; follow-up outcome.

## Trust and permissions
- Label self-reported figures separately from independently verified observations and official government responses.
- Require explicit publication approval for evaluation summaries; maintain revision history, reviewer identity, and evidence provenance.
- Restrict field evidence, personal data, and sensitive locations using Supabase row-level security and role-based access.
- Do not collect identifiable patient health data for FemTech evaluations.
- Do not describe SIZU findings as government determinations without explicit authorization.
- AI may draft recommendations but must cite evidence and require human review.
- Define procurement, consent, conflicts-of-interest, appeals, and retention rules before field deployments.

## Proposed staged implementation
1. Project baseline and targets, progress reports, self-evaluation, and evidence upload.
2. SIZU field assignments, mobile-friendly checklists, offline data capture strategy, verification, and signed evaluation reports.
3. Government commissioning, scoped dashboards, findings review, action plans, follow-up, and public approved summaries.
4. FemTech-specific metrics and partner workflows.

## Data model (proposal; do not apply to production yet)
project_indicators, project_baselines, project_progress_reports, evaluation_assignments, field_observations, evaluation_evidence, evaluation_reports, evaluation_recommendations, corrective_actions, government_reviews, publication_approvals, audit_events.

## Release safeguards
Use a separate preview branch and staging Supabase environment for schema/RLS testing. Do not merge unfinished Ministry approval work or alter production Supabase until reviewed. Confirm public summaries do not leak restricted evidence. Test mobile and desktop navigation and protected routes.
