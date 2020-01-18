const { execSync } = require('child_process')
const inquirer = require('inquirer')

/**
 * Executes the an action to the given script
 *
 * @param { "habiticaCustomSkills" | "habiticaShortcuts" } script
 * @param { "dev" | "build" } action
 * @returns { "habiticaCustomSkills" | "habiticaShortcuts" } script
 */
function deployScript (script, action) {
    if(action === 'dev') {
      execSync(`rollup --config src/${script}/rollup.config.js --watch & jest src/${script} --watch`, { stdio: 'inherit' })
    } else {
      execSync(`rollup --config src/${script}/rollup.config.js`, { stdio: 'inherit' })
    }
  return script
}

inquirer.prompt([
  {
    type: 'list',
    name: 'script',
    message: 'Select which script to build in the dist folder',
    choices: [
      { name: 'habiticaCustomSkills' },
      { name: 'habiticaShortcuts' },
      { name: 'habiticaNotifications', disabled: 'WIP' }
    ]
  },
  {
    type: 'list',
    name: 'action',
    message: "Select which action you want to perform\nPS: for dev action you'll need to exit this terminal when done. Know how to fix? Contribute :D",
    choices: [
      { name: 'dev' },
      { name: 'build' },
    ]
  }
])
  .then(({ script, action }) => deployScript(script, action))
