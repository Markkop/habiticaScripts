# habiticaCustomSkills

## Status

**Version 2 has been launched!**  
This script was my first javascript project and I've learned A LOT since then. It's been broken for a while and I decided to refactor it with my new learnings and with a different strategy: instead of creating all html elements by hand, I'm now cloning them from existing ones and changing the values I need.

## Motivation

I've already used **Habitica** once and just started using it again to organize myself. However, I've been so focused that I quickly **outleveled my friends** and wondered how could I adjust my leveling process so I could keep up with the party.  
That's how this project begins. By **consuming experience points** while using skills, I could slow down my leveling in exchange for other resources such hp, mana and gold. The challenging part here is to balance them correctly so these custom skills don't become too overpowered.  
With this project I've been able to practice **Javascript, HTML, CSS, Testing and Functional Programming skills**.

## How to Use

Install [Violentmonkey](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) / [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)  
Click on its icon and `New user script`  
Copy the content of [src/habiticaCustomSkills.user.js](src/habiticaCustomSkills) and paste on it  
Add your `user` and `api` [tokens](https://habitica.com/user/settings/api) to the **tokens** object  
Reload your [Habitica](https://habitica.com/)'s home

## How to develop

Check [this guide](https://violentmonkey.github.io/posts/how-to-edit-scripts-with-your-favorite-editor/) to "live delevop" this script.

To change `changeStats()` and `checkRequirements()` functions it is advised to alter them in the [test file](src/stats.test.js) while running it with `npm test`.  
If some wrong value is sent to Habitica's API, your stat will be zeroed and this can result in unexpected results, like death.  
Don't forget to copy your changed functions to **habiticaCustomSkills.user.js** file


# Progress History

<img src="https://i.imgur.com/CeCfBC1.png"/>
<hr>
<img src="https://i.imgur.com/Wc8WAjC.png"/>
<hr>
<img src="https://i.imgur.com/3QvJFgd.png"/>
<hr>
<img src="https://i.imgur.com/kIjk9qB.png"/>
<hr>
<img src="https://i.imgur.com/Ndh6dJ9.png"/>

[(Printscreen of old testing file)](https://i.imgur.com/BLkLpcj.png)


## Some references

- [JavaScript and Node Testing Best Practices](https://javascriptweekly.com/link/68555/14d64d4a39)
- [Jest Fetch Mock](https://www.npmjs.com/package/jest-fetch-mock#installation-and-setup)
- [How to mock specific module function in jest?](https://medium.com/@qjli/how-to-mock-specific-module-function-in-jest-715e39a391f4)
- [Things I learned after writing tests for JS and HTML page](https://dev.to/snowleo208/things-i-learned-after-writing-tests-for-js-and-html-page-4lja)
- [BFG Repo Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [Reduce unit tests boilerplate with Jest’s .each syntax](https://itnext.io/reduce-unit-tests-boilerplate-with-jests-each-syntax-f5e48828437f)
- [Jest ignore or exclude file/function/statement from test coverage](https://codewithhugo.com/jest-exclude-coverage/)
- [How to read Test Coverage report generated using Jest](https://medium.com/@krishankantsinghal/how-to-read-test-coverage-report-generated-using-jest-c2d1cb70da8b)
