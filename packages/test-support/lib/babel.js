import register from '@babel/register';

export function registerBabel () {
  register({rootMode: 'upward'});
}
