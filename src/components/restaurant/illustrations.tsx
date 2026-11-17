import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { FC } from 'react'

export type BowlVariant = 'special' | 'classic' | 'ajitama' | 'tsukemen'

const Chashu: FC<{ x: number; y: number; r?: number; rot?: number }> = ({ x, y, r = 22, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <ellipse rx={r} ry={r * 0.78} fill='#c98a6a' />
    <ellipse rx={r * 0.78} ry={r * 0.58} fill='#e6b199' />
    <path d={`M${-r * 0.5} ${-r * 0.1} q${r * 0.5} ${-r * 0.35} ${r} 0`} stroke='#c98a6a' strokeWidth='2' fill='none' />
    <path d={`M${-r * 0.35} ${r * 0.22} q${r * 0.35} ${-r * 0.2} ${r * 0.7} 0`} stroke='#d79c80' strokeWidth='1.6' fill='none' />
  </g>
)

const Egg: FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <ellipse rx='17' ry='13' fill='#f6efe2' />
    <ellipse rx='9' ry='7' cx='1' fill='#f0a23a' />
    <ellipse rx='5' ry='3.5' cx='2' cy='-1' fill='#f7c35c' />
  </g>
)

const Negi: FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    {[
      [0, 0],
      [9, 4],
      [-8, 6],
      [4, 11],
      [14, -5],
      [-4, -7],
    ].map(([dx, dy], i) => (
      <circle key={i} cx={dx} cy={dy} r='3.4' fill='#7fb24a' stroke='#5e8f33' strokeWidth='1' />
    ))}
  </g>
)

// どんぶりの俯瞰イラスト。variant でトッピングを変える
export const RamenBowl: FC<{ variant?: BowlVariant; size?: number; steam?: boolean }> = ({
  variant = 'special',
  size = 220,
  steam = false,
}) => {
  const broth = variant === 'tsukemen' ? '#7a4a26' : '#c9813f'
  return (
    <svg viewBox='0 0 240 240' width={size} height={size} role='img' aria-label='らーめん'>
      {steam && (
        <g stroke='rgba(255,255,255,0.55)' strokeWidth='3' fill='none' strokeLinecap='round'>
          <SteamPath d='M92 40 q-10 -14 0 -26 q10 -12 0 -24' />
          <SteamPath d='M120 34 q-10 -14 0 -26 q10 -12 0 -24' style={{ animationDelay: '0.6s' }} />
          <SteamPath d='M148 40 q-10 -14 0 -26 q10 -12 0 -24' style={{ animationDelay: '1.2s' }} />
        </g>
      )}
      <ellipse cx='120' cy='128' rx='104' ry='104' fill='#1b1411' />
      <circle cx='120' cy='128' r='100' fill='#2b211c' />
      <circle cx='120' cy='128' r='100' fill='none' stroke='#b8322a' strokeWidth='6' strokeDasharray='10 8' />
      <circle cx='120' cy='128' r='86' fill={broth} />
      <circle cx='108' cy='112' r='70' fill='rgba(255,226,170,0.18)' />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={78 + i * 21} cy={96 + (i % 2) * 70} r={3 + (i % 3)} fill='rgba(255,236,190,0.55)' />
      ))}
      {variant === 'tsukemen' ? (
        <>
          <Chashu x={98} y={120} r={26} rot={-12} />
          <Negi x={148} y={104} />
          <Negi x={140} y={160} />
          <path d='M70 150 q20 -8 40 0' stroke='#d9b77a' strokeWidth='5' fill='none' strokeLinecap='round' />
        </>
      ) : (
        <>
          <g stroke='#f1d58f' strokeWidth='4' fill='none' strokeLinecap='round'>
            <path d='M64 150 q12 -10 24 0 t24 0 t24 0' />
            <path d='M70 162 q12 -10 24 0 t24 0 t24 0' />
          </g>
          <rect
            x='140'
            y='62'
            width='42'
            height='60'
            rx='3'
            fill='#1f2a1c'
            transform='rotate(18 160 92)'
            stroke='#2f3f2a'
            strokeWidth='2'
          />
          {variant !== 'classic' && <Chashu x={92} y={104} r={24} rot={-18} />}
          {variant === 'special' && <Chashu x={128} y={96} r={22} rot={14} />}
          {variant === 'classic' && <Chashu x={104} y={100} r={22} rot={-6} />}
          {(variant === 'special' || variant === 'ajitama') && (
            <>
              <Egg x={148} y={152} rot={-20} />
              {variant === 'ajitama' && <Egg x={170} y={134} rot={30} />}
            </>
          )}
          <g stroke='#d9b77a' strokeWidth='6' strokeLinecap='round'>
            <line x1='76' y1='176' x2='96' y2='184' />
            <line x1='84' y1='168' x2='104' y2='174' />
          </g>
          <Negi x={120} y={136} />
        </>
      )}
    </svg>
  )
}

const rise = keyframes`
  0% { opacity: 0; transform: translateY(8px); }
  40% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-14px); }
`
const SteamPath = styled.path`
  animation: ${rise} 3s ease-in-out infinite;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.4;
  }
`

// 店舗情報の簡易地図（架空）
export const ShopMap: FC = () => (
  <svg viewBox='0 0 360 220' width='100%' role='img' aria-label='店舗周辺の地図'>
    <rect width='360' height='220' fill='#efe7da' />
    <g fill='#e3d8c6'>
      <rect x='16' y='16' width='110' height='70' rx='6' />
      <rect x='150' y='16' width='90' height='70' rx='6' />
      <rect x='262' y='16' width='82' height='70' rx='6' />
      <rect x='16' y='122' width='110' height='82' rx='6' />
      <rect x='262' y='122' width='82' height='82' rx='6' />
    </g>
    <rect x='150' y='122' width='90' height='82' rx='6' fill='#dfe8d4' />
    <g stroke='#fff' strokeLinecap='round'>
      <line x1='0' y1='104' x2='360' y2='104' strokeWidth='18' />
      <line x1='138' y1='0' x2='138' y2='220' strokeWidth='12' />
      <line x1='251' y1='0' x2='251' y2='220' strokeWidth='12' />
    </g>
    <text x='12' y='100' fontSize='10' fill='#8a7d6c'>
      文化村通り
    </text>
    <text x='160' y='170' fontSize='10' fill='#6f8a5c'>
      公園
    </text>
    <g transform='translate(200 70)'>
      <path d='M0 -26 c-12 0 -20 9 -20 20 c0 15 20 32 20 32 s20 -17 20 -32 c0 -11 -8 -20 -20 -20z' fill='#e2711d' />
      <circle cy='-6' r='7' fill='#fff' />
    </g>
    <g transform='translate(48 160)'>
      <rect x='-26' y='-12' width='70' height='24' rx='12' fill='#2b211c' />
      <text x='9' y='4' fontSize='10' fill='#fff' textAnchor='middle'>
        渋谷駅 →
      </text>
    </g>
  </svg>
)
