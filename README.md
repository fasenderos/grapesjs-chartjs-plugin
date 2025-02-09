<p align="center">
    <a href="https://www.npmjs.com/package/grapesjs-chartjs-plugin" target="_blank"><img src="https://img.shields.io/npm/v/grapesjs-chartjs-plugin?color=blue" alt="NPM Version"></a>
    <a href="https://github.com/fasenderos/grapesjs-chartjs-plugin/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/npm/l/grapesjs-chartjs-plugin" alt="Package License"></a>
    <a href="https://www.npmjs.com/package/grapesjs-chartjs-plugin" target="_blank"><img src="https://img.shields.io/npm/dm/grapesjs-chartjs-plugin" alt="NPM Downloads"></a>
    <a href="https://github.com/fasenderos/grapesjs-chartjs-plugin"><img src="https://badgen.net/badge/icon/typescript?icon=typescript&label" alt="Built with TypeScript"></a>
</p>

# GrapesJS Chart.js Plugin

This plugin integrates [Chart.js](https://www.chartjs.org/) into your GrapesJS editor :rocket::rocket:. You can add various types of charts :bar_chart: to your projects and customize them according to your needs. 

[DEMO](https://codesandbox.io/p/sandbox/grapesjs-chartjs-plugin-jxy3qk)

<p align="center">
:star: Star me on GitHub — it motivates me a lot!
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/4fc965dd-0f8d-4fb8-9e1d-a41a308e9471" width="90%">
</p>

<p align="center">
  <img align="top" src="https://github.com/user-attachments/assets/8adeb7cc-c4e2-44c3-bd56-2815d166d070" width="45%">
  <img src="https://github.com/user-attachments/assets/bad77bd3-0d7e-40d1-afd5-fee0eea836c2" width="45%">
</p>

## Summary

- Plugin name: `grapesjs-chartjs-plugin`
- Components
  - `chartjs`
- Blocks
  - `chartjs-bar`
  - `chartjs-line`
  - `chartjs-pie`
  - `chartjs-doughnut`
  - `chartjs-polarArea`
  - `chartjs-radar`
  - `chartjs-bubble`
  - `chartjs-scatter`

## Options

| Option           | Description                                                                                                                                             | Default                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `chartjsOptions` | This object will be passed directly to the underlying Chart.js `options`. [See here for more info](https://www.chartjs.org/docs/latest/configuration/). | `{ maintainAspectRatio: false }`       |
| `i18n`           | Object used to translate plugin properties. Check the `en` locale file and follow its inner path.                                                       | [`src/locale/en.js`](src/locale/en.js) |

## Download

- CDN
  - `https://unpkg.com/grapesjs-chartjs-plugin`
- NPM
  - `npm i grapesjs-chartjs-plugin`
- GIT
  - `git clone https://github.com/fasenderos/grapesjs-chartjs-plugin.git`

## Usage

Directly in the browser

```html
<link
  href="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
  rel="stylesheet"
/>
<script src="https://unpkg.com/grapesjs"></script>
<script src="https://unpkg.com/grapesjs-chartjs-plugin"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
    container: "#gjs",
    // ...
    plugins: ["grapesjs-chartjs-plugin"],
    pluginsOpts: {
      "grapesjs-chartjs-plugin": {
        /* options */
      },
    },
  });
</script>
```

Modern javascript

```js
import grapesjs from 'grapesjs';
import plugin from 'grapesjs-chartjs-plugin';
import 'grapesjs/dist/css/grapes.min.css';

const editor = grapesjs.init({
  container : '#gjs',
  // ...
  plugins: [plugin],
  pluginsOpts: {
    [plugin]: { /* options */ }
  }
  // or
  plugins: [
    editor => plugin(editor, { /* options */ }),
  ],
});
```

## Development

Clone the repository

```sh
$ git clone https://github.com/fasenderos/grapesjs-chartjs-plugin.git
$ cd grapesjs-chartjs-plugin
```

Install dependencies

```sh
$ npm i
```

Start the dev server

```sh
$ npm start
```

Build the source

```sh
$ npm run build
```

## License

MIT
