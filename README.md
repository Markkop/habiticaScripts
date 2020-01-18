# habiticaCustomSkills

![Repo status](https://www.repostatus.org/badges/latest/active.svg)
[![Build Status](https://travis-ci.com/Markkop/habiticaCustomSkills.svg?branch=rollup)](https://travis-ci.com/Markkop/habiticaCustomSkills)
[![codecov](https://codecov.io/gh/Markkop/habiticaCustomSkills/branch/rollup/graph/badge.svg)](https://codecov.io/gh/Markkop/habiticaCustomSkills)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Markkop/habiticaCustomSkills/issues)

## Status

This script was my first javascript project and I've learned A LOT since then. It's been broken for a while and I decided to refactor it with my new learnings and with a different strategy: instead of creating all html elements by hand, I'm now cloning them from existing ones and changing the values I need.

## Motivation

I've already used **Habitica** once and just started using it again to organize myself. However, I've been so focused that I quickly **outleveled my friends** and wondered how could I adjust my leveling process so I could keep up with the party.  
That's how this project begins. By **consuming experience points** while using skills, I could slow down my leveling in exchange for other resources such hp, mana and gold. The challenging part here is to balance them correctly so these custom skills don't become too overpowered.  
With this project I've been able to practice **Javascript, HTML, CSS, Testing and Functional Programming skills**.

## How to Use Habitica Custom Skills

1. Install [Violentmonkey](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/)
2. [Click here](https://github.com/Markkop/habiticaCustomSkills/raw/master/dist/habiticaCustomSkills.user.js) and install the `dist/habiticaCustomSkills.user.js` file
3. Access [Habitica](https://habitica.com/)'s home

## How to develop

Check [this guide](https://violentmonkey.github.io/posts/how-to-edit-scripts-with-your-favorite-editor/) to "live delevop" this script.

1. Run `npm install` to install dependencies
1. Run `npm run test` to test files or `npm run watch` to monitor them
3. Run `npm run build` to create the script file in `dist` directory

Tip: Use [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [Formatting Toggle](https://marketplace.visualstudio.com/items?itemName=tombonnike.vscode-status-bar-format-toggle) for code formatting

# Progress History

<img src="https://i.imgur.com/CeCfBC1.png"/>
<hr>
<img src="https://i.imgur.com/Wc8WAjC.png"/>
<hr>
<img src="https://i.imgur.com/3QvJFgd.png"/>
<hr>
<img src="https://i.imgur.com/kIjk9qB.png"/>
<hr>
<img src="https://i.imgur.com/HMcUVEq.png"/>
<hr>
<img src="https://i.imgur.com/Ndh6dJ9.png"/>

[(Printscreen of old testing file)](https://i.imgur.com/BLkLpcj.png)

## Some references

-   [JavaScript and Node Testing Best Practices](https://javascriptweekly.com/link/68555/14d64d4a39)
-   [Jest Fetch Mock](https://www.npmjs.com/package/jest-fetch-mock#installation-and-setup)
-   [How to mock specific module function in jest?](https://medium.com/@qjli/how-to-mock-specific-module-function-in-jest-715e39a391f4)
-   [Things I learned after writing tests for JS and HTML page](https://dev.to/snowleo208/things-i-learned-after-writing-tests-for-js-and-html-page-4lja)
-   [BFG Repo Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
-   [Reduce unit tests boilerplate with Jest’s .each syntax](https://itnext.io/reduce-unit-tests-boilerplate-with-jests-each-syntax-f5e48828437f)
-   [Jest ignore or exclude file/function/statement from test coverage](https://codewithhugo.com/jest-exclude-coverage/)
-   [How to read Test Coverage report generated using Jest](https://medium.com/@krishankantsinghal/how-to-read-test-coverage-report-generated-using-jest-c2d1cb70da8b)
-   [How to use GitHub badges to stop feeling like a noob](https://www.freecodecamp.org/news/how-to-use-badges-to-stop-feeling-like-a-noob-d4e6600d37d2/)