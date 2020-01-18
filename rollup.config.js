import banner from 'rollup-plugin-banner'

const header = `==UserScript==
@name        habiticaCustomSkills
@version     <%= pkg.version %>
@description <%= pkg.description %>
@grant       none
@include     http*://habitica.com*
@run-at 	    document-idle
@author      <%= pkg.author %>
==/UserScript==`

export default [
    {
        input: 'src/main.js',
        output: {
            file: 'dist/habiticaCustomSkills.user.js',
            name: 'habiticaCustomSkills',
            format: 'iife',
        },
        plugins: [banner([header, '//'])],
    },
]
