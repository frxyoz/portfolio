// Tabular content for the MindDo case study at /projects/minddo.
// Table cells stay terse; the prose lives in MinddoShowcase and the diagrams.


/** The case study's sections, in reading order. Lives here rather than in the
 *  component because the home page's board counts them, and the board must not
 *  drag the case study's component tree into the home page bundle to do it. */
export const SECTIONS = [
    { id: 'output', label: 'What it produces' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'lifecycle', label: 'Request lifecycle' },
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'scaling', label: 'Autoscaling' },
    { id: 'data', label: 'Data model' },
    { id: 'security', label: 'Security' },
    { id: 'reliability', label: 'Reliability' },
    { id: 'performance', label: 'Performance and cost' },
    { id: 'limitations', label: 'Limitations' },
    { id: 'aws', label: 'On AWS' },
];

export const minddo = {
    name: 'MindDo AI',
    subtitle: 'Student Project Showcase Pipeline',
    year: '2026',
    role: 'Sole engineer: architecture, backend, infra, security',
    stack: 'FastAPI, Celery, Redis, Playwright, Claude Sonnet 4.6, ffmpeg, Supabase, S3, Kubernetes, KEDA',
    scale: '~2,200 lines of Python, ~4,900 of JSX, 12 Kubernetes manifests',
    deployment: 'Deployed to AWS on 16 August 2026: k3s on a t3.large, KEDA autoscaling verified under a 20-job load test. Torn down after the run so it stops billing. Also runs on docker compose and k3d.',
    lede: 'You give it a link to a student\'s project and about a hundred seconds later you get eleven files back: two screenshots, a recorded walkthrough of the site, narrated videos in English and Mandarin, copy written by Claude, a QR code, and a flyer that is ready to print.',
    // youtube-nocookie so the embed sets no cookie until playback starts.
    demoVideo: 'https://www.youtube-nocookie.com/embed/_IFdL_suGr0',
};

// The 2026-08-16 load test: 20 jobs at once against k3s on one t3.large.
export const awsLoad: { value: string; label: string; note: string }[] = [
    { value: '20 / 20', label: 'Jobs completed', note: 'Pods restarted mid-run; every job still finished' },
    { value: '17 s', label: '1 to 4 workers', note: 'From submit to four pods Ready' },
    { value: '18.9 min', label: 'Queue drained', note: 'About 1.06 jobs a minute at the ceiling' },
    { value: '257 s', label: 'Median per job', note: '142.6 s fastest, 276 s slowest' },
    { value: '3.3 min', label: 'Scale-down', note: 'After the queue emptied' },
    { value: '253 files', label: 'Assets in S3', note: '185 MB across 23 showcases' },
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
    { risk: 'Prompt injection via page text', status: 'Still unmitigated. Scraped page text goes into the prompt, so it can steer the copy that parents end up reading. The fix is to label it clearly as data and validate what comes back against a schema.' },
    { risk: 'SYS_ADMIN on worker pods', status: 'Probably not needed at all, since Chromium is running with --no-sandbox regardless. This is the first thing I want to try taking away.' },
    { risk: 'No structured output validation', status: 'The model output goes straight into json.loads, so one malformed response kills a run that has already paid for two browser launches.' },
    { risk: 'Shared secret admin auth', status: 'An interim measure. What it should do is check the caller JWT against profiles.role and let row-level security do the enforcing.' },
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
    { control: 'worker liveness', value: 'ping every 120 s', prevents: 'A deadlocked worker still counting as capacity. Retuned from 15 s after the probe mistook busy for dead and restarted five of six workers mid job' },
    { control: 'prune after upload', value: 'on by default', prevents: 'Showcases at 20 to 40 MB filling the node until pods are evicted' },
];

export const sizing: { change: string; from: string; to: string; why: string }[] = [
    { change: 'KEDA ceiling', from: '8', to: '4', why: 'Eight pods at 512 Mi requests do not schedule next to the control plane, Traefik, KEDA, Redis and two API replicas on 8 GiB. Six did schedule, then the node OOM killer went after actual usage instead of requests, so six was wrong too.' },
    { change: 'Worker concurrency', from: '2, limit 2 Gi', to: '1, limit 1200 Mi', why: 'Six pods could ask for 12 GiB on an 8 GiB box. One Chromium per pod, and KEDA scales pod count instead of packing slots into a pod.' },
    { change: 'API resources', from: 'none declared', to: 'requests and limits', why: 'With nothing declared the API pods were BestEffort, so the kubelet killed them instead of the workers causing the pressure: three restarts each, exit 137, while every worker survived.' },
    { change: 'Worker liveness probe', from: '15 s timeout', to: '120 s period, 30 s timeout', why: 'celery inspect ping is a broker round trip. On two saturated cores it could not answer in time, so five of six workers were restarted mid job.' },
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
    { limitation: 'Probes are tuned for an idle node', consequence: 'Under load they restart healthy processes', fix: 'Widen the windows, or size the node so the cores are not saturated' },
    { limitation: 'One node', consequence: 'Four workers share 2 vCPU, so per-job latency degrades as throughput improves', fix: 'A second node; the manifests do not change' },
];

export const takeaways: { title: string; body: string }[] = [
    {
        title: 'Distributed systems',
        body: 'Splitting the queue from the workers let each side scale on its own signal. Getting at-least-once delivery right took me much longer, mostly because I had to work out which failures deserve a retry and which are permanent verdicts that should never get one.',
    },
    {
        title: 'Kubernetes experience',
        body: 'Liveness and readiness are not the same probe, and treating them as one restarts the entire fleet the first time Redis hiccups. Grace periods have to match how long the work actually takes. And a real node taught me what a laptop could not: the scheduler admits pods on requests, the OOM killer acts on usage, so six pods can pass admission and still die.',
    },
    {
        title: 'Reviewing my own code',
        body: 'Four passes over the codebase turned up four holes. Asking what each check was actually checking, rather than what I remembered writing it to do, found every one of them.',
    },
    {
        title: 'Cost engineering',
        body: 'Caching on a content hash and moving off paid TTS took the unit cost from $0.043 to $0.023. I set the rate limit and the pod ceiling to cap how much a runaway loop can spend before I notice, which is a different job from sizing for expected traffic.',
    },
];
