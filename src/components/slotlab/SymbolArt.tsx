import type { JSX } from 'react'
import type { PavilionType, SymbolId } from '../../game/types'

/**
 * Авторские слот-символы в стиле золотой гравюры по слоновой кости.
 * Монохром: цвет задаётся через currentColor (обёртка ставит --gold-mid).
 * Премиальные символы получают угловые орнаменты-флоришы.
 */

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/** Угловой орнамент для премиальных символов */
function Flourish() {
  return (
    <g {...STROKE} strokeWidth={1.4} opacity={0.55}>
      <path d="M6 15 V6 H15" />
      <path d="M58 15 V6 H49" />
      <path d="M6 49 V58 H15" />
      <path d="M58 49 V58 H49" />
      <circle cx="19" cy="10.5" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="45" cy="10.5" r="0.8" fill="currentColor" stroke="none" />
    </g>
  )
}

const carnival = (
  <g {...STROKE}>
    {/* Шатёр: купол с фестонами */}
    <path d="M32 14 C23 22 15 32 11 47 Q21.5 43 32 47 Q42.5 43 53 47 C49 32 41 22 32 14 Z" />
    {/* Внутренние складки */}
    <path d="M32 14 C28.5 25 26 36 25.5 45.2" opacity={0.5} />
    <path d="M32 14 C35.5 25 38 36 38.5 45.2" opacity={0.5} />
    <path d="M32 14 C30.5 25 29.5 36 29 45.4 L35 45.4 C34.5 36 33.5 25 32 14 Z" fill="currentColor" opacity={0.22} stroke="none" />
    {/* Флаг на мачте */}
    <path d="M32 14 V7" />
    <path d="M32 7.5 L41 10 L32 12.5 Z" fill="currentColor" opacity={0.85} stroke="none" />
    {/* Основание */}
    <path d="M8 54 H56" />
    <path d="M14 50.5 H50" opacity={0.35} />
    <Flourish />
  </g>
)

const ticket = (
  <g {...STROKE}>
    {/* Розетка Scatter вокруг */}
    <circle cx="32" cy="32" r="29" strokeWidth={1.2} strokeDasharray="2 5" opacity={0.55} />
    {/* Билет */}
    <g transform="rotate(-7 32 32)">
      <rect x="9" y="21" width="46" height="23" rx="2.5" />
      {/* Перфорация отрыва */}
      <path d="M41 23 V42" strokeWidth={1.3} strokeDasharray="2.6 3" opacity={0.7} />
      {/* Внутренняя рамка */}
      <rect x="12.5" y="24.5" width="24" height="16" rx="1.5" strokeWidth={1.1} opacity={0.45} />
      {/* Звезда прокола */}
      <path d="M47.5 28.5 L48.6 31 L51.2 31.2 L49.2 33 L49.9 35.6 L47.5 34.2 L45.1 35.6 L45.8 33 L43.8 31.2 L46.4 31 Z" fill="currentColor" opacity={0.8} stroke="none" />
      {/* Штрихи-«текст» */}
      <path d="M16 30 H30" opacity={0.5} strokeWidth={1.4} />
      <path d="M16 34 H26" opacity={0.5} strokeWidth={1.4} />
    </g>
  </g>
)

const star = (
  <g {...STROKE}>
    {/* Лучи */}
    <g opacity={0.6} strokeWidth={1.5}>
      <path d="M32 5 V1" /><path d="M32 51 V55" />
      <path d="M9 28 H5" /><path d="M55 28 H59" />
      <path d="M15.5 11.5 L12.6 8.6" /><path d="M48.5 11.5 L51.4 8.6" />
      <path d="M15.5 44.5 L12.6 47.4" /><path d="M48.5 44.5 L51.4 47.4" />
    </g>
    {/* Звезда: внешний + внутренний контур */}
    <path d="M32 9 L37 22.1 L51 22.8 L40.1 31.6 L43.8 45.2 L32 37.5 L20.2 45.2 L23.9 31.6 L13 22.8 L27 22.1 Z" />
    <path
      d="M32 9 L37 22.1 L51 22.8 L40.1 31.6 L43.8 45.2 L32 37.5 L20.2 45.2 L23.9 31.6 L13 22.8 L27 22.1 Z"
      transform="translate(32 27.2) scale(0.55) translate(-32 -27.2)"
      opacity={0.5}
      strokeWidth={1.6}
    />
    {/* Лента WILD */}
    <path d="M13 50 C21 47.4 43 47.4 51 50 L47.5 58 C40 55.6 24 55.6 16.5 58 Z" fill="currentColor" opacity={0.16} />
    <text
      x="32"
      y="56"
      textAnchor="middle"
      fontSize="7"
      fontFamily="Cinzel, serif"
      fontWeight="700"
      letterSpacing="2.5"
      fill="currentColor"
      stroke="none"
    >
      WILD
    </text>
    <Flourish />
  </g>
)

