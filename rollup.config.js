import { terser } from 'rollup-plugin-terser'

export default ['l10n', 'date'].map(name => ({
    input: `src/${name}.mjs`,
    output: {
        file: `dist/${name}.mjs`
    },
    plugins: [terser({
        mangle: {
            properties : {
                regex: ['^_']
            }
        }
    })]
}))