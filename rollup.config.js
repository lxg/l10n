import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'

const builds = []

;['js', 'cjs'].map(type => {
    ['l10n', 'date'].map(name => {
        const plugins = []

        plugins.push(resolve())

        plugins.push(terser({
            mangle: {
                properties : {
                    regex: ['^_']
                }
            }
        }))

        const config = {
            input: `src/${name}.js`,
            output: {
                file: `dist/${name}.${type}`
            },
            plugins
        }

        if (type === "cjs") {
            config.output.format = "cjs"
            config.output.exports = "auto"
        }

        builds.push(config)
    })
})

export default builds
