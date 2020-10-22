import { series } from 'gulp'
import path from 'path'
import fse from 'fs-extra'
import chalk from 'chalk'
import { rollup, watch } from 'rollup'
import rollupConfig from './rollup.config'

interface TaskFunc {
  (cb: Function): void
}
const time = () => {
  const date = new Date()
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
const log = {
  progress: (text: string) => {
    console.log(`[${chalk.gray(time())}] ${chalk.green(text)}`)
  },
  error: (text: string) => {
    console.log(chalk.red(text))
  }
}

const paths = {
  root: path.join(__dirname, '/'),
  lib: path.join(__dirname, '/lib'),
}


// 删除 lib 文件
// const clearLibFile: TaskFunc = async (cb) => {
//   fse.removeSync(paths.lib)
//   log.progress('Deleted lib file')
//   cb()
// }

const inputOptions = {
  input: rollupConfig.input,
  external: rollupConfig.external,
  plugins: rollupConfig.plugins,
}
const outOptions = rollupConfig.output
// rollup 打包
const buildByRollup: TaskFunc = async (cb) => {
  log.progress('Start to build!')
  const bundle = await rollup(inputOptions)
  // 写入需要遍历输出配置
  if (Array.isArray(outOptions)) {
    outOptions.forEach(async (outOption) => {
      await bundle.write(outOption)
    })
    cb()
    log.progress('Build successful!')
  }
}

const serveByRollup: TaskFunc = (cb) => {
  const watchOptions = {
    ...inputOptions,
    output: rollupConfig.output,
    watch: {
      include: './src/**',
      exclude: 'node_modules/**'
    }
  }
  const watcher = watch(watchOptions)
  watcher.on('event', (event) => {
    if (event.code == 'START') {
      log.progress('Project directory has changed!')
    } else if (event.code == 'BUNDLE_START') {
      log.progress('Start building!')
    } else if (event.code == 'BUNDLE_END') {
      log.progress('Success building!')
    } else if (event.code == 'END') {
      log.progress('Waiting for change!')
    } else {
      log.error('打包出错' + event.error)
    }
  })
  cb()
}

export const build = series(buildByRollup)

export const dev = series(serveByRollup)