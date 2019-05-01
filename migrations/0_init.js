exports.up = async function(knex) {
  await knex.schema.createTable("visits", table => {
    table.increments("id").primary();
    table.datetime("date").defaultTo(knex.fn.now());
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable("visits");
};
