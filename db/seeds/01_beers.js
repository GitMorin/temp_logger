
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('beers').del()
    .then(function () {
      // Inserts seed entries
      return knex('beers').insert([
        {name: '048 King of Korn v2', is_active: false, target_temp: 20, sensor: 't1', start_ferment: '2018-12-14', end_ferment: '2018-12-24 16:00'},
        {name: '049 Rye Pale Ale', is_active: true, target_temp: 18, sensor: 't1', start_ferment: '2018-12-30 22:00'},
        {name: '050 Bavarian Marco v.4', is_active: true, target_temp: 17, sensor: 't2', start_ferment: '2019-01-06 11:00'}
      ]);
    });
};
