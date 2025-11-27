import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import postcss from 'postcss'
import cssnano from 'cssnano'

function inlineCssIntoHtml() {
    return {
        name: 'inline-css-into-html',
        apply: 'build',
        enforce: 'post',

        async generateBundle(_, bundle) {
            // Indexar todos los assets CSS generados por Vite
            const cssAssets = {}
            for (const [fileName, asset] of Object.entries(bundle)) {
                if (asset.type === 'asset' && fileName.endsWith('.css')) {
                    cssAssets[fileName] = asset
                }
            }

            // Procesar cada HTML del bundle
            for (const [fileName, asset] of Object.entries(bundle)) {
                if (asset.type !== 'asset' || !fileName.endsWith('.html')) continue

                let html = asset.source.toString()

                // Regex para encontrar <link rel="stylesheet">
                const linkTagRegex = /<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi

                // Coleccionar todos los assets CSS referenciados en este HTML
                const referencedAssets = new Map() // normalizedPath -> { asset, linkTags: [] }

                // Primer pase: identificar qué assets se usan
                let match
                while ((match = linkTagRegex.exec(html)) !== null) {
                    const linkTag = match[0]
                    const hrefMatch = linkTag.match(/href=(["'])([^"']+)\1/i)
                    if (!hrefMatch) continue

                    const href = hrefMatch[2]

                    // Ignorar externos
                    if (/^(https?:)?\/\//i.test(href)) continue

                    const normalized = href.replace(/^\//, '')

                    // Solo assets de Vite
                    if (!normalized.startsWith('assets/')) continue

                    const cssAsset = cssAssets[normalized]
                    if (cssAsset) {
                        if (!referencedAssets.has(normalized)) {
                            referencedAssets.set(normalized, { asset: cssAsset, linkTags: [] })
                        }
                        referencedAssets.get(normalized).linkTags.push(linkTag)
                    }
                }

                if (referencedAssets.size === 0) continue

                // Estrategia de deduplicación:
                // Si hay múltiples assets CSS diferentes, elegimos el más grande (asumiendo que es el "completo")
                // y descartamos los otros (asumiendo que son subconjuntos o duplicados generados por Vite).
                let bestAsset = null
                let maxLength = -1

                for (const { asset } of referencedAssets.values()) {
                    const len = asset.source.length
                    if (len > maxLength) {
                        maxLength = len
                        bestAsset = asset
                    }
                }

                // Inyectar el mejor asset
                if (bestAsset) {
                    let cssCode = bestAsset.source.toString()

                    // Minificar CSS manualmente usando cssnano
                    try {
                        const result = await postcss([cssnano({ preset: 'default' })]).process(cssCode, { from: undefined })
                        cssCode = result.css
                    } catch (e) {
                        console.error('Error minifying CSS:', e)
                    }

                    const styleBlock = `<style>${cssCode}</style>`

                    if (html.includes('</head>')) {
                        html = html.replace('</head>', `${styleBlock}\n</head>`)
                    } else {
                        html = styleBlock + html
                    }
                }

                // Eliminar TODAS las etiquetas link que referencian a CUALQUIERA de los assets encontrados
                // (incluso los que no elegimos, para limpiar)
                html = html.replace(linkTagRegex, (linkTag) => {
                    const hrefMatch = linkTag.match(/href=(["'])([^"']+)\1/i)
                    if (!hrefMatch) return linkTag // No tocar si no tiene href

                    const href = hrefMatch[2]
                    if (/^(https?:)?\/\//i.test(href)) return linkTag // No tocar externos

                    const normalized = href.replace(/^\//, '')
                    if (referencedAssets.has(normalized)) {
                        return '' // Eliminar
                    }

                    return linkTag
                })

                asset.source = html
            }
        },
    }
}


const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    root: 'src/pages',
    publicDir: 'public',
    build: {
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        minify: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/pages/index.html'),
                about: resolve(__dirname, 'src/pages/about.html'),
            },
        },
    },
    plugins: [
        inlineCssIntoHtml(),
    ],
})