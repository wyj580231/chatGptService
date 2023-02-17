import { Provide } from '@midwayjs/core';

@Provide()
export class LoggerService {
  writeLog(name: string, content: string, withDate = false) {
    const path = require('path');
    const fse = require('fs-extra');
    let logPath = path.join(process.cwd(), 'logs', 'custom', name + '.log');
    if (withDate) {
      const date = new Date();
      logPath = path.join(
        process.cwd(),
        'logs',
        'custom',
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        name + '.log'
      );
    }
    fse.ensureFileSync(logPath);
    const originContent = fse.readFileSync(logPath);
    fse.writeFileSync(logPath, originContent + content + '\n');
  }
}
