// Recreación en SVG/CSS del logo de puntos "dibujándose"
// del video de intro original.
//
// La duración de la animación se mantiene EXACTAMENTE igual.
// Solo se ajusta la geometría y el tamaño de los puntos.
//
// El logo forma una "C" abierta hacia la derecha.
// El primer punto aparece abajo a la derecha y es el más pequeño.
// Los siguientes puntos van creciendo progresivamente.

const DOT_RADII = [
  6,   // 1.º — abajo a la derecha
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  14,
  13,
  11,
  9
]

// Posiciones de los puntos.
// La C está ligeramente más cerrada que antes.
// El primer punto está abajo a la derecha y el recorrido
// continúa en sentido antihorario.
//
// SVG:
// x → derecha
// y → abajo
const DOT_POSITIONS = [
  // Inicio — abajo a la derecha
  { x: 145, y: 148 },

  // Parte inferior
  { x: 128, y: 160 },
  { x: 108, y: 166 },
  { x: 87, y: 163 },
  { x: 68, y: 153 },

  // Lado izquierdo inferior
  { x: 53, y: 139 },
  { x: 45, y: 121 },
  { x: 42, y: 101 },

  // Lado izquierdo superior
  { x: 45, y: 81 },
  { x: 53, y: 63 },
  { x: 68, y: 49 },

  // Parte superior
  { x: 87, y: 39 },
  { x: 108, y: 36 }
]

// NO CAMBIAR.
// Mantiene exactamente la velocidad original.
const STAGGER_MS = 140

// NO CAMBIAR.
const DOT_DURATION_MS = 500

// Duración de la animación del nombre.
// Debe coincidir con introWordReveal en index.css.
const WORD_REVEAL_MS = 850

// Duración total de la animación.
// Se mantiene exactamente igual que en la versión original.
export const INTRO_ANIMATION_MS =
  (DOT_RADII.length - 1) * STAGGER_MS +
  DOT_DURATION_MS +
  350 /* pausa antes del nombre */ +
  WORD_REVEAL_MS +
  500 /* pausa final, logo completo en pantalla */


export default function IntroLogoMark() {

  // El nombre comienza prácticamente al terminar
  // la aparición del último punto.
  //
  // Se conserva el cálculo original.
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
                // El efecto de escala se hace alrededor
                // del propio centro del círculo.
                transformBox: 'fill-box',
                transformOrigin: 'center',

                // MISMO tiempo entre puntos.
                animationDelay: `${i * STAGGER_MS}ms`
              }}
            />
          )
        })}

      </svg>


      {/* 
        El nombre permanece oculto hasta que comienza
        su animación.
        
        Esto mantiene el comportamiento original:
        primero aparece la C y después entra CONDES.
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