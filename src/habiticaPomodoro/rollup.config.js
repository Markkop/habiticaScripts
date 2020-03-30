import banner from 'rollup-plugin-banner'

const header = `==UserScript==
@name        habiticaPomodoro
@version     1.0.0
@description Creates a timer on a pomodoro task
@include     http*://habitica.com*
@run-at 	    document-idle
@author      Marcelo 'Mark' Kopmann
==/UserScript==`

export default [
    {
        input: 'src/habiticaPomodoro/main.js',
        output: {
            file: 'dist/habiticaPomodoro.user.js',
            name: 'habiticaPomodoro',
            format: 'iife',
        },
        plugins: [banner([header, '//'])],
    },
]
