## Installation

1. Clone this repo
2. Install dependencies with `npm i`
3. Install it as CLI app with `npm i -g .` (or `npm link`) with terminal in this repo

- To make sure it was installed run `npm ls -g`
- Run `npm uninstall -g todo` to uninstall it

## How to use

1. `todo init` -- create sqlite database
2. `todo add -t "Buy groceries"` -- create an entry
3. `todo list` -- view existing entries

It's also possible to run it without global CLI installation

1. `node ./src/index.js init` -- create sqlite database
2. `node ./src/index.js add -t "Buy groceries"` -- create an entry
3. `node ./src/index.js list` -- view existing entries
