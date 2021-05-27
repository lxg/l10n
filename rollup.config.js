import { terser } from 'rollup-plugin-terser'

export default ['l10n', 'date'].map(name => ({
    input: `src/${name}.js`,
    output: {
        file: `dist/${name}.js`
    },
    plugins: [terser({
        mangle: {
            properties : {
                regex: ['^_']
            }
        }
    })]
}))
