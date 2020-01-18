import banner from 'rollup-plugin-banner'
import { header } from './settings.js'

export default [
    {
        input: 'src/habiticaShortcuts/main.js',
        output: {
            file: 'dist/habiticaShortcuts.user.js',
            name: 'habiticaShortcuts',
            format: 'iife',
        },
        plugins: [banner([header, '//'])],
    },
]
