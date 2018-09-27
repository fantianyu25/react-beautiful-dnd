// @flow
type Records = {
  [key: string]: number,
};

const records: Records = {};

const flag: string = '__react-beautiful-dnd-debug-timings-hook__';

const isTimingsEnabled = (): boolean => Boolean(window[flag]);

export const forceEnable = () => {
  window[flag] = true;
};

// Debug: uncomment to enable
forceEnable();

export const start = (key: string) => {
  // we want to strip all the code out for production builds
  // draw back: can only do timings in dev env (which seems to be fine for now)
  if (!isTimingsEnabled()) {
    return;
  }
  const now: number = performance.now();

  records[key] = now;
};

type Style = {|
  textColor: string,
  symbol: string,
|};

export const finish = (key: string) => {
  if (!isTimingsEnabled()) {
    return;
  }
  const now: number = performance.now();

  const previous: ?number = records[key];

  if (!previous) {
    console.warn('cannot finish timing as no previous time found', key);
    return;
  }

  const result: number = now - previous;
  const rounded: string = result.toFixed(2);

  const style: Style = (() => {
    if (result < 12) {
      return {
        textColor: 'green',
        symbol: '✅',
      };
    }
    if (result < 40) {
      return {
        textColor: 'orange',
        symbol: '⚠️',
      };
    }
    return {
      textColor: 'red',
      symbol: '❌',
    };
  })();

  // eslint-disable-next-line no-console
  console.log(
    `${style.symbol} %cTiming %c${rounded} %cms %c${key}`,
    // title
    'color: blue; font-weight: bold;',
    // result
    `color: ${style.textColor}; font-size: 1.1em;`,
    // ms
    'color: grey;',
    // key
    'color: purple; font-weight: bold;',
  );
};
