export const notifyUpcomingEvent = (title: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`Event starts soon: ${title}`);
  }
};
