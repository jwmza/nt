const fs = require('fs')

const programs = fs.readdirSync('./src/programs')

const sharedJS = fs.readFileSync(`./src/lib/nt.shared.js`).toString()

for (const program of programs) {
  const helpText = fs
    .readFileSync(`./src/programs/${program}/${program}.help.txt`)
    .toString()
    .trim()

  const mainJS = fs
    .readFileSync(`./src/programs/${program}/${program}.source.js`)
    .toString()

  const build = `// GENERATED CODE. DO NOT EDIT.
  
  ${sharedJS}
  
  const _helpText = \`${helpText}\`

  if (_has(['-h', '--help'], _args[2])) {
    _help()
  
    return
  }
  
  ${mainJS}`

  fs.writeFile(`./${program}.js`, build, function (err) {
    if (err) throw err
    console.log(`Generated ./${program}.js`)
  })

  const manText = fs
    .readFileSync(`./src/programs/${program}/${program}.manual.md`)
    .toString()
    .trim()

  const manual = `<!-- GENERATED FILE. DO NOT EDIT. -->
${manText}

---

## Help
\`\`\`
${helpText}
\`\`\``

  fs.writeFile(`./${program}.md`, manual, function (err) {
    if (err) throw err
    console.log(`Generated ./${program}.md`)
  })
}