const diamond = (
  <g {...STROKE}>
    {/* Огранка: таблица, корона, павильон */}
    <path d="M14 26 L21 15 H43 L50 26" />
    <path d="M14 26 H50" />
    <path d="M14 26 L32 53 L50 26" />
    <path d="M21 15 L26 26 L32 15 M43 15 L38 26 L32 15" opacity={0.55} strokeWidth={1.5} />
    <path d="M26 26 L32 53 L38 26" opacity={0.55} strokeWidth={1.5} />
    <path d="M14 26 L20 24 H44 L50 26" opacity={0.3} strokeWidth={1.2} />
    {/* Блики-искры */}
    <path d="M24 6 V11 M21.5 8.5 H26.5" strokeWidth={1.4} opacity={0.7} />
    <path d="M46 8.5 V12 M44.2 10.2 H47.8" strokeWidth={1.2} opacity={0.55} />
    <Flourish />
  </g>
)

const carousel = (
  <g {...STROKE}>
    {/* Навес: конус с фестонами */}
    <path d="M32 10 L13 26 H51 Z" />
    <path d="M13 26 Q16 30.5 19.25 26 Q22.5 30.5 25.75 26 Q29 30.5 32.25 26 Q35.5 30.5 38.75 26 Q42 30.5 45.25 26 Q48.5 30.5 51 26" opacity={0.8} strokeWidth={1.6} />
    {/* Шар наверху и мачта */}
    <circle cx="32" cy="6.5" r="2.2" fill="currentColor" opacity={0.85} stroke="none" />
    <path d="M32 12 V46" opacity={0.8} />
    {/* Лошадка */}
    <path d="M23.5 40 C23.5 35.5 27.5 33.5 31.5 34.5 C35.5 32.5 39.5 34.5 39.5 38.5 C40.5 41.5 38.5 44 35.5 44 H27.5 C24.5 44 22.8 42.4 23.5 40 Z" />
    <path d="M39 36.5 L44.5 31.5 L46.5 34.5 L42 38.5" />
    <path d="M27.5 44 V50 M35.5 44 V50" />
    <path d="M23.5 40 L19.5 37" opacity={0.7} strokeWidth={1.5} />
    {/* Основание */}
    <path d="M14 54 H50" />
    <path d="M20 50.5 H44" opacity={0.35} />
  </g>
)

const mask = (
  <g {...STROKE}>
    {/* Лицо комедии */}
    <path d="M18 17 C18 13.5 24.5 11.5 32 11.5 C39.5 11.5 46 13.5 46 17 C46 29 42 38.5 32 38.5 C22 38.5 18 29 18 17 Z" />
    {/* Глаза */}
    <path d="M23.5 23 Q26.5 20.5 29.5 23" />
    <path d="M34.5 23 Q37.5 20.5 40.5 23" />
    {/* Улыбка */}
    <path d="M24 29 Q32 35.5 40 29" />
    <path d="M28 32.5 Q32 35 36 32.5" opacity={0.5} strokeWidth={1.4} />
    {/* Ленты */}
    <path d="M22 38 C20 44 18 48.5 14 53" opacity={0.75} />
    <path d="M42 38 C44 44 46 48.5 50 53" opacity={0.75} />
    <path d="M14 53 L11.5 50 M14 53 L17.5 51" opacity={0.55} strokeWidth={1.4} />
    <path d="M50 53 L52.5 50 M50 53 L46.5 51" opacity={0.55} strokeWidth={1.4} />
  </g>
)

const balloon = (
  <g {...STROKE}>
    {/* Большой шар */}
    <path d="M23 12 C30 12 33.5 18 33.5 24.5 C33.5 31.5 29 36.5 23.5 36.5 C18 36.5 13.5 31.5 13.5 24.5 C13.5 18 17 12 23 12 Z" />
    <path d="M18.5 19 C18.8 16 20.5 14.2 22.5 14" opacity={0.5} strokeWidth={1.4} />
    <path d="M21.5 36.5 L23.5 39.5 L25.5 36.5" />
    {/* Малый шар */}
    <path d="M41.5 20 C46.5 20 49 24 49 28.5 C49 33.5 45.5 37 41.5 37 C37.5 37 34 33.5 34 28.5 C34 24 36.5 20 41.5 20 Z" />
    <path d="M39.5 37 L41.5 39.8 L43.5 37" />
    {/* Нити */}
    <path d="M23.5 39.5 C21.5 45 25.5 49 22.5 55" opacity={0.8} strokeWidth={1.5} />
    <path d="M41.5 39.8 C43.5 46 39.5 50 42.5 55" opacity={0.8} strokeWidth={1.5} />
  </g>
)

