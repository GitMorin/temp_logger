
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('beers').del()
    .then(function () {
      // Inserts seed entries
      return knex('beers').insert([
        {name: 'First Beer', is_active: true, start_ferment: '2018-12-14', end_ferment: '2018-12-24 16:00'},
        {name: 'First Beer', is_active: false, start_ferment: '2018-12-03', end_ferment: '2018-09-30'}
      ]);
    });
};
