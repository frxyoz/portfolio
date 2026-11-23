'use client';

import { useEffect, useRef } from 'react';

/** One camera and one frame clock. The canvas replaces independently looping
 * SVG scales and a full-screen animated SVG mask. Resolution is bounded so a
 * high-density phone does not spend its frame budget on invisible pixels. */
export default function TunnelScene({ leaving, departureMs }: { leaving: boolean; departureMs: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const leavingRef = useRef(leaving);
    useEffect(() => { leavingRef.current = leaving; }, [leaving]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        let width = 0;
        let height = 0;
        let frame = 0;
        let start = 0;
        let departure = 0;
        let travel = 0;
        let previous = 0;
        let painted = false;
        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            const resolution = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = Math.round(width * resolution);
            canvas.height = Math.round(height * resolution);
            ctx.setTransform(resolution, 0, 0, resolution, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);

        function draw(now: number) {
            if (!ctx || !canvas) return;
            if (!start) { start = now; previous = now; }
            if (leavingRef.current && !departure) departure = now;
            const elapsed = (now - start) / 1000;
            const exit = departure ? Math.min((now - departure) / departureMs, 1) : 0;
            const delta = Math.min((now - previous) / 1000, .05);
            previous = now;
            // Acceleration belongs to the camera, so rails, ribs and lights
            // always move together instead of restarting separate loops.
            travel += delta * (5 + exit * exit * 36);
            const focal = Math.max(width * .65, height * .85);
            const cx = width * .5;
            const cy = height * .46;
            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#0d0d0d';
            ctx.fillRect(0, 0, width, height);

            // The arch uses the same world-space dimensions at every depth.
            function arch(scale: number) {
                if (!ctx) return;
                const r = 2.8 * scale;
                const shoulder = cy - .55 * scale;
                ctx.beginPath();
                ctx.moveTo(cx - r, cy + 1.65 * scale);
                ctx.lineTo(cx - r, shoulder);
                ctx.bezierCurveTo(cx - r, shoulder - r * .5523, cx - r * .5523, shoulder - r, cx, shoulder - r);
                ctx.bezierCurveTo(cx + r * .5523, shoulder - r, cx + r, shoulder - r * .5523, cx + r, shoulder);
                ctx.lineTo(cx + r, cy + 1.65 * scale);
            }

            // Fading depth prevents geometry popping at the vanishing point.
            for (let i = 0; i < 12; i++) {
                const z = ((i * 4 - travel) % 48 + 48) % 48 + 1;
                const scale = focal / z;
                const visibility = Math.min(1, (49 - z) / 10) * Math.min(1, z / 2);
                ctx.globalAlpha = visibility;
                arch(scale);
                ctx.strokeStyle = '#202020';
                ctx.lineWidth = Math.max(1, scale * .12);
                ctx.stroke();
                arch(scale);
                ctx.strokeStyle = '#55534d';
                ctx.lineWidth = Math.max(.6, scale * .012);
                ctx.stroke();

                // Recessed wall lamps stretch past the camera in perspective.
                ctx.strokeStyle = '#e6e4dd';
                ctx.lineWidth = Math.max(1, scale * .025);
                for (const side of [-1, 1]) {
                    ctx.beginPath();
                    ctx.moveTo(cx + side * 2.55 * scale, cy - .32 * scale);
                    const nextScale = focal / (z + 1.2);
                    ctx.lineTo(cx + side * 2.55 * nextScale, cy - .32 * nextScale);
                    ctx.stroke();
                }
                // Sleepers connect both rails, rather than decorative rays.
                ctx.strokeStyle = '#2a2a2a';
                ctx.lineWidth = Math.max(1, scale * .045);
                ctx.beginPath();
                ctx.moveTo(cx - 1.1 * scale, cy + 1.65 * scale);
                ctx.lineTo(cx + 1.1 * scale, cy + 1.65 * scale);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
            for (const side of [-1, 1]) {
                ctx.beginPath();
                ctx.moveTo(cx + side * .82 * focal / 48, cy + 1.65 * focal / 48);
                ctx.lineTo(cx + side * .82 * focal, cy + 1.65 * focal);
                ctx.strokeStyle = '#a3a099';
                ctx.lineWidth = 2;
                ctx.stroke();
                // The yellow platform edges tie the journey to the hero field.
                ctx.beginPath();
                ctx.moveTo(cx + side * 2.1 * focal / 48, cy + 1.65 * focal / 48);
                ctx.lineTo(cx + side * 2.1 * focal, cy + 1.65 * focal);
                ctx.strokeStyle = '#ffd100';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // A single continuous opening. Erasing directly on the canvas
            // reveals the real page without an SVG mask repaint or layer snap.
            const approach = Math.min(elapsed / 1.5, 1);
            const opening = focal / 52 * (1 + approach * .12) + Math.pow(exit, 3) * Math.max(width, height) * 1.3;
            arch(opening);
            ctx.closePath();
            ctx.fillStyle = '#ffd100';
            ctx.fill();
            if (exit > 0) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.globalAlpha = Math.min(exit * 6, 1);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 1;
            }
            if (!painted) {
                // Keep the server-rendered curtain opaque until its first
                // canvas frame, then let the opening reveal the page beneath.
                canvas.dataset.ready = 'true';
                painted = true;
            }
            if (exit < 1) frame = requestAnimationFrame(draw);
        }
        frame = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
    }, [departureMs]);

    return <canvas ref={canvasRef} className="oz-tunnel-scene" aria-hidden="true" />;
}