const target = (
  <g {...STROKE}>
    {/* Кольца */}
    <circle cx="29" cy="33" r="20" />
    <circle cx="29" cy="33" r="13" opacity={0.65} strokeWidth={1.6} />
    <circle cx="29" cy="33" r="6.5" />
    <circle cx="29" cy="33" r="1.8" fill="currentColor" stroke="none" />
    {/* Штриховка между кольцами */}
    <path d="M29 20 A13 13 0 0 1 40.5 26.5" opacity={0.35} strokeWidth={1.2} />
    <path d="M17.5 39.5 A20 20 0 0 1 13.5 27" opacity={0.35} strokeWidth={1.2} />
    {/* Стрела */}
    <path d="M55 9 L35.5 28.5" />
    <path d="M36 28.5 L32.2 32.3 L37.6 33.2 Z" fill="currentColor" opacity={0.9} stroke="none" />
    <path d="M55 9 L49.5 8 M55 9 L56 14.5" />
    <path d="M51.5 12.5 L47 11 M51.5 12.5 L50.5 8.2" opacity={0.6} strokeWidth={1.4} />
  </g>
)

const ART: Record<SymbolId, JSX.Element> = {
  carnival,
  ticket,
  star,
  diamond,
  carousel,
  mask,
  balloon,
  target,
}

export function SymbolArt({
  id,
  size = 32,
  className,
}: {
  id: SymbolId
  size?: number
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`symbol-art ${className ?? ''}`}
      aria-hidden="true"
      focusable="false"
    >
      {ART[id]}
    </svg>
  )
}

/* ---------- Иконки павильонов Prize Parade ---------- */

const pavilionMultiplier = (
  <g {...STROKE}>
    <circle cx="24" cy="24" r="3" fill="currentColor" stroke="none" />
    <g strokeWidth={2.2}>
      <path d="M24 15 V5" /><path d="M24 33 V43" />
      <path d="M15 24 H5" /><path d="M33 24 H43" />
      <path d="M17.6 17.6 L10.6 10.6" /><path d="M30.4 17.6 L37.4 10.6" />
      <path d="M17.6 30.4 L10.6 37.4" /><path d="M30.4 30.4 L37.4 37.4" />
    </g>
    <circle cx="10.6" cy="10.6" r="1.7" fill="currentColor" stroke="none" opacity={0.75} />
    <circle cx="37.4" cy="10.6" r="1.7" fill="currentColor" stroke="none" opacity={0.75} />
    <circle cx="10.6" cy="37.4" r="1.7" fill="currentColor" stroke="none" opacity={0.75} />
    <circle cx="37.4" cy="37.4" r="1.7" fill="currentColor" stroke="none" opacity={0.75} />
    <circle cx="24" cy="24" r="9" opacity={0.4} strokeWidth={1.3} />
  </g>
)

const pavilionSpins = (
  <g {...STROKE}>
    <g transform="rotate(-8 24 24)">
      <rect x="6" y="17" width="30" height="15" rx="1.5" />
      <path d="M27 19 V30" strokeWidth={1.2} strokeDasharray="2 2.6" opacity={0.7} />
      <path d="M10 22 H21" opacity={0.5} strokeWidth={1.3} />
      <path d="M10 26 H18" opacity={0.5} strokeWidth={1.3} />
    </g>
    <g transform="rotate(7 26 30)">
      <rect x="12" y="26" width="30" height="15" rx="1.5" />
      <path d="M33 28 V39" strokeWidth={1.2} strokeDasharray="2 2.6" opacity={0.7} />
      <path d="M36.5 31.5 L37.6 34 L40.2 34.2 L38.2 36 L38.9 38.6 L36.5 37.2 L34.1 38.6 L34.8 36 L32.8 34.2 L35.4 34 Z" fill="currentColor" opacity={0.8} stroke="none" />
    </g>
  </g>
)

const pavilionWild = (
  <g {...STROKE}>
    <path d="M24 8 L27.2 16.6 L36.4 17.1 L29.2 22.8 L31.8 31.6 L24 26.5 L16.2 31.6 L18.8 22.8 L11.6 17.1 L20.8 16.6 Z" />
    <path d="M11 34 L12.6 38.3 L17.2 38.6 L13.6 41.4 L14.9 45.8 L11 43.3 L7.1 45.8 L8.4 41.4 L4.8 38.6 L9.4 38.3 Z" opacity={0.75} strokeWidth={1.6} />
    <path d="M37 34 L38.6 38.3 L43.2 38.6 L39.6 41.4 L40.9 45.8 L37 43.3 L33.1 45.8 L34.4 41.4 L30.8 38.6 L35.4 38.3 Z" opacity={0.75} strokeWidth={1.6} />
    <circle cx="41" cy="12" r="1.4" fill="currentColor" stroke="none" opacity={0.7} />
    <circle cx="8" cy="13" r="1.4" fill="currentColor" stroke="none" opacity={0.7} />
  </g>
)

const PAVILION_ART: Record<PavilionType, JSX.Element> = {
  multiplier: pavilionMultiplier,
  spins: pavilionSpins,
  wild: pavilionWild,
}

export function PavilionArt({
  type,
  size = 44,
}: {
  type: PavilionType
  size?: number
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className="symbol-art"
      aria-hidden="true"
      focusable="false"
    >
      {PAVILION_ART[type]}
    </svg>
  )
}
