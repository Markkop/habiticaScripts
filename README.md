# habiticaCustomSkills

## How to Use

Install [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) / [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)  
Click on its icon and `New user script`  
Copy the content of [customSkills.js](https://github.com/Markkop/habiticaCustomSkills/blob/master/customSkills.js) and paste it  
Change `userid` in the putStats function for your Used Id (eg. 50387371-92ee-...)  
Change `tokenapi` for your [Token Api](https://habitica.com/user/settings/api) (eg. cfd2a65e-a8bc-....)  
Refresh your [Habitica](https://habitica.com/)'s home

## How to Test and Develop

Access root folder (the same as package.json)  
Run `npm install`  
Run `npm test -- --watch`

# Progress History

<img src="https://i.imgur.com/CeCfBC1.png"/>
<hr>
<img src="https://i.imgur.com/Wc8WAjC.png"/>
<hr>
<img src="https://i.imgur.com/3QvJFgd.png"/>
<hr>
<img src="https://i.imgur.com/cyBmMLJ.png"/>

## Some references

[Jest Fetch Mock](https://www.npmjs.com/package/jest-fetch-mock#installation-and-setup)  
[How to mock specific module function in jest?](https://medium.com/@qjli/how-to-mock-specific-module-function-in-jest-715e39a391f4)  
[Things I learned after writing tests for JS and HTML page](https://dev.to/snowleo208/things-i-learned-after-writing-tests-for-js-and-html-page-4lja)  
[BFG Repo Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)  
[Reduce unit tests boilerplate with Jest’s .each syntax](https://itnext.io/reduce-unit-tests-boilerplate-with-jests-each-syntax-f5e48828437f)
