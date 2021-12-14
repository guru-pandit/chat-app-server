const { createLogger, format, transports } = require("winston");
const { printf, combine, splat, colorize } = format
let logger = null;

// Production Logger
const devLogger = () => {
    return createLogger({
        level: 'debug',
        format: combine(
            splat(), colorize(),
            printf(({ level, message }) => `[${level}]: ${message}`)
        ),
        transports: [new transports.Console()],
    });
}
// Development Logger
const prodLogger = () => {
    return createLogger({
        level: 'info',
        format: combine(
            splat(), colorize(),
            printf(({ level, message }) => `[${level}]: ${message}`)
        ),
        transports: [new transports.Console()],
    });
}

// Assigning logger
if (process.env.NODE_ENV === 'development') {
    logger = devLogger();
} else {
    logger = prodLogger();
}

module.exports = logger;