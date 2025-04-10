import winston from 'winston';
import chalk from "chalk";

const colorLevel = (level) => {
    if (level = 'INFO') return chalk.greenBright(level);
    if (level = 'DEBUG') return chalk.blueBright(level);
    if (level = 'WARN') return chalk.yellowBright(level);
    if (level = 'ERROR') return chalk.redBright(level);
    return level;

}

const consoleFormat = winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    winston.format.printf(({level, message, timestamp, tag})=>{
        tag = tag || 'SYSTEM'
        const levelUpperCase = level.toUpperCase();
        const levelColor = colorLevel(level);
        return `${timestamp}\t${levelColor}\t${tag}\t${message}`
    })
)


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { tag: 'SYSTEM' },
  // nơi thiết lập log đến console, file
  transports: [
    // CONSOLE.LOG
    new winston.transports.Console({format:consoleFormat}),
    // - Write all logs with importance level of `error` or higher to `error.log`
    //   (i.e., error, fatal, but not other levels)
    //
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    //
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //   (i.e., fatal, error, warn, and info, but not trace)
    //
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//   }));
// }
export default logger;