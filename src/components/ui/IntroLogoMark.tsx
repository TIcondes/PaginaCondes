// Recreación en SVG/CSS del logo de puntos "dibujándose" en sentido
// horario que traía el video de intro original (ver IntroSplash) — sin
// peso de video ni parpadeo de carga: arranca al instante.

// Radio de cada punto, en el orden en que aparecen (empezando arriba,
// sentido horario). Varían de tamaño para que se vea igual de orgánico
// que el mazo de puntos de la marca, no un spinner parejo.
const DOT_RADII = [9, 7, 5.5, 5, 6, 7.5, 9.5, 11.5, 13.5, 14.5, 12.5, 10.5, 9, 8, 8, 9]
const RING_RADIUS = 72
const CENTER = 100
const STAGGER_MS = 65
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
          const theta = -Math.PI / 2 + (i * 2 * Math.PI) / DOT_RADII.length
          const cx = CENTER + RING_RADIUS * Math.cos(theta)
          const cy = CENTER + RING_RADIUS * Math.sin(theta)
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              className="intro-dot fill-gray-900"
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
        <p className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-gray-900">CONDES</p>
        <p className="font-body text-[0.6rem] sm:text-xs tracking-[0.35em] text-gray-500 mt-0.5">CORPORACIÓN</p>
      </div>
    </div>
  )
}
