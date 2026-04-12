import EventEmitter from 'events';

class NotificationService extends EventEmitter {}

const notificationService = new NotificationService();

// Listeners for user lifecycle events
notificationService.on('user:registered', (user) => {
  console.log(`Evento: user:registered para ${user.email}`);
});
notificationService.on('user:verified', (user) => {
  console.log(`Evento: user:verified para ${user.email}`);
});
notificationService.on('user:invited', (user) => {
  console.log(`Evento: user:invited para ${user.email}`);
});
notificationService.on('user:deleted', (user) => {
  console.log(`Evento: user:deleted para ${user.email}`);
});

export default notificationService;
