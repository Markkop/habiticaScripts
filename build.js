const { execSync } = require('child_process')
const inquirer = require('inquirer')

/**
 * Executes the rollup command to the given script
 *
 * @param { "habiticaCustomSkills" | "habiticaShortcuts" } script
 * @returns { "habiticaCustomSkills" | "habiticaShortcuts" } script
 */
function deployScript (script) {
    execSync(`rollup --config src/${script}/rollup.config.js`, { stdio: 'inherit' })
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
  }
])
  .then(({ script }) => deployScript(script))
