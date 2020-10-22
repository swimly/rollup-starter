#### 解决ie不支持Object.assign

``` bash
npm install --save-dev @babel/core @babel/preset-env core-js regenerator-runtime rollup rollup-plugin-commonjs rollup-plugin-node-resolve rollup-plugin-babel
```

.babelrc

``` json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "spec": true,
        "forceAllTransforms": true,
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ]
}
```

rollup.config.js

``` javascript
import { rollup } from 'rollup';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
async function build() {
  const bundle = await rollup({
    input: '...',
    plugins: [
      commonjs(),
      nodeResolve(),
      babel()
    ]
  });
  await bundle.write({
    file: '...',
    format: '...' 
  });
}
build();
```