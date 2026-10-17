// Recreación en SVG/CSS del logo de puntos "dibujándose".
//
// Características:
// - 12 círculos exactamente.
// - Todos están distribuidos uniformemente sobre una circunferencia.
// - La C es circular y más cerrada.
// - La abertura queda hacia la derecha.
// - El primer círculo aparece arriba a la derecha.
// - El primer círculo es pequeño.
// - Los círculos crecen suavemente durante el recorrido.
// - El último círculo queda abajo a la derecha.
//
// La duración de la animación se mantiene EXACTAMENTE igual.


/*
 * TAMAÑO DE LOS CÍRCULOS
 *
 * El primero es pequeño y los siguientes crecen suavemente.
 * El crecimiento es mucho menor que en las versiones anteriores.
 *
 * 6 → 6.5 → 7 → ... → 11
 */
const DOT_RADII = [
  6,
  6.5,
  7,
  7.5,
  8,
  8.5,
  9,
  9.5,
  10,
  10.5,
  11,
  11
]


/*
 * GEOMETRÍA DE LA C
 *
 * 300° de recorrido dejan una abertura de 60°.
 *
 * Como el primer punto comienza a -35° y avanzamos
 * en sentido antihorario, la secuencia termina en +35°.
 *
 *      -35°  ← primer punto, arriba derecha
 *        ↓
 *        C
 *        ↓
 *      +35°  ← último punto, abajo derecha
 *
 * Los 12 puntos están separados exactamente por el mismo
 * ángulo:
 *
 * 300° / 11 = 27.27°
 *
 * Al estar todos sobre la misma circunferencia, la distancia
 * entre los centros de puntos consecutivos también es uniforme.
 */
const ARC_DEGREES = 300

const START_ANGLE = -35

const RING_RADIUS = 58

const CENTER = 100


/*
 * TIEMPOS
 *
 * NO CAMBIAR.
 *
 * Se mantienen exactamente los valores de la animación original.
 */
const STAGGER_MS = 140

const DOT_DURATION_MS = 500


/*
 * Duración de la animación del nombre.
 * Debe coincidir con introWordReveal en index.css.
 */
const WORD_REVEAL_MS = 850


/*
 * DURACIÓN TOTAL
 *
 * 11 intervalos × 140 ms
 * + 500 ms del último punto
 * + 350 ms de pausa
 * + 850 ms del nombre
 * + 500 ms de pausa final
 *
 * = 3880 ms
 */
export const INTRO_ANIMATION_MS =
  (DOT_RADII.length - 1) * STAGGER_MS +
  DOT_DURATION_MS +
  350 /* pausa antes del nombre */ +
  WORD_REVEAL_MS +
  500 /* pausa final, logo completo en pantalla */


export default function IntroLogoMark() {

  /*
   * El nombre comienza prácticamente cuando termina
   * la aparición del último círculo.
   *
   * Se conserva exactamente el cálculo original.
   */
  const wordDelay =
    (DOT_RADII.length - 1) * STAGGER_MS +
    DOT_DURATION_MS -
    100


  return (
    <div className="flex flex-col items-center">

      <svg
        viewBox="0 0 200 200"
        className="w-36 h-36 sm:w-44 sm:h-44"
        aria-hidden="true"
      >

        {DOT_RADII.map((r, i) => {

          /*
           * Distribución circular uniforme.
           *
           * El primer punto está arriba a la derecha.
           * Cada punto siguiente avanza el mismo ángulo
           * en sentido antihorario.
           */
          const theta =
            (
              START_ANGLE -
              (i * ARC_DEGREES) / (DOT_RADII.length - 1)
            ) * (Math.PI / 180)


          /*
           * Conversión de coordenadas polares
           * a coordenadas SVG.
           */
          const cx =
            CENTER + RING_RADIUS * Math.cos(theta)

          const cy =
            CENTER + RING_RADIUS * Math.sin(theta)


          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              className="intro-dot fill-brand-700"

              style={{
                /*
                 * El efecto de aparición/escala ocurre
                 * alrededor del propio centro del círculo.
                 */
                transformBox: 'fill-box',
                transformOrigin: 'center',

                /*
                 * Cada círculo aparece 140 ms después
                 * del anterior.
                 */
                animationDelay: `${i * STAGGER_MS}ms`
              }}
            />
          )
        })}

      </svg>


      {/*
       * NOMBRE DE LA EMPRESA
       *
       * Este bloque conserva exactamente el comportamiento
       * que tenía originalmente.
       */}

      <div
        className="intro-word-wrap overflow-hidden"
        style={{
          animationDelay: `${wordDelay}ms`
        }}
      >

        <div className="pt-4 text-center">

          <p className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-brand-800">
            CONDES
          </p>

          <p className="font-body text-[0.6rem] sm:text-xs tracking-[0.35em] text-brand-600 mt-0.5">
            CORPORACIÓN
          </p>

        </div>

      </div>

    </div>
  )
}