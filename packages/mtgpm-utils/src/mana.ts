const manaOrder = ['W', 'U', 'B', 'R', 'G'] as const;

type ManaColor = typeof manaOrder[number];

export function getColors(text: string) {
  const matches = [...text.toUpperCase().matchAll(/[wubrg]/gi)].flat();
  const colors = new Set<string>(matches);
  return Array.from(colors) as ManaColor[];
}

type GetManaOptions = {
  ignoreParentheses?: boolean;
};

export function getMana(text: string, options: GetManaOptions = {}) {
  text = text.toUpperCase();
  if (options.ignoreParentheses !== false) {
    text = text.replaceAll(/\((.*?)\)/g, '');
  }
  const matches = [];
  for (const [, match] of text.matchAll(/(\{.*?\})/g)) {
    matches.push(match);
  }
  return matches;
}

export function getColorIdentity(
  manaCost: string,
  rulesText: string,
  options: GetManaOptions = {}
) {
  const rulesTextMana = getMana(rulesText, options).join('');
  return getColors(`${manaCost}${rulesTextMana}`);
}

/**
 * Returns the relative position and distance between two colors.
 *
 * @example
 * getColorDistance('W', 'G')
 *
 * |-0 -- 1 -- 2 -- 3 -> 4
 * ['W', 'U', 'B', 'R', 'G']
 * distance to right: 4
 *
 * -|0                   1 <-
 * ['W', 'U', 'B', 'R', 'G']
 * distance to left: 1
 *
 * @return
 * [distanceToRight, distanceToLeft, leftColor, rightColor]
 */
export function getColorDistance(
  color1: ManaColor,
  color2: ManaColor
): [number, number, ManaColor, ManaColor] {
  const aIndex = manaOrder.indexOf(color1);
  const bIndex = manaOrder.indexOf(color2);
  const min = Math.min(aIndex, bIndex);
  const max = Math.max(aIndex, bIndex);
  const distananceToRight = max - min;
  const distanceToLeft = distananceToRight === 0 ? 0 : manaOrder.length - distananceToRight;
  const c1 = manaOrder[min];
  const c2 = manaOrder[max];
  return [distananceToRight, distanceToLeft, c1, c2];
}

export function sortColorsByDistance(color1: ManaColor, color2: ManaColor) {
  const [distanceToRight, distanceToLeft, left, right] = getColorDistance(color1, color2);
  return distanceToRight < distanceToLeft ? [left, right] : [right, left];
}

export function sortColoredMana(mana: string): ManaColor[] {
  const colors = getColors(mana);
  switch (colors.length) {
    default:
    case 1: {
      return colors;
    }
    case 2: {
      return sortColorsByDistance(colors[0], colors[1]);
    }
    case 3: {
      // Since there are only ten shards/wedges and they use different ordering rules
      // it is less computationally expensive to just hardcode the correct order than
      // to come up with a sorting algorithm
      return ['WUB', 'UBR', 'BRG', 'RGW', 'GWU', 'WBG', 'URW', 'BGU', 'RWB', 'GUR']
        .find((order) => new RegExp(`[${order}]{3}`).test(colors.join('')))
        ?.split('') as ManaColor[];
    }
    case 4: {
      const missingColor = manaOrder.findIndex((c) => !colors.includes(c));
      return manaOrder.slice(missingColor + 1).concat(manaOrder.slice(0, missingColor));
    }
    case 5: {
      return ['W', 'U', 'B', 'R', 'G'];
    }
  }
}
