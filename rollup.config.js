import { terser } from 'rollup-plugin-terser'


// disabling resolve for now because of a broken dependency.
// For our purposes, we can live with “external modules” for now.
//import resolve from '@rollup/plugin-node-resolve'

const builds = []

;['js', 'cjs'].map(type => {
    ['l10n', 'date', 'html'].map(name => {
        const config = {
            input: `src/${name}.js`,
            output: {
                file: `dist/${name}.${type}`
            },
            plugins : [
                //resolve(),
                terser({
                    mangle: {
                        properties : {
                            regex: ['^_']
                        }
                    }
                })
            ]
        }

        if (type === "cjs") {
            config.output.format = "cjs"
            config.output.exports = "auto"
        }

        builds.push(config)
    })
})

export default builds
