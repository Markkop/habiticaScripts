import banner from 'rollup-plugin-banner'
import { header } from './settings.js'

export default [
    {
        input: 'src/habiticaCustomSkills/main.js',
        output: {
            file: 'dist/habiticaCustomSkills.user.js',
            name: 'habiticaCustomSkills',
            format: 'iife',
        },
        plugins: [banner([header, '//'])],
    }
]
