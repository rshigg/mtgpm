import * as mana from '../src/mana';

describe.concurrent('mana utilities', () => {
  describe('getColors', () => {
    it('returns colors from a string', () => {
      expect(mana.getColors('{X}{2}{W}{U}{U}{B}')).toEqual(['W', 'U', 'B']);
      expect(mana.getColors('gc7b')).toEqual(['G', 'B']);
    });
  });

  describe('getMana', () => {
    it('returns mana from a string', () => {
      expect(
        mana.getMana(
          "{2}{W}: Tap target creature.\n{2}{U}: Counter target activated ability. (Mana abilities can't be targeted.)"
        )
      ).toEqual(['{2}', '{W}', '{2}', '{U}']);
      expect(
        mana.getMana(
          '{G/P}: Insatiable Souleater gains trample until end of turn. ({G/P} can be paid with either {G} or 2 life.)'
        )
      ).toEqual(['{G/P}']);
      expect(mana.getMana('{X}{X}{2}')).toEqual(['{X}', '{X}', '{2}']);
    });

    it('does not ignore mana symbols in parantheses', () => {
      expect(
        mana.getMana(
          '{G/P}: Insatiable Souleater gains trample until end of turn. ({G/P} can be paid with either {G} or 2 life.)',
          { ignoreParentheses: false }
        )
      ).toEqual(['{G/P}', '{G/P}', '{G}']);
    });
  });

  describe('getColorIdentity', () => {
    it('returns color identity from a mana cost and rules text', () => {
      expect(
        mana.getColorIdentity(
          '{4}{W}',
          'This spell costs {1} less to cast for each creature in your party.\n{2/U}{2/B}{2/R}{2/G}: Look at the top six cards of your library. You may reveal up to two Cleric, Rogue, Warrior, Wizard, and/or Ally cards from among them and put them into your hand. Put the rest on the bottom of your library in a random order.'
        )
      ).toEqual(['W', 'U', 'B', 'R', 'G']);
    });
  });

  describe('getColorDistance', () => {
    it('returns the distance between two colors', () => {
      expect(mana.getColorDistance('W', 'U')).toEqual([1, 4, 'W', 'U']);
      expect(mana.getColorDistance('R', 'U')).toEqual([2, 3, 'U', 'R']);
      expect(mana.getColorDistance('U', 'G')).toEqual([3, 2, 'U', 'G']);
      expect(mana.getColorDistance('W', 'G')).toEqual([4, 1, 'W', 'G']);
      expect(mana.getColorDistance('R', 'R')).toEqual([0, 0, 'R', 'R']);
    });
  });

  describe('sortColorsByDistance', () => {
    it('sorts colors by distance', () => {
      expect(mana.sortColorsByDistance('W', 'U')).toEqual(['W', 'U']);
      expect(mana.sortColorsByDistance('U', 'W')).toEqual(['W', 'U']);

      expect(mana.sortColorsByDistance('U', 'B')).toEqual(['U', 'B']);
      expect(mana.sortColorsByDistance('B', 'U')).toEqual(['U', 'B']);

      expect(mana.sortColorsByDistance('B', 'R')).toEqual(['B', 'R']);
      expect(mana.sortColorsByDistance('R', 'B')).toEqual(['B', 'R']);

      expect(mana.sortColorsByDistance('R', 'G')).toEqual(['R', 'G']);
      expect(mana.sortColorsByDistance('G', 'R')).toEqual(['R', 'G']);

      expect(mana.sortColorsByDistance('G', 'W')).toEqual(['G', 'W']);
      expect(mana.sortColorsByDistance('W', 'G')).toEqual(['G', 'W']);

      expect(mana.sortColorsByDistance('W', 'B')).toEqual(['W', 'B']);
      expect(mana.sortColorsByDistance('B', 'W')).toEqual(['W', 'B']);

      expect(mana.sortColorsByDistance('U', 'R')).toEqual(['U', 'R']);
      expect(mana.sortColorsByDistance('R', 'U')).toEqual(['U', 'R']);

      expect(mana.sortColorsByDistance('B', 'G')).toEqual(['B', 'G']);
      expect(mana.sortColorsByDistance('G', 'B')).toEqual(['B', 'G']);

      expect(mana.sortColorsByDistance('G', 'U')).toEqual(['G', 'U']);
      expect(mana.sortColorsByDistance('U', 'G')).toEqual(['G', 'U']);

      expect(mana.sortColorsByDistance('W', 'R')).toEqual(['R', 'W']);
      expect(mana.sortColorsByDistance('R', 'W')).toEqual(['R', 'W']);

      expect(mana.sortColorsByDistance('U', 'U')).toEqual(['U', 'U']);
    });
  });

  describe('sortColoredMana', () => {
    it('accepts an empty string', () => {
      expect(mana.sortColoredMana('')).toEqual([]);
    });

    it('sorts a single color', () => {
      expect(mana.sortColoredMana('{W}')).toEqual(['W']);
      expect(mana.sortColoredMana('{U}')).toEqual(['U']);
      expect(mana.sortColoredMana('{B}')).toEqual(['B']);
      expect(mana.sortColoredMana('{R}')).toEqual(['R']);
      expect(mana.sortColoredMana('{G}')).toEqual(['G']);
      expect(mana.sortColoredMana('{X}{2}{B}')).toEqual(['B']);
    });

    it('sorts two colors', () => {
      expect(mana.sortColoredMana('{W}{U}')).toEqual(['W', 'U']);
      expect(mana.sortColoredMana('{U}{W}')).toEqual(['W', 'U']);

      expect(mana.sortColoredMana('{U}{B}')).toEqual(['U', 'B']);
      expect(mana.sortColoredMana('{B}{U}')).toEqual(['U', 'B']);

      expect(mana.sortColoredMana('{B}{R}')).toEqual(['B', 'R']);
      expect(mana.sortColoredMana('{R}{B}')).toEqual(['B', 'R']);

      expect(mana.sortColoredMana('{R}{G}')).toEqual(['R', 'G']);
      expect(mana.sortColoredMana('{G}{R}')).toEqual(['R', 'G']);

      expect(mana.sortColoredMana('{G}{W}')).toEqual(['G', 'W']);
      expect(mana.sortColoredMana('{W}{G}')).toEqual(['G', 'W']);

      expect(mana.sortColoredMana('{W}{B}')).toEqual(['W', 'B']);
      expect(mana.sortColoredMana('{B}{W}')).toEqual(['W', 'B']);

      expect(mana.sortColoredMana('{U}{R}')).toEqual(['U', 'R']);
      expect(mana.sortColoredMana('{R}{U}')).toEqual(['U', 'R']);

      expect(mana.sortColoredMana('{B}{G}')).toEqual(['B', 'G']);
      expect(mana.sortColoredMana('{G}{B}')).toEqual(['B', 'G']);

      expect(mana.sortColoredMana('{G}{U}')).toEqual(['G', 'U']);
      expect(mana.sortColoredMana('{U}{G}')).toEqual(['G', 'U']);

      expect(mana.sortColoredMana('{W}{R}')).toEqual(['R', 'W']);
      expect(mana.sortColoredMana('{R}{W}')).toEqual(['R', 'W']);
    });

    it('sorts three colors', () => {
      // Shards
      expect(mana.sortColoredMana('{W}{U}{B}')).toEqual(['W', 'U', 'B']);
      expect(mana.sortColoredMana('{W}{B}{U}')).toEqual(['W', 'U', 'B']);
      expect(mana.sortColoredMana('{U}{W}{B}')).toEqual(['W', 'U', 'B']);
      expect(mana.sortColoredMana('{U}{B}{W}')).toEqual(['W', 'U', 'B']);
      expect(mana.sortColoredMana('{B}{U}{W}')).toEqual(['W', 'U', 'B']);
      expect(mana.sortColoredMana('{B}{W}{U}')).toEqual(['W', 'U', 'B']);

      expect(mana.sortColoredMana('{U}{B}{R}')).toEqual(['U', 'B', 'R']);
      expect(mana.sortColoredMana('{U}{R}{B}')).toEqual(['U', 'B', 'R']);
      expect(mana.sortColoredMana('{B}{U}{R}')).toEqual(['U', 'B', 'R']);
      expect(mana.sortColoredMana('{B}{R}{U}')).toEqual(['U', 'B', 'R']);
      expect(mana.sortColoredMana('{R}{U}{B}')).toEqual(['U', 'B', 'R']);
      expect(mana.sortColoredMana('{R}{B}{U}')).toEqual(['U', 'B', 'R']);

      expect(mana.sortColoredMana('{B}{R}{G}')).toEqual(['B', 'R', 'G']);
      expect(mana.sortColoredMana('{B}{G}{R}')).toEqual(['B', 'R', 'G']);
      expect(mana.sortColoredMana('{R}{B}{G}')).toEqual(['B', 'R', 'G']);
      expect(mana.sortColoredMana('{R}{G}{B}')).toEqual(['B', 'R', 'G']);
      expect(mana.sortColoredMana('{G}{B}{R}')).toEqual(['B', 'R', 'G']);
      expect(mana.sortColoredMana('{G}{R}{B}')).toEqual(['B', 'R', 'G']);

      expect(mana.sortColoredMana('{R}{G}{W}')).toEqual(['R', 'G', 'W']);
      expect(mana.sortColoredMana('{R}{W}{G}')).toEqual(['R', 'G', 'W']);
      expect(mana.sortColoredMana('{G}{R}{W}')).toEqual(['R', 'G', 'W']);
      expect(mana.sortColoredMana('{G}{W}{R}')).toEqual(['R', 'G', 'W']);
      expect(mana.sortColoredMana('{W}{R}{G}')).toEqual(['R', 'G', 'W']);
      expect(mana.sortColoredMana('{W}{G}{R}')).toEqual(['R', 'G', 'W']);

      expect(mana.sortColoredMana('{G}{W}{U}')).toEqual(['G', 'W', 'U']);
      expect(mana.sortColoredMana('{G}{U}{W}')).toEqual(['G', 'W', 'U']);
      expect(mana.sortColoredMana('{W}{G}{U}')).toEqual(['G', 'W', 'U']);
      expect(mana.sortColoredMana('{W}{U}{G}')).toEqual(['G', 'W', 'U']);
      expect(mana.sortColoredMana('{U}{G}{W}')).toEqual(['G', 'W', 'U']);
      expect(mana.sortColoredMana('{U}{W}{G}')).toEqual(['G', 'W', 'U']);

      // Wedges
      expect(mana.sortColoredMana('{W}{B}{G}')).toEqual(['W', 'B', 'G']);
      expect(mana.sortColoredMana('{W}{G}{B}')).toEqual(['W', 'B', 'G']);
      expect(mana.sortColoredMana('{B}{W}{G}')).toEqual(['W', 'B', 'G']);
      expect(mana.sortColoredMana('{B}{G}{W}')).toEqual(['W', 'B', 'G']);
      expect(mana.sortColoredMana('{G}{W}{B}')).toEqual(['W', 'B', 'G']);
      expect(mana.sortColoredMana('{G}{B}{W}')).toEqual(['W', 'B', 'G']);

      expect(mana.sortColoredMana('{U}{R}{W}')).toEqual(['U', 'R', 'W']);
      expect(mana.sortColoredMana('{U}{W}{R}')).toEqual(['U', 'R', 'W']);
      expect(mana.sortColoredMana('{R}{U}{W}')).toEqual(['U', 'R', 'W']);
      expect(mana.sortColoredMana('{R}{W}{U}')).toEqual(['U', 'R', 'W']);
      expect(mana.sortColoredMana('{W}{U}{R}')).toEqual(['U', 'R', 'W']);
      expect(mana.sortColoredMana('{W}{R}{U}')).toEqual(['U', 'R', 'W']);

      expect(mana.sortColoredMana('{B}{G}{U}')).toEqual(['B', 'G', 'U']);
      expect(mana.sortColoredMana('{B}{U}{G}')).toEqual(['B', 'G', 'U']);
      expect(mana.sortColoredMana('{G}{B}{U}')).toEqual(['B', 'G', 'U']);
      expect(mana.sortColoredMana('{G}{U}{B}')).toEqual(['B', 'G', 'U']);
      expect(mana.sortColoredMana('{U}{B}{G}')).toEqual(['B', 'G', 'U']);
      expect(mana.sortColoredMana('{U}{G}{B}')).toEqual(['B', 'G', 'U']);

      expect(mana.sortColoredMana('{R}{W}{B}')).toEqual(['R', 'W', 'B']);
      expect(mana.sortColoredMana('{R}{B}{W}')).toEqual(['R', 'W', 'B']);
      expect(mana.sortColoredMana('{W}{R}{B}')).toEqual(['R', 'W', 'B']);
      expect(mana.sortColoredMana('{W}{B}{R}')).toEqual(['R', 'W', 'B']);
      expect(mana.sortColoredMana('{B}{W}{R}')).toEqual(['R', 'W', 'B']);
      expect(mana.sortColoredMana('{B}{R}{W}')).toEqual(['R', 'W', 'B']);

      expect(mana.sortColoredMana('{G}{U}{R}')).toEqual(['G', 'U', 'R']);
      expect(mana.sortColoredMana('{G}{R}{U}')).toEqual(['G', 'U', 'R']);
      expect(mana.sortColoredMana('{U}{G}{R}')).toEqual(['G', 'U', 'R']);
      expect(mana.sortColoredMana('{U}{R}{G}')).toEqual(['G', 'U', 'R']);
      expect(mana.sortColoredMana('{R}{G}{U}')).toEqual(['G', 'U', 'R']);
      expect(mana.sortColoredMana('{R}{U}{G}')).toEqual(['G', 'U', 'R']);
    });

    it('sorts four colors', () => {
      // UBRG
      expect(mana.sortColoredMana('{U}{B}{R}{G}')).toEqual(['U', 'B', 'R', 'G']);
      expect(mana.sortColoredMana('{B}{G}{U}{R}')).toEqual(['U', 'B', 'R', 'G']);
      expect(mana.sortColoredMana('{R}{G}{B}{U}')).toEqual(['U', 'B', 'R', 'G']);
      expect(mana.sortColoredMana('{G}{B}{U}{R}')).toEqual(['U', 'B', 'R', 'G']);

      // BRGW
      expect(mana.sortColoredMana('{B}{R}{G}{W}')).toEqual(['B', 'R', 'G', 'W']);
      expect(mana.sortColoredMana('{R}{W}{B}{G}')).toEqual(['B', 'R', 'G', 'W']);
      expect(mana.sortColoredMana('{G}{B}{R}{W}')).toEqual(['B', 'R', 'G', 'W']);
      expect(mana.sortColoredMana('{W}{G}{B}{R}')).toEqual(['B', 'R', 'G', 'W']);

      // RGWU
      expect(mana.sortColoredMana('{R}{G}{W}{U}')).toEqual(['R', 'G', 'W', 'U']);
      expect(mana.sortColoredMana('{G}{W}{U}{R}')).toEqual(['R', 'G', 'W', 'U']);
      expect(mana.sortColoredMana('{W}{U}{R}{G}')).toEqual(['R', 'G', 'W', 'U']);
      expect(mana.sortColoredMana('{U}{R}{G}{W}')).toEqual(['R', 'G', 'W', 'U']);

      // GWUB
      expect(mana.sortColoredMana('{G}{W}{U}{B}')).toEqual(['G', 'W', 'U', 'B']);
      expect(mana.sortColoredMana('{W}{B}{U}{G}')).toEqual(['G', 'W', 'U', 'B']);
      expect(mana.sortColoredMana('{U}{B}{G}{W}')).toEqual(['G', 'W', 'U', 'B']);
      expect(mana.sortColoredMana('{B}{W}{G}{U}')).toEqual(['G', 'W', 'U', 'B']);

      // WUBR
      expect(mana.sortColoredMana('{W}{U}{B}{R}')).toEqual(['W', 'U', 'B', 'R']);
      expect(mana.sortColoredMana('{U}{B}{R}{W}')).toEqual(['W', 'U', 'B', 'R']);
      expect(mana.sortColoredMana('{B}{W}{R}{U}')).toEqual(['W', 'U', 'B', 'R']);
      expect(mana.sortColoredMana('{R}{U}{W}{B}')).toEqual(['W', 'U', 'B', 'R']);

      expect(mana.sortColoredMana('{U}{G}{B}{R}{R}{R}{C}')).toEqual(['U', 'B', 'R', 'G']);
    });

    it('sorts five colors', () => {
      expect(mana.sortColoredMana('{W}{U}{B}{R}{G}')).toEqual(['W', 'U', 'B', 'R', 'G']);
      expect(mana.sortColoredMana('{7}{B}{W}{R}{B}{G}{U}{U}')).toEqual(['W', 'U', 'B', 'R', 'G']);
    });
  });
});
