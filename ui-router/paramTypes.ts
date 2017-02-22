import {ParamTypeDefinition} from 'ui-router-core';

import {
  is,
  equals,
  pipe,
  pickBy,
  isNil,
  toPairs,
  fromPairs,
  map,
  join,
  split
} from 'ramda';

export const where: ParamTypeDefinition = {
  raw: true,

  equals,

  is: is(Object),

  pattern: /\w+~?:\w+\|*|^$/,

  encode: pipe(
    pickBy(value => {
      if (value instanceof Array) {
        return value.length > 0;
      }

      return !isNil(value);
    }),

    toPairs,

    map(([key, value]) => {
      if (value instanceof Array) {
        key = `~${key}`;
      }

      return [key, value].join(':');
    }),

    join('!'),
  ),

  decode: (pipe as any)(
    split('!'),

    map((pair: string) => {
      var [key, value] = pair.split(':');

      if (key[0] === '~') {
        return [
          key.slice(1, key.length),
          value.split(',')
        ];
      }

      return [key, value];
    }),

    fromPairs,
  )
};

export const order: ParamTypeDefinition = {
  raw: true,

  equals,

  is: is(Object),

  encode: (value) => {
    var keys = Object.keys(value);

    if (!keys.length) {
      return '';
    }

    return keys
      .map(key => [key, value[key]].join(':'))
      .join(',');
  },

  decode: (value) => {
    var [field, direction] = value.split(':');
    return {[field]: direction};
  },

  pattern: /\w+:(?:asc|desc)|^$/
}
