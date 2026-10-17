// Recreación en SVG/CSS del logo de puntos "dibujándose"
// del video de intro original.
//
// La animación mantiene EXACTAMENTE la duración original.
//
// Características:
// - Forma de C más cerrada.
// - Mayor separación entre los círculos.
// - Primer círculo arriba a la derecha.
// - Primer círculo pequeño.
// - Los círculos crecen progresivamente.
// - Los círculos más grandes quedan en la parte inferior.
// - Recorrido en sentido antihorario.
//
// SVG:
// x → derecha
// y → abajo


// Tamaño de cada punto.
//
// El primero es el más pequeño.
// El tamaño aumenta progresivamente hasta llegar
// a los puntos grandes de la parte inferior.
const DOT_RADII = [
  6,    // 1.º — arriba derecha
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
  11.5,
  12    // último — abajo derecha
]


// Posiciones de los puntos.
//
// La C está más cerrada que en las versiones anteriores.
// La abertura está hacia la derecha.
//
// El recorrido comienza arriba a la derecha:
//
//        1 ●
//      ●
//    ●
//   ●
//  ●
// ●
// ●
// ●
//  ●
//   ●
//     ●
//       ●
//          ● 13
//
// Es decir:
// pequeño → pequeño → ... → grande
//
// Los puntos están ligeramente más separados para que
// no formen una cadena demasiado compacta.
const DOT_POSITIONS = [
  // ─────────────────────────
  // INICIO — ARRIBA DERECHA
  // ─────────────────────────
  { x: 139, y: 50 },

  // ─────────────────────────
  // PARTE SUPERIOR
  // ─────────────────────────
  { x: 116, y: 37 },
  { x: 91, y: 34 },
  { x: 67, y: 41 },

  // ─────────────────────────
  // LADO IZQUIERDO SUPERIOR
  // ─────────────────────────
  { x: 48, y: 55 },
  { x: 37, y: 74 },

  // ─────────────────────────
  // LADO IZQUIERDO
  // ─────────────────────────
  { x: 33, y: 97 },
  { x: 35, y: 120 },

  // ─────────────────────────
  // LADO IZQUIERDO INFERIOR
  // ─────────────────────────
  { x: 44, y: 141 },
  { x: 59, y: 157 },

  // ─────────────────────────
  // PARTE INFERIOR
  // ─────────────────────────
  { x: 80, y: 167 },
  { x: 104, y: 169 },

  // ─────────────────────────
  // FINAL — ABAJO DERECHA
  // ─────────────────────────
  { x: 128, y: 160 }
]


// NO CAMBIAR.
// Tiempo entre la aparición de cada punto.
const STAGGER_MS = 140


// NO CAMBIAR.
// Duración individual de cada punto.
const DOT_DURATION_MS = 500


// Duración de la animación del nombre.
// Debe coincidir con introWordReveal en index.css.
const WORD_REVEAL_MS = 850


// Duración total de la animación.
//
// Se conserva EXACTAMENTE la fórmula original.
export const INTRO_ANIMATION_MS =
  (DOT_RADII.length - 1) * STAGGER_MS +
  DOT_DURATION_MS +
  350 /* pausa antes del nombre */ +
  WORD_REVEAL_MS +
  500 /* pausa final, logo completo en pantalla */


export default function IntroLogoMark() {

  // El nombre comienza prácticamente cuando termina
  // la aparición del último punto.
  //
  // Se mantiene exactamente igual que en la versión original.
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

          const { x, y } = DOT_POSITIONS[i]

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              className="intro-dot fill-brand-700"

              style={{
                // La transformación ocurre alrededor
                // del centro del propio círculo.
                transformBox: 'fill-box',
                transformOrigin: 'center',

                // MISMO retraso entre puntos.
                animationDelay: `${i * STAGGER_MS}ms`
              }}
            />
          )
        })}

      </svg>


      {/* 
        Hasta que no le toca su turno, este bloque mide 0 de alto
        y permanece oculto.
        
        Cuando comienza la animación del nombre, el bloque crece
        y el contenedor de IntroSplash centra nuevamente el conjunto.
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