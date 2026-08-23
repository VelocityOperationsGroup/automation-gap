import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const path = (p) => fileURLToPath(new URL(p, import.meta.url))

const mark = readFileSync(path('./mark.svg'))
const og = readFileSync(path('./og-image.svg'))

await sharp(og).png().toFile(path('../public/og-image.png'))
await sharp(mark).resize(512, 512).png().toFile(path('../public/icon-512.png'))
await sharp(mark).resize(180, 180).png().toFile(path('../public/apple-touch-icon.png'))
await sharp(mark).resize(32, 32).png().toFile(path('../public/favicon-32.png'))

console.log('done')
