var azure = require('azure-storage');


sql1.prototype.judgetable = function(){
var tableService = azure.createTableService('oldcaresql','wU1dcVI5ESAcgL490pj/G+JXwIGNqAZl0ulfGIeBeq/X/rz+ZkCazIytA/D8IrsLkbNj9tVDjqNL/slT4KJO5Q==');
tableService.createTableIfNotExists('mytable', function(error, result, response) {
  if (!error) {
    // result contains true if created; false if already exists
    console.log("faileee");
  }
});
}
module.exports = sql1;