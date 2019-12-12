'use strict';

const initSqlJs = require('sql.js/dist/sql-asm');

module.exports = function (n) {
	console.log('\n...demo-sql.js');

	initSqlJs().then(SQL => {

		// Create a database
		const db = new SQL.Database();
		// NOTE: You can also use new SQL.Database(data) where
		// data is an Uint8Array representing an SQLite database file

		// Execute some sql
		let sqlstr = "CREATE TABLE hello (a int, b char);";
		sqlstr += "INSERT INTO hello VALUES (0, 'hello');";
		sqlstr += "INSERT INTO hello VALUES (1, 'world');";
		db.run(sqlstr); // Run the query without returning anything

		let res = db.exec("SELECT * FROM hello");
		/* [ {columns:['a','b'], values:[[0,'hello'],[1,'world']]}	] */

		// Prepare an sql statement
		let stmt = db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");

		// Bind values to the parameters and fetch the results of the query
		let result = stmt.getAsObject({':aval': 1, ':bval': 'world'});
		console.log(result); // Will print {a:1, b:'world'}

		// Bind other values
		stmt.bind([0, 'hello']);
		while (stmt.step()) console.log(stmt.get()); // Will print [0, 'hello']

		// You can also use JavaScript functions inside your SQL code
		// Create the js function you need
		const add = (a, b) => a + b;

		// Specifies the SQL function's name, the number of it's arguments, and the js function to use
		db.create_function("add_js", add);
		// Run a query in which the function is used
		db.run("INSERT INTO hello VALUES (add_js(7, 3), add_js('Hello ', 'world'));"); // Inserts 10 and 'Hello world'

		// free the memory used by the statement
		stmt.free();
		// You can not use your statement anymore once it has been freed.
		// But not freeing your statements causes memory leaks. You don't want that.

		// Export the database to an Uint8Array containing the SQLite database file
		// let binaryArray = db.export();
	});
};
