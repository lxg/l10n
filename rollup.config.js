import { terser } from 'rollup-plugin-terser'

const builds = []

;['js', 'cjs'].map(type => {
    ['l10n', 'date', 'html'].map(name => {
        const config = {
            input: `src/${name}.js`,
            output: {
                file: `dist/${name}.${type}`
            },
            plugins : [
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
            config.output.interop = "defaultOnly"
        }

        builds.push(config)
    })
})

export default builds
