'use client';

import { profile } from '@/data/profile';
import Reveal from './Reveal';
import type { TimelineEntry } from '@/types';
import Pictogram from './concourse/Pictogram';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
  SIGNAL, ENAMEL, ENAMEL_LIT, STEEL, SIGN_WHITE, SIGN_INK, SIGN_INK_SOFT,
  CHALK, SIGN, EASE_OUT, TYPE,} from '@/design/tokens';

/** The line's own thickness. A route diagram is a drawing at one weight, and
 *  every rule in this section is derived from it rather than chosen. */
const LINE = 12;
/** The marker's outer diameter. */
const DOT = 26;
/** How far the line climbs on its one dogleg, and therefore the size of the
 *  45° connector that carries it there. Beck's rule: horizontals, verticals and
 *  45s, nothing else. */
const RISE = 44;

export default function AboutSection() {
  const isMobile = useIsMobile();
  /* The data is stored newest-first, which is how a résumé reads. A route runs
     the other way: you board at the first station and the terminus is where he
     is now. */
  const route = [...profile.timeline].reverse();

  return (
    <section
      id="about"
      style={{
        background: SIGN_WHITE,
        padding: isMobile ? '72px 20px 88px' : '128px 48px 148px',
        fontFamily: SIGN,
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <Reveal>
          <h2 style={{
            fontSize: isMobile ? 'clamp(2.2rem, 11vw, 3.2rem)' : 'clamp(3rem, 6vw, 5rem)',
            fontWeight: 800, fontStretch: '112%',
            letterSpacing: '-0.03em', lineHeight: 0.9, color: STEEL,
          }}>
            Background
          </h2>
        </Reveal>

        <Reveal delay={0.06} style={{
          height: LINE, background: ENAMEL, width: isMobile ? 120 : 180,
          margin: isMobile ? '20px 0 32px' : '28px 0 44px',
        }} />

        <Reveal delay={0.1}>
          <p style={{
            fontSize: isMobile ? TYPE.BODY : TYPE.LEDE,
            lineHeight: 1.65, color: SIGN_INK, maxWidth: '58ch',
            fontWeight: 400,
          }}>
            {profile.tagline}
          </p>
        </Reveal>

        <Reveal delay={0.14} style={{ marginTop: isMobile ? 56 : 96 }}>
          {isMobile ? <VerticalRoute route={route} /> : <HorizontalRoute route={route} />}
        </Reveal>
      </div>
    </section>
  );
}

/* ── Station marker ─────────────────────────────────────────────────────────
   An ordinary stop is a filled disc on the line. The terminus is an interchange
   ring — hollow, heavier, and the only marker on the diagram that is not solid.
   That difference is the whole legend: the ring is where he is now. */
function Marker({ terminus }: { terminus: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: terminus ? DOT + 8 : DOT,
        height: terminus ? DOT + 8 : DOT,
        borderRadius: '50%',
        background: terminus ? SIGN_WHITE : ENAMEL,
        border: terminus ? `${LINE / 2}px solid ${ENAMEL}` : `4px solid ${SIGN_WHITE}`,
        boxShadow: terminus ? `0 0 0 4px ${SIGN_WHITE}` : 'none',
        flexShrink: 0,
        display: 'block',
      }}
    />
  );
}

/* ── Station label ─────────────────────────────────────────────────────────── */
function StationLabel({ item, terminus, align }: {
  item: TimelineEntry;
  terminus: boolean;
  align: 'below' | 'right';
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      gap: 7,
      paddingTop: align === 'below' ? 20 : 0,
      textAlign: 'left',
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start',
        background: terminus ? SIGNAL : CHALK,
        color: STEEL,
        padding: '5px 10px',
        fontSize: TYPE.MICRO, fontWeight: 800, fontStretch: '88%',
        letterSpacing: '0.16em', textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        {terminus && <Pictogram name="pin" size={11} />}
        {item.period}
      </span>

      <h3 style={{
        fontSize: TYPE.TITLE, fontWeight: 700, fontStretch: '96%',
        lineHeight: 1.2, color: SIGN_INK, letterSpacing: '-0.012em',
      }}>
        {item.title}
      </h3>

      <span style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
        {item.orgUrl ? (
          <a
            href={item.orgUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: TYPE.META, fontWeight: 700, color: ENAMEL,
              boxShadow: `inset 0 -2px 0 0 ${ENAMEL}55`,
              display: 'inline-flex', alignItems: 'center', minHeight: 24,
              transition: `box-shadow 0.2s ${EASE_OUT}, color 0.2s ${EASE_OUT}`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = `inset 0 -2px 0 0 ${ENAMEL}`;
              e.currentTarget.style.color = ENAMEL_LIT;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = `inset 0 -2px 0 0 ${ENAMEL}55`;
              e.currentTarget.style.color = ENAMEL;
            }}
          >
            {item.org}
          </a>
        ) : (
          <span style={{ fontSize: TYPE.META, fontWeight: 700, color: ENAMEL }}>{item.org}</span>
        )}
        {/* The employer marks are deliberately not drawn here. Each arrives in
            its own brand's colours — among them a red seal and a green bubble —
            which would spend the two colours this system reserves for AWARD and
            LIVE on rows making no such claim; and reduced to one ink they turn
            to smudges at 20px. A route diagram names its stations and does not
            badge them with operator logos. The org name beside this is a live
            link, so nothing verifiable is lost. */}
      </span>

      {item.desc && (
        <p style={{ fontSize: TYPE.META, color: SIGN_INK_SOFT, lineHeight: 1.6, maxWidth: '34ch' }}>
          {item.desc}
        </p>
      )}
    </div>
  );
}

/* ── Desktop: the line runs left to right, with one 45° climb ──────────────── */

/** The track band's height: enough for the line at its highest level plus the
 *  interchange ring seated on it. */
const TRACK_H = RISE + DOT + 12;

function HorizontalRoute({ route }: { route: TimelineEntry[] }) {
  /* Which level each station stands on. The climb sits in the middle of the run
     so the diagram has a shape rather than a straight rule, and so the terminus
     visibly ends up higher than where the line began. */
  const level = (i: number) => (i < 2 ? 0 : RISE);
  const last = route.length - 1;

  return (
    <div
      role="list"
      aria-label="Timeline"
      style={{
        display: 'grid',
        /* The last column takes only the width its label needs, so the line
           runs as far right as the diagram allows instead of stopping a quarter
           of the way from the edge. */
        gridTemplateColumns: `repeat(${route.length - 1}, minmax(0, 1fr)) auto`,
      }}
    >
      {route.map((item, i) => {
        const isLast = i === last;
        const lv = level(i);
        const climbs = !isLast && level(i + 1) !== lv;
        const size = isLast ? DOT + 8 : DOT;

        return (
          <div key={item.org + item.period} role="listitem" style={{ minWidth: 0 }}>
            {/* The track band. Everything in here is bottom-anchored, so a
                station's level is simply how far off the floor its line sits. */}
            <div aria-hidden="true" style={{ position: 'relative', height: TRACK_H }}>
              {/* The line runs under its markers rather than between them: on a
                  route diagram the disc is printed on the line, not spliced
                  into it. The last station gets a short stub so the terminus
                  ring is entered from the left and closes the run. */}
              <span style={{
                position: 'absolute',
                left: 0,
                right: isLast ? undefined : climbs ? RISE + LINE : 0,
                width: isLast ? size / 2 : undefined,
                bottom: lv,
                height: LINE, background: ENAMEL,
              }} />

              {climbs && (
                /* The 45° climb, at a fixed pixel size so the angle stays exactly
                   45° at every viewport width. Everything that flexes on this
                   diagram is horizontal; the diagonal never stretches. */
                <svg
                  width={RISE + LINE}
                  height={RISE + LINE}
                  viewBox={`0 0 ${RISE + LINE} ${RISE + LINE}`}
                  style={{ position: 'absolute', right: 0, bottom: lv }}
                >
                  {/* A filled mitre rather than a stroked line. A 45° stroke ends
                      on a diagonal face, so butting it against a square-ended bar
                      leaves a notch at one junction and a spur at the other; the
                      polygon's two end faces are cut to match the bars exactly. */}
                  <path
                    d={`M0 ${RISE + LINE} L0 ${RISE} L${RISE} 0 L${RISE + LINE} 0 L${RISE + LINE} ${LINE} L${LINE} ${RISE + LINE} Z`}
                    fill={ENAMEL}
                  />
                </svg>
              )}

              <span style={{
                position: 'absolute',
                left: 0,
                bottom: lv + LINE / 2 - size / 2,
              }}>
                <Marker terminus={isLast} />
              </span>
            </div>

            <div style={{ paddingRight: isLast ? 0 : 28, maxWidth: isLast ? 300 : undefined }}>
              <StationLabel item={item} terminus={isLast} align="below" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Mobile: the same line, stood on end ───────────────────────────────────── */
function VerticalRoute({ route }: { route: TimelineEntry[] }) {
  return (
    <div role="list" aria-label="Timeline" style={{ position: 'relative', paddingLeft: DOT + 20 }}>
      <span aria-hidden="true" style={{
        position: 'absolute',
        left: (DOT - LINE) / 2, top: DOT / 2, bottom: DOT / 2,
        width: LINE, background: ENAMEL,
      }} />
      {route.map((item, i) => {
        const isLast = i === route.length - 1;
        return (
          <div
            key={item.org + item.period}
            role="listitem"
            style={{ position: 'relative', paddingBottom: isLast ? 0 : 44 }}
          >
            <span style={{
              position: 'absolute',
              left: -(DOT + 20) + (isLast ? -4 : 0),
              top: isLast ? -4 : 0,
            }}>
              <Marker terminus={isLast} />
            </span>
            <div style={{ paddingTop: 0 }}>
              <StationLabel item={item} terminus={isLast} align="right" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
