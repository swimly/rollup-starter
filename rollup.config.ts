import path from 'path'
import { RollupOptions } from 'rollup'
import rollupTypescript from 'rollup-plugin-typescript2'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { eslint } from 'rollup-plugin-eslint'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import {terser} from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import cssnano from 'cssnano'
import cssnext from 'postcss-cssnext'
import ejs from 'rollup-plugin-ejs'
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

import pkg from './package.json'

const isDev = process.env.env == 'dev'

const paths = {
  input: path.join(__dirname, '/src/index.ts'),
  output: isDev ? path.join(__dirname, '/lib') : path.join(__dirname, `/lib/${pkg.version}`),
}

const plugins = isDev ? [
  serve({
    open: false,
    host: 'localhost',
    port: 8888
  }),
  livereload()
] : [
  terser()
]

// rollup 配置项
const rollupConfig: RollupOptions = {
  input: paths.input,
  output: isDev ? [
    {
      file: path.join(paths.output, `${pkg.name}.js`),
      format: 'umd',
      name: pkg.name
    },
  ] : [
    // 输出 commonjs 规范的代码
    {
      file: path.join(paths.output, `${pkg.name}.cjs.js`),
      format: 'cjs',
      name: pkg.name,
    },
    // 输出 es 规范的代码
    {
      file: path.join(paths.output, `${pkg.name}.umd.js`),
      format: 'umd',
      name: pkg.name,
    },
    // 输出 es 规范的代码
    {
      file: path.join(paths.output, `${pkg.name}.iife.js`),
      format: 'iife',
      name: pkg.name,
    },
    // 输出 es 规范的代码
    {
      file: path.join(paths.output, `${pkg.name}.es.js`),
      format: 'es',
      name: pkg.name,
    },
  ],
  // external: ['lodash'], // 指出应将哪些模块视为外部模块，如 Peer dependencies 中的依赖
  // plugins 需要注意引用顺序
  plugins: [
    // 验证导入的文件
    eslint({
      throwOnError: true, // lint 结果有错误将会抛出异常
      throwOnWarning: true,
      include: ['src/**/*.ts'],
      exclude: ['node_modules/**', 'lib/**', '*.js'],
    }),
    postcss({
      plugins: isDev ? [cssnext] : [cssnext, cssnano],
      extract: isDev ? path.resolve(__dirname, `./lib/${pkg.name}.css`) : path.resolve(__dirname, `./lib/${pkg.version}/${pkg.name}.min.css`)
    }),
    // 使得 rollup 支持 commonjs 规范，识别 commonjs 规范的依赖
    commonjs(),
    ejs({
      include: ['**/*.ejs', '**/*.html'], // optional, '**/*.ejs' by default
      exclude: ['**/index.html'], // optional, undefined by default
      compilerOptions: {client: true}
    }),
    // 配合 commnjs 解析第三方模块
    resolve({
      // 将自定义选项传递给解析插件
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
    }),
    rollupTypescript(),
    babel({
      runtimeHelpers: true,
      // 只转换源代码，不运行外部依赖
      exclude: 'node_modules/**',
      // babel 默认不支持 ts 需要手动添加
      extensions: [
        ...DEFAULT_EXTENSIONS,
        '.ts',
      ],
    }),
    ...plugins
  ],
}

export default rollupConfig
