import commands from './lib/basedriver/commands/index';
type Commands = typeof commands;
declare module './lib/basedriver/driver' {
  interface BaseDriver extends Commands {}
}
