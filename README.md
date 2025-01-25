# Grapesjs Chartjs Plugin

### [Chart.js](https://www.chartjs.org/) plugin for Grapesjs

[DEMO](##)
> **Provide a live demo of your plugin**
For a better user engagement create a simple live demo by using services like [JSFiddle](https://jsfiddle.net) [CodeSandbox](https://codesandbox.io) [CodePen](https://codepen.io) and link it here in your README (attaching a screenshot/gif will also be a plus).
To help you in this process here below you will find the necessary HTML/CSS/JS, so it just a matter of copy-pasting on some of those services. After that delete this part and update the link above

### HTML
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet">
<script src="https://unpkg.com/grapesjs"></script>
<script src="https://unpkg.com/grapesjs-chartjs-plugin"></script>

<div id="gjs"></div>
```

### JS
```js
const editor = grapesjs.init({
  container: '#gjs',
  height: '100%',
  fromElement: true,
  storageManager: false,
  plugins: ['grapesjs-chartjs-plugin'],
});
```


## Summary

* Plugin name: `grapesjs-chartjs-plugin`
* Components
    * `chartjs-bar`
    * `chartjs-line`
    * `chartjs-pie`
    * `chartjs-doughnut`
    * `chartjs-polarArea`
    * `chartjs-radar`
    * `chartjs-bubble`
    * `chartjs-scatter`
* Blocks
    * `chartjs-bar`
    * `chartjs-line`
    * `chartjs-pie`
    * `chartjs-doughnut`
    * `chartjs-polarArea`
    * `chartjs-radar`
    * `chartjs-bubble`
    * `chartjs-scatter`

## Options

| Option | Description | Default |
|-|-|-
| `chartjsOptions` | This object will be passed directly to the underlying Chart.js `options`. [See here for more info](https://www.chartjs.org/docs/latest/configuration/). | `{ maintainAspectRatio: false }` |



## Download

* CDN
  * `https://unpkg.com/grapesjs-chartjs-plugin`
* NPM
  * `npm i grapesjs-chartjs-plugin`
* GIT
  * `git clone https://github.com/fasenderos/grapesjs-chartjs-plugin.git`



## Usage

Directly in the browser
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet"/>
<script src="https://unpkg.com/grapesjs"></script>
<script src="path/to/grapesjs-chartjs-plugin.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container: '#gjs',
      // ...
      plugins: ['grapesjs-chartjs-plugin'],
      pluginsOpts: {
        'grapesjs-chartjs-plugin': { /* options */ }
      }
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
