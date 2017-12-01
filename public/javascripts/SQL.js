'use strict';
var azure = require('azure-storage');

module.exports = function() {
    var tableService = azure.createTableService('oldcaresql','wU1dcVI5ESAcgL490pj/G+JXwIGNqAZl0ulfGIeBeq/X/rz+ZkCazIytA/D8IrsLkbNj9tVDjqNL/slT4KJO5Q==');
	console.log("faileee");
	var entGen = azure.TableUtilities.entityGenerator;
	var entity = {
  	PartitionKey: entGen.String('part2'),
  	RowKey: entGen.String('row1'),
  	boolValueTrue: entGen.Boolean(true),
  	boolValueFalse: entGen.Boolean(false),
  	intValue: entGen.Int32(42),
  	dateValue: entGen.DateTime(new Date(Date.UTC(2011, 10, 25))),
  	complexDateValue: entGen.DateTime(new Date(Date.UTC(2013, 02, 16, 01, 46, 20)))
	};
	tableService.insertEntity('mytable', entity, function(error, result, response) {
  	if (!error) {
    // result contains the ETag for the new entity
  	}
	});
}