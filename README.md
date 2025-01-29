# Grapesjs Chartjs Plugin

### [Chart.js](https://www.chartjs.org/) plugin for Grapesjs

[DEMO](https://codesandbox.io/p/sandbox/grapesjs-chartjs-plugin-jxy3qk)

![Image](https://github.com/user-attachments/assets/4fc965dd-0f8d-4fb8-9e1d-a41a308e9471)

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
