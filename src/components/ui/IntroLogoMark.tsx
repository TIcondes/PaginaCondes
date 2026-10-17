// Recreación en SVG/CSS del logo de puntos "dibujándose"
// del video de intro original.
//
// La duración de la animación se mantiene EXACTAMENTE igual.
// Se ajusta únicamente la geometría del logo.
//
// Características:
// - La C está más cerrada.
// - Los círculos están más separados entre sí.
// - Los círculos conservan el tamaño actual.
// - El primer círculo aparece abajo a la derecha.
// - El primer círculo es el más pequeño.
// - Los siguientes aumentan progresivamente.
// - La animación continúa en sentido antihorario.

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
//
// La trayectoria forma una C más cerrada.
// Los puntos tienen mayor separación entre sí para
// evitar que se vean como una cadena demasiado compacta.
//
// El primer punto está abajo a la derecha.
// Después se recorre la C en sentido antihorario.
const DOT_POSITIONS = [
  // ─────────────────────────
  // INICIO — abajo derecha
  // ─────────────────────────
  { x: 148, y: 146 },

  // ─────────────────────────
  // PARTE INFERIOR
  // ─────────────────────────
  { x: 126, y: 161 },
  { x: 101, y: 167 },
  { x: 76, y: 161 },
  { x: 57, y: 146 },

  // ─────────────────────────
  // LADO IZQUIERDO
  // ─────────────────────────
  { x: 45, y: 125 },
  { x: 40, y: 101 },
  { x: 45, y: 77 },

  // ─────────────────────────
  // PARTE SUPERIOR
  // ─────────────────────────
  { x: 57, y: 56 },
  { x: 76, y: 41 },
  { x: 101, y: 35 },
  { x: 126, y: 41 },

  // ─────────────────────────
  // EXTREMO SUPERIOR DERECHO
  // ─────────────────────────
  { x: 143, y: 55 }
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
// Se conserva exactamente la fórmula original.
export const INTRO_ANIMATION_MS =
  (DOT_RADII.length - 1) * STAGGER_MS +
  DOT_DURATION_MS +
  350 /* pausa antes del nombre */ +
  WORD_REVEAL_MS +
  500 /* pausa final, logo completo en pantalla */


export default function IntroLogoMark() {

  // Se conserva exactamente el cálculo original.
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
                transformBox: 'fill-box',
                transformOrigin: 'center',
                animationDelay: `${i * STAGGER_MS}ms`
              }}
            />
          )
        })}

      </svg>

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