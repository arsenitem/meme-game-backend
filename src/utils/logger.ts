import winston from "winston";
const transports = process.env.NODE_ENV === 'production' ? [
    new winston.transports.File({filename: 'logs/error.log', level: 'error'}),
    new winston.transports.File({filename: 'logs/info.log', level: 'info'}),
] : [
    new winston.transports.Console({level: 'error'}),
    new winston.transports.Console({level: 'info'}),
]
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports
});

export default logger;