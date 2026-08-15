// Tabular content for the MindDo case study at /projects/minddo.
// Kept deliberately terse: the diagrams carry the detail.

export const minddo = {
    name: 'MindDo AI',
    subtitle: 'Student Project Showcase pipeline',
    year: '2026',
    role: 'Sole engineer: architecture, backend, infra, security',
    stack: 'FastAPI, Celery, Redis, Playwright, Claude Sonnet 4.6, ffmpeg, Supabase, S3, Kubernetes, KEDA',
    scale: '~2,200 lines of Python, ~4,900 of JSX, 12 Kubernetes manifests',
    status: 'Runs on docker compose and on k3d with KEDA. The AWS deployment is scripted but not executed.',
    lede: 'A student project URL goes in. About 100 seconds later there are eleven artifacts: screenshots, a recorded demo, a narrated video in English and Mandarin, AI-written copy, a QR code and a print-ready flyer.',
};

export const metrics = [
    { value: '102.7 s', label: 'End to end', note: 'URL to eleven assets' },
    { value: '5 ms', label: 'API accept', note: '202 with a submission_id' },
    { value: '1.04x', label: 'At 3x load', note: '3 jobs, 106.9 s wall clock' },
    { value: '$0.023', label: 'Per showcase', note: 'Was $0.043 before edge-tts' },
];

export const artifacts: { file: string; by: string; detail: string }[] = [
    { file: 'screenshot.png', by: 'Playwright', detail: '1440x900, above the fold' },
    { file: 'fullpage.png', by: 'Playwright', detail: 'Full page' },
    { file: 'demo.webm', by: 'Playwright', detail: '3 nav clicks, then a 300 step scroll' },
    { file: 'showcase_video.mp4', by: 'edge-tts + ffmpeg', detail: 'English narration, music bed at 6%' },
    { file: 'showcase_video_zh.mp4', by: 'edge-tts + ffmpeg', detail: 'Mandarin, same footage' },
    { file: 'captions.vtt / _zh.vtt', by: 'video.py', detail: 'Timings weighted by character count' },
    { file: 'qr.png', by: 'qrcode', detail: '600x600, ECC level Q' },
    { file: 'flyer.png / .pdf', by: 'HTML to Playwright', detail: '612x792 PNG, 8.5x11 in PDF' },
    { file: 'showcase.json', by: 'storage.py', detail: 'The record the frontend polls' },
];

export interface Finding { commit: string; title: string; problem: string; fix: string }

export const security: Finding[] = [
    {
        commit: 'aa86801',
        title: 'The repository root was served over HTTP',
        problem: 'StaticFiles was mounted on the repo root, publishing every file in it. GET /.env returned all four API keys.',
        fix: 'An explicit allowlist: index.html, *.jsx, assets/. The asset route also charset-checks the id and containment-checks the resolved path, since a path parameter can legally be "..".',
    },
    {
        commit: '7ea965b',
        title: 'SSRF into the cloud metadata endpoint',
        problem: 'An arbitrary URL is loaded in Chromium, then the screenshot and page text are published. On EC2 that renders instance credentials into public output.',
        fix: 'Scheme allowlist plus a destination denylist over six address properties, every resolved record, and redirect chains walked by hand. Enforced at the API boundary and again per navigation.',
    },
    {
        commit: '06a2b5e',
        title: 'An unauthenticated destructive endpoint',
        problem: 'The admin delete route checked whether a service key was configured, never who was calling. The docstring claimed otherwise.',
        fix: 'A shared token compared with hmac.compare_digest. An unset token returns 503, never an open door.',
    },
    {
        commit: '06a2b5e',
        title: 'Unbounded spend on an open endpoint',
        problem: 'POST /generate had no limit, and each request spends Anthropic credit plus minutes of worker CPU.',
        fix: '5/hour per IP in Redis. X-Forwarded-For is trusted only from a configured proxy, since the leftmost value is forgeable.',
    },
    {
        commit: 'c94a494',
        title: 'Supply chain and key handling',
        problem: 'The Supabase CDN script carried the auth token and was the only tag without Subresource Integrity.',
        fix: 'Publishable key format, RLS verified against the live project, and integrity on all four CDN tags.',
    },
];

export const residualRisks: { risk: string; status: string }[] = [
    { risk: 'Prompt injection via page text', status: 'Unmitigated. Scraped text steers parent-facing copy. Fix: label it as data, validate output against a schema.' },
    { risk: 'SYS_ADMIN on worker pods', status: 'Likely redundant: Chromium runs with --no-sandbox anyway. First thing to test removing.' },
    { risk: 'No structured output validation', status: 'json.loads on raw model output. A bad response kills the run after two browser launches.' },
    { risk: 'Shared secret admin auth', status: 'Interim. The real design verifies the caller JWT against profiles.role and lets RLS enforce it.' },
];

export const reliability: { control: string; value: string; prevents: string }[] = [
    { control: 'task_acks_late', value: 'True', prevents: 'A worker dying mid run silently destroying the job' },
    { control: 'soft / hard time limit', value: '600 s / 720 s', prevents: 'A hung Chromium holding its slot forever while KEDA scales up more pods to hang the same way' },
    { control: 'prefetch multiplier', value: '1', prevents: 'A busy worker hoarding jobs it cannot start' },
    { control: 'autoretry + backoff', value: '2 retries, jittered', prevents: 'Transient faults: a site briefly down, a DNS blip, an Anthropic 529' },
    { control: 'Reject(requeue=False)', value: 'unsafe URL, timeout', prevents: 'Retrying a permanent verdict' },
    { control: 'termination grace', value: '660 s', prevents: 'SIGKILL mid pipeline leaving a half written directory' },
    { control: 'startupProbe', value: '5 min budget', prevents: 'Pods killed before a 3 GB image finishes booting' },
    { control: 'liveness /health/live', value: 'process only', prevents: 'A Redis blip restarting every replica at once' },
    { control: 'readiness /health', value: 'checks broker', prevents: 'A pod accepting a POST it cannot queue' },
    { control: 'worker liveness', value: 'celery inspect ping', prevents: 'A deadlocked worker still counting as capacity' },
    { control: 'prune after upload', value: 'on by default', prevents: 'Showcases at 20 to 40 MB filling the node until pods are evicted' },
];

export const cost = [
    { component: 'Claude input', detail: '~1,650 tokens', value: '$0.005' },
    { component: 'Claude output', detail: '~1,200 tokens', value: '$0.018' },
    { component: 'edge-tts, EN + ZH', detail: 'no key, no charge', value: '$0.000' },
    { component: 'Total', detail: 'was ~$0.043', value: '~$0.023' },
];

export const wins = [
    'Run capture and demo recording concurrently. About 25 s.',
    'Generate the QR concurrently; it only needs the URL.',
    'Reuse one browser across both, saving a cold start.',
    'ffmpeg preset veryfast instead of medium.',
    'Build the English and Mandarin videos concurrently.',
];

export const limitations: { limitation: string; consequence: string; fix: string }[] = [
    { limitation: 'Cache key omits the student', consequence: 'Same URL, second student: parents hear the first name', fix: 'Split into a cacheable analysis and an uncached personalisation call' },
    { limitation: 'Pipeline is not idempotent', consequence: 'A redelivered task re-invokes paid APIs', fix: 'Step level checkpointing' },
    { limitation: 'No deduplication', consequence: '20 identical payloads run 20 times', fix: 'Idempotency key as the Celery task_id' },
    { limitation: 'Strictly sequential', consequence: 'About 25 s of avoidable latency', fix: 'Run the independent steps concurrently' },
    { limitation: 'No automated tests', consequence: 'A load generator is not a test suite', fix: 'Cache logic against a mocked client first' },
    { limitation: 'Redis has no persistence', consequence: 'A pod restart loses the queue', fix: 'AOF, or move the broker to SQS' },
    { limitation: 'Model output parsed with json.loads', consequence: 'A bad response kills the run at step 3', fix: 'Schema constrained output plus validation' },
    { limitation: 'Frontend has no build step', consequence: 'Babel transpiles on every page load', fix: 'Vite before real traffic' },
];

export const takeaways: { title: string; body: string }[] = [
    { title: 'Distributed systems', body: 'Queue and worker split on independent scaling signals, at-least-once delivery with late acks, permanent verdicts distinguished from transient faults.' },
    { title: 'Kubernetes in anger', body: 'Probes that separate liveness from readiness, grace periods sized to the workload, autoscaling on a metric tied to user-visible wait.' },
    { title: 'Security review of my own code', body: 'Four hardening passes, each closing a hole found by asking one question: what does this actually check?' },
    { title: 'Cost engineering', body: 'Content addressed caching, a TTS migration that halved unit cost, ceilings chosen as blast radius rather than capacity.' },
    { title: 'Honest measurement', body: 'A benchmark number I disqualified, and a load test I report as proving the control loop rather than the benefit.' },
];
