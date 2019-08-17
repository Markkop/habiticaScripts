# habiticaCustomSkills

## Motivation

I've already used **Habitica** once and just started using it again to organize myself. However, I've been so focused that I quickly **outleveled my friends** and wondered how could I adjust my leveling process so I could keep up with the party.  
That's how this project begins. By **consuming experience points** while using skills, I could slow down my leveling in exchange for other resources such hp, mana and gold. The challenging part here is to balance them correctly so these custom skills don't become too overpowered.  
I had almost no experience with Javascript and HTML before starting, but this small project was the perfect excuse to practice these abilites.  
I also wanted to train my **test creating skills**, so that's why this project has many tests.

## How to Use

Install [Violentmonkey](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) / [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)  
Click on its icon and `New user script`  
Copy the content of [customSkills.js](https://github.com/Markkop/habiticaCustomSkills/blob/master/customSkills.js) and paste it  
Change `userid` in the **tokens** function for your User Id (eg. 50387371-92ee-...)  
Change `tokenapi` for your [Token Api](https://habitica.com/user/settings/api) (eg. cfd2a65e-a8bc-....)  
Reload your [Habitica](https://habitica.com/)'s home

## How to Test and Develop

Access root folder (the same as package.json)  
Run `npm install`  
Run `npm test -- --watch`  
Run `npm test -- --coverage`

# Progress History

<img src="https://i.imgur.com/CeCfBC1.png"/>
<hr>
<img src="https://i.imgur.com/Wc8WAjC.png"/>
<hr>
<img src="https://i.imgur.com/3QvJFgd.png"/>
<hr>
<img src="https://i.imgur.com/cyBmMLJ.png"/>

## Some references

- [Jest Fetch Mock](https://www.npmjs.com/package/jest-fetch-mock#installation-and-setup)
- [How to mock specific module function in jest?](https://medium.com/@qjli/how-to-mock-specific-module-function-in-jest-715e39a391f4)
- [Things I learned after writing tests for JS and HTML page](https://dev.to/snowleo208/things-i-learned-after-writing-tests-for-js-and-html-page-4lja)
- [BFG Repo Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [Reduce unit tests boilerplate with Jest’s .each syntax](https://itnext.io/reduce-unit-tests-boilerplate-with-jests-each-syntax-f5e48828437f)
- [Jest ignore or exclude file/function/statement from test coverage](https://codewithhugo.com/jest-exclude-coverage/)
- [How to read Test Coverage report generated using Jest](https://medium.com/@krishankantsinghal/how-to-read-test-coverage-report-generated-using-jest-c2d1cb70da8b)
