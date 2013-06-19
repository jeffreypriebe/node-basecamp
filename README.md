# node-basecamp (API wrapper for Node.js)
### Originally Authored by Mike Robinson (http://github.com/akamike)

A wrapper for the Basecamp Classic API (currently only supports read methods).

## Example usage

    Basecamp = require('basecamp');

    var bc = new Basecamp(
      'https://YOUR_COMPANY.basecamphq.com',
      'YOUR_API_KEY'
    );

    module.exports = function(req,res) {
      bc.todoLists.all(function(err, lists){
        if(err) {
          console.log(err)
          res.send('there was a problem')
        } else {
          res.render('todo', todoLists: lists )
        }
      });
    }

## Supported methods

### projects

* `projects.all(callback)`
* `projects.count(callback)`
* `projects.load(id, callback)`

### people

* `people.me(callback)`
* `people.all(callback)`
* `people.fromProject(projectId, callback)`
* `people.fromCompany(companyId, callback)`
* `people.load(id, callback)`

### companies

* `companies.all(callback)`
* `companies.fromProject(projectId, callback)`
* `companies.load(id, callback)`

### categories

* `categories.fromProject(projectId, type, callback)`
* `categories.load(id, callback)`

### messages

* `messages.fromProject(projectId, callback)`
* `messages.fromProjectArchive(projectId, callback)`
* `messages.load(id, callback)`
* `messages.fromCategory(projectId, categoryId, callback)`
* `messages.fromCategoryArchive(projectId, categoryId, callback)`

### comments

* `comments.fromResource(resourceType, resourceId, callback)`
* `comments.load(id, callback)`

### todoLists

* `todoLists.all(callback)`
* `todoLists.fromResponsible(responsibleId, callback)`
* `todoLists.fromProject(projectId, callback)`
* `todoLists.fromProjectPending(projectId, callback)`
* `todoLists.fromProjectFinished(projectId, callback)`
* `todoLists.load(id, callback)`

### todoItems

* `todoItems.fromList(listId, callback)`
* `todoItems.load(id, callback)`

### milestones

* `milestones.fromProject(projectId, callback)`

### time

* `time.fromProject(projectId, callback)`
* `time.fromTodo(todoId, callback)`
* `time.report(options, callback)`
  * eg. `var options = { "from":"YYYYMMDD", "to":"YYYYMMDD" };`
  * full list of options = 'from', 'to', 'subject_id', 'todo_item_id', 'filter_project_id', and 'filter_company_id'

### files

* `files.fromProject(projectId, offset, callback)`

## TODO

* Write methods
* Publish to npm
