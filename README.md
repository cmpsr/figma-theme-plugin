<div align="center">
<h1>🎨 Composer Themes</h1>

<p>Convert Composer Design System primitives from Figma to JSON</p>

</div>

<hr />

### Table of Contents

**[Setup](#setup)**<br>
**[Scripts](#scripts)**<br>
**[How does it work?](#how-does-it-work)**<br>
**[How to use it on figma?](#how-to-use-it-on-figma)**<br>

## Setup

To execute the project you have to open a terminal and run the following commands:

Clone the repository

```
git clone https://github.com/cmpsr/figma-theme-plugin
```

Change to plugin path

```
cd figma-theme-plugin
```

Install node dependencies

```
yarn install
```

## Scripts

### Execution

Run the plugin locally in development mode

```
yarn dev
```

### Build

Build the plugin locally in production mode

```
yarn build
```

Once the above commands are executed, you will be able to interact with the application. The server runs on port 4000 and the client on 3000.

## How does it work?

The plugin iterates over the pages from [Composer Design System](https://www.figma.com/file/ewqGU2UQxmYiO8JWaRawP0/Composer---Design-System?node-id=809%3A9938) primitives:

- Color
- Elevation
- Spacing
- Radii
- Text
- Text Pairings

For each of these pages, all of its nodes are iterated over. The nodes from which we extract data have a name that begins with a specific prefix.

_Example_
_We extract information from the Color page of those nodes that start with the prefix <code>-color</code>._

## How to use it on figma?

- [Setup Guide](https://www.figma.com/plugin-docs/setup/)
- [Find and install plugins](https://help.figma.com/hc/en-us/articles/360040450413-Find-and-install-plugins)
