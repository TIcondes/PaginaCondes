// Recreación en SVG/CSS del logo de puntos "dibujándose"
// del video de intro original.
//
// La animación conserva EXACTAMENTE la duración original.
// Solo se modifica:
// - La forma del logo para que sea una "C" real.
// - El primer punto aparece abajo a la derecha.
// - El primer punto es el más pequeño.
// - Los puntos aumentan progresivamente de tamaño.
// - Se mantiene una separación visual continua entre los puntos.
//
// La animación comienza en el punto inferior derecho y avanza
// en sentido antihorario alrededor de la C.

const DOT_RADII = [
  8,   // 1.º — abajo a la derecha, pequeño
  10,
  12,
  14,
  16,
  17,
  18,
  18,
  17,
  16,
  14,
  12,
  10
]

// Posiciones de los puntos.
// La forma está diseñada como una C abierta hacia la derecha.
//
// El primer punto está abajo a la derecha.
// Los siguientes avanzan en sentido antihorario.
//
// El sistema de coordenadas del SVG es:
// x → derecha
// y → abajo
const DOT_POSITIONS = [
  // Inicio: abajo a la derecha
  { x: 148, y: 150 },

  // Parte inferior
  { x: 128, y: 163 },
  { x: 105, y: 168 },
  { x: 82, y: 164 },
  { x: 62, y: 151 },

  // Lado izquierdo inferior
  { x: 47, y: 134 },
  { x: 40, y: 112 },

  // Lado izquierdo superior
  { x: 40, y: 89 },
  { x: 47, y: 68 },
  { x: 62, y: 50 },

  // Parte superior
  { x: 82, y: 38 },
  { x: 105, y: 33 },
  { x: 127, y: 38 }
]

// Duración entre la aparición de cada punto.
// NO CAMBIAR: debe conservar la velocidad de la animación original.
const STAGGER_MS = 140

// Duración individual de cada punto.
// NO CAMBIAR.
const DOT_DURATION_MS = 500

// Duración de la animación del nombre.
// Debe coincidir con introWordReveal en index.css.
const WORD_REVEAL_MS = 850

// Duración total de la animación.
//
// Se conserva EXACTAMENTE la misma fórmula y tiempos
// que tenía la versión original.
export const INTRO_ANIMATION_MS =
  (DOT_RADII.length - 1) * STAGGER_MS +
  DOT_DURATION_MS +
  350 /* pausa antes del nombre */ +
  WORD_REVEAL_MS +
  500 /* pausa final, logo completo en pantalla */


export default function IntroLogoMark() {

  // El nombre empieza prácticamente al terminar
  // la aparición del último punto.
  //
  // Se conserva el mismo cálculo original.
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

              // La transformación ocurre alrededor
              // del propio centro del círculo.
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',

                // Mantiene exactamente el mismo
                // retraso entre puntos.
                animationDelay: `${i * STAGGER_MS}ms`
              }}
            />
          )
        })}

      </svg>


      {/* 
        Hasta que no le toca su turno, este bloque mide 0 de alto
        (max-height: 0 + overflow hidden).

        Así la C queda sola y centrada inicialmente.

        Cuando aparece el nombre, el bloque crece y el contenedor
        de IntroSplash centra nuevamente el conjunto verticalmente,
        haciendo que la C suba para dejar espacio al texto.
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