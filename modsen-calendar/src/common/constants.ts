export const EVENT_COLOR_TOKENS = [
  { stroke: '#ff6633', fill: '#ff66330d' },
  { stroke: '#29cc39', fill: '#29cc390d' },
  { stroke: '#33bfff', fill: '#33bfff0d' },
  { stroke: '#8833ff', fill: '#8833ff0d' },
  { stroke: '#e62e7b', fill: '#e62e7b0d' },
  { stroke: '#ffcb33', fill: '#ffcb330d' },
  { stroke: '#2ee6ca', fill: '#2ee6ca0d' }
] as const;

export const EVENT_COLORS = EVENT_COLOR_TOKENS.map((t) => t.stroke);
export const LS_EVENTS_KEY = 'modsen-calendar-events';
export const LS_FAVORITES_KEY = 'modsen-calendar-favorites';
export const LS_USER_KEY = 'modsen-calendar-user';
