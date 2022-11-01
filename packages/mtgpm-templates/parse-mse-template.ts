import { file } from 'bun';
import { concat, mergeWith, modifyPath, path } from 'rambda';

function isObject(val: unknown) {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

let template = await file('./mse/m15-altered.txt').text();
/**
 * Make sure conditionals are on a single line
 *
 * Before:
 * if condition
 *   then something
 *
 * After:
 * if condition then something
 */
template = template.replaceAll(/\n\t*then ([\w\s]+)\s*\n/gm, ' then $1\n');
const lines = template.split('\n');

const ignoredKeys = ['initScript'];

function parseLine(str: string): { tabs?: string; key?: string; val?: string } {
  const { tabs, condition, rest } =
    str.match(/^(?<tabs>\t*)(?<condition>if|else if|else)?(?<rest>.*)/)?.groups || {};

  // check if line is part of script block
  if (condition) {
    switch (condition) {
      case 'if':
      case 'else if': {
        const { key, val } = rest.match(/^(?<key>.*) then (?<val>.*)$/)?.groups || {};
        return { tabs, key, val };
      }
      case 'else': {
        return { tabs, key: 'default', val: rest };
      }
      default: {
        return {};
      }
    }
  }

  const { key, val } = rest.match(/^(?<key>[\w\s]+):=?\s*(?<val>.*)$/)?.groups || {};
  return { tabs, key, val };
}

function parseScriptLine(str: string): { tabs?: string; key?: string; val?: string } {
  const { tabs, condition, key, val } =
    str.match(
      /**
       * matches:
       * if (key) then (val)
       * else if (key) then (val)
       * else (val)
       */
      /^(?<tabs>\t*)(?<condition>(if|else if|else)) ((?<key>[\w_.() ]+) then )?(?<val>.*)$/
    )?.groups || {};

  switch (condition) {
    case 'if':
    case 'else if':
      return { tabs, key, val };
    case 'else':
      return { tabs, key: 'default', val };
    default:
      return {};
  }
}

function parseTemplate(
  obj: Record<string, unknown> = {},
  lineNum = 0,
  curIndent = 0,
  keys: string[] = []
) {
  if (lineNum === lines.length) return obj;

  const line = lines[lineNum];
  const newLineNum = lineNum + 1;

  // skip comment lines
  if (line.trim().startsWith('#')) {
    return parseTemplate(obj, newLineNum, curIndent, keys);
  }

  const { key, val, tabs = '' } = parseLine(line);

  if (!key) {
    return parseTemplate(obj, newLineNum, curIndent, keys);
  }

  const formattedKey = key.replaceAll(/[ _]([a-zA-Z])?/g, (_, match) => match?.toUpperCase() ?? '');
  const newIndent = tabs.length;
  const newKeys = keys.slice(0, newIndent);
  const lastKey = newKeys.at(-1);

  // skip ignored keys
  if (ignoredKeys.includes(lastKey)) {
    return parseTemplate(obj, newLineNum, curIndent, keys);
  }

  let value: unknown = val?.trim() ?? {};
  value = value && !isNaN(Number(value)) ? Number(value) : value;

  const currentValAtPath = path(newKeys)(obj)?.[formattedKey];

  if (!ignoredKeys.includes(formattedKey)) {
    if (newKeys.length) {
      if (currentValAtPath) {
        // TODO: handle when value exists at path
        console.log(...newKeys, formattedKey);
      } else {
        const modifyObj = modifyPath(newKeys, (p = {}) => {
          return mergeWith(concat, p, { [formattedKey]: value });
        });
        obj = modifyObj(obj);
      }
    } else {
      obj[formattedKey] = value || {};
    }
  }

  // a lack of value indicates that nested values will follow
  if (!value && lastKey !== formattedKey) {
    newKeys.push(formattedKey);
  }

  return parseTemplate(obj, newLineNum, newIndent, newKeys);
}

const parsed = parseTemplate();

Bun.write('./m15-basic.json', JSON.stringify(parsed));
