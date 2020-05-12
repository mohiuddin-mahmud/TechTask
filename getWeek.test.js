const { getWeek } = require('./getWeek');

test('Find the week number', () => {
  expect(getWeek('2016-01-05')).toBe(1);
});
