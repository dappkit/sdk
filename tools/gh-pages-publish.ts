const { cd, exec, echo, touch } = require('shelljs')
const { readFileSync } = require('fs')
const url = require('url')
const { config } = require('dotenv')
config()

let repoUrl
let pkg = JSON.parse(readFileSync('package.json') as any)
if (typeof pkg.repository === 'object') {
  if (!pkg.repository.hasOwnProperty('url')) {
    throw new Error('URL does not exist in repository section')
  }
  repoUrl = pkg.repository.url
} else {
  repoUrl = pkg.repository
}

let parsedUrl = url.parse(repoUrl)
console.log(parsedUrl)
let repository = (parsedUrl.host || '') + (parsedUrl.path || '')
let ghToken = process.env.GH_TOKEN
console.log(ghToken)

echo('Deploying docs!!!')
cd('docs')
touch('.nojekyll')
exec('git init')
exec('git add .')
exec('git config user.name "Aaron Barnard"')
exec('git config user.email "abarnard@protonmail.com"')
exec('git commit -m "docs(docs): update gh-pages"')
exec(`git push --force --quiet "https://${ghToken}@${repository}" master:gh-pages`)
echo('Docs deployed!!')
