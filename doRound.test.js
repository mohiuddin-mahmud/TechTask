const { doRound } = require('./doRound');

test('Test value for Round up', () => {
  expect(doRound(1.234)).toBe('1.24');
});
