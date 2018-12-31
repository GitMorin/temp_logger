
exports.up = function(knex, Promise) {
  return knex.schema.createTable('beers', function(table){
    table.increments();
    table.string('name').notNullable();
    table.boolean('is_active').notNullable().default(true);
    table.integer('target_temp');
    table.timestamp('start_ferment');
    table.timestamp('end_ferment');
  })
};

// create table beer (
// 	id serial primary key,
//     beer_name text,
//     active bool default false,
//     start_ferment timestamp without time zone,
//     end_ferment timestamp without time zone
// )

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('beers');
};
