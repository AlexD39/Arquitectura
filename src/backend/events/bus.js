const EventEmitter = require('events');
const bus = new EventEmitter();

// Opcional: aumentar max listeners si hay varios handlers en dev
bus.setMaxListeners(20);

module.exports = bus;