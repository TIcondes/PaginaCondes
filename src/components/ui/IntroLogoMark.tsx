// Recreación en SVG/CSS del logo de puntos "dibujándose" que traía el
// video de intro original (ver IntroSplash) — sin peso de video ni
// parpadeo de carga: arranca al instante. Es una "C" abierta (como
// public/logos/logo.png), no un círculo cerrado: arranca arriba, gira en
// sentido ANTIhorario (12 → 9 → 6 → 3, como las manecillas del reloj
// yendo "al revés") y se detiene cerca de la 1, dejando un hueco arriba a
// la derecha — mismo ángulo de inicio/arco/tamaños que el logo real.
const DOT_RADII = [14, 12, 11, 10, 10, 13, 11, 13, 17, 16, 10, 8, 7]
const ARC_DEGREES = 320
const RING_RADIUS = 72
const CENTER = 100
const STAGGER_MS = 80
const DOT_DURATION_MS = 360

// Duración total de la animación (último punto + su propio tiempo, más el
// fundido del nombre) — IntroSplash la usa para saber cuándo pasar a la
// fase de disolución hacia Inicio.
export const INTRO_ANIMATION_MS =
  (DOT_RADII.length - 1) * STAGGER_MS + DOT_DURATION_MS + 650 /* delay del nombre */ + 600 /* su propia duración */ + 300 /* pausa final */

export default function IntroLogoMark() {
  const wordDelay = (DOT_RADII.length - 1) * STAGGER_MS + DOT_DURATION_MS - 150

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 200" className="w-24 h-24 sm:w-28 sm:h-28" aria-hidden="true">
        {DOT_RADII.map((r, i) => {
          // Ángulo decreciente = sentido antihorario en coordenadas SVG
          // (y crece hacia abajo). Arranca en -90° (arriba) y recorre
          // ARC_DEGREES hacia atrás, no las vueltas completas 360°.
          const theta = (-90 - (i * ARC_DEGREES) / (DOT_RADII.length - 1)) * (Math.PI / 180)
          const cx = CENTER + RING_RADIUS * Math.cos(theta)
          const cy = CENTER + RING_RADIUS * Math.sin(theta)
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              className="intro-dot fill-brand-700"
              // fill-box + center: la escala del "pop" ocurre alrededor del
              // propio centro del punto, sin importar dónde esté en el
              // círculo (por defecto, el origen de transform en SVG es el
              // (0,0) de todo el <svg>, no el del elemento).
              style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: `${i * STAGGER_MS}ms` }}
            />
          )
        })}
      </svg>

      <div className="intro-word mt-4 text-center" style={{ animationDelay: `${wordDelay}ms` }}>
        <p className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-brand-800">CONDES</p>
        <p className="font-body text-[0.6rem] sm:text-xs tracking-[0.35em] text-brand-600 mt-0.5">CORPORACIÓN</p>
      </div>
    </div>
  )
}
