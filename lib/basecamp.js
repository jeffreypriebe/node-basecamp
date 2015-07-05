var https = require('https'),
  xml2js = require('xml2js');

var Basecamp = function (url, key) {
  var self = this;
  this.host = url;
  this.schemeFreeHost = this.host.replace('https://', '');
  this.key = new Buffer(key + ':X', 'utf8').toString('base64');

  this.api = {
    projects: {
      all: function (callback) {
        return self.request('/projects.xml', function (err, projects) {
          if (!err) { }
          projects = projects.projects.project;

          callback(err, projects);
        });
      },
      count: function (callback) {
        return self.request('/projects/count.xml', callback);
      },
      load: function (id, callback) {
        return self.request('/projects/' + id + '.xml', callback);
      },
      create: function (callback) {
        callback();
      }
    },
    people: {
      me: function (callback) {
        return self.request('/me.xml', callback);
      },
      all: function (callback) {
        return self.request('/people.xml', function (err, people) {
          if (!err)
            people = people.people.person;

          callback(err, people);
        });
      },
      fromProject: function (projectId, callback) {
        return self.request('/projects/' + projectId + '/people.xml', function (err, people) {
          if (!err)
            people = people.people.person;

          callback(err, people);
        });
      },
      fromCompany: function (companyId, callback) {
        return self.request('/companies/' + companyId + '/people.xml', function (err, people) {
          if (!err)
            people = people.people.person;

          callback(err, people);
        });
      },
      load: function (id, callback) {
        return self.request('/people/' + id + '.xml', callback);
      },
      create: function (callback) {
        callback();
      }
    },
    companies: {
      all: function (callback) {
        return self.request('/companies.xml', function (err, companies) {
          if (!err)
            companies = companies.companies.company;

          callback(err, companies);
        });
      },
      fromProject: function (projectId, callback) {
        return self.request('/projects/' + projectId + '/companies.xml', function (err, companies) {
          if (!err)
            companies = companies.companies.company;

          callback(err, companies);
        });
      },
      load: function (id, callback) {
        return self.request('/companies/' + id + '.xml', callback);
      }
    },
    categories: {
      fromProject: function (projectId, type, callback) {
        return self.request('/projects/' + projectId + '/categories.xml?type=' + type, function (err, categories) {
          if (!err)
            categories = categories.categories.category;

          callback(err, categories);
        });
      },
      load: function (id, callback) {
        return self.request('/categories/' + id + '.xml', callback);
      }
    },
    messages: {
      "fromProject": function (projectId, callback) {
        return self.request('/projects/' + projectId + '/posts.xml', function (err, messages) {
          if (!err)
            messages = messages.posts.post;

          callback(err, messages)
        });
      },
      fromProjectArchive: function (projectId, callback) {
        return self.request('/projects/' + projectId + '/posts/archive.xml', function (err, messages) {
          if (!err)
            messages = messages.posts.post;

          callback(err, messages);
        });
      },
      load: function (id, callback) {
        return self.request('/posts/' + id + '.xml', callback);
      },
      fromCategory: function (projectId, categoryId, callback) {
        return self.request('/projects/' + projectId + '/cat/' + categoryId + '/posts.xml', function (err, messages) {
          if (!err)
            messages = messages.posts.post;

          callback(err, messages);
        });
      },
      fromCategoryArchive: function (projectId, categoryId, callback) {
        return self.request('/projects/' + projectId + '/cat/' + categoryId + '/posts/archive.xml', function (err, messages) {
          if (!err)
            messages = messages.posts.message;

          callback(err, messages);
        });
      }
    },
    comments: {
      fromResource: function (resourceType, resourceId, callback) {
        return self.request('/' + resourceType + '/' + resourceId + '/comments.xml', function (err, comments) {
          if (!err)
            comments = comments.comments.comment;

          callback(err, comments);
        });
      },
      load: function (id, callback) {
        return self.request('/comments/' + id + '.xml', callback);
      }
    },
    todoLists: {
      all: function (callback) {
        return self.request('/todo_lists.xml', function (err, todoLists) {
          if (!err)
            todoLists = todoLists.todoLists.todoList;

          callback(err, todoLists);
        });
      },
      fromResponsible: function (responsibleId, callback) {
        return self.request('/todo_lists.xml?responsible_party=' + responsibleId, function (err, todoLists) {
          if (!err)
            todoLists = todoLists.todoLists.todoList;

          callback(err, todoLists);
        });
      },
      fromProject: function (projectId, callback) {
        return self.request('/projects/' + projectId + '/todo_lists.xml', function (err, todoLists) {
          if (!err)
            todoLists = todoLists.todoLists.todoList;

          callback(err, todoLists);
        });
      },
      fromProjectPending: function (projectId, callback) {
        return self.request('/projects/' + projectId + '/todo_lists.xml?filter=pending', function (err, todoLists) {
          if (!err)
            todoLists = todoLists.todoLists.todoList;

          callback(err, todoLists);
        });
      },
      fromProjectFinished: function (projectId, callback) {
        return self.request('/projects/' + projectId + '/todo_lists.xml?filter=finished', function (err, todoLists) {
          if (!err)
            todoLists = todoLists.todoLists.todoList;

          callback(err, todoLists);
        });
      },
      load: function (id, callback) {
        return self.request('/todo_lists/' + id + '.xml', callback);
      }
    },
    todoItems: {
      "fromList": function (listId, callback) {
        return self.request('/todo_lists/' + listId + '/todo_items.xml', function (err, todoItems) {
          callback(err, todoItems);
        });
      },
      load: function (id, callback) {
        return self.request('/todo_items/' + id + '.xml', callback);
      }
    },
    milestones: {
      fromProject: function (projectId, callback) {
        return self.request('/projects/' + projectId + '/milestones/list.xml', function (err, milestones) {
          if (!err)
            milestones = milestones.milestones.milestone;

          callback(err, milestones);
        });
      }
    },
    calendarEntries: {
      fromProject: function (projectId, callback) {
        return self.request('/projects/' + projectId + '/calendar_entries/calendar_events.xml', callback);
      },
      createInProject: function (projectId, newCalendarEntry, callback) {
        if (!newCalendarEntry)
          throw new Error("Must have a new calendar item to create.");
        return self.request('/projects/' + projectId + '/calendar_entries.xml', "POST", newCalendarEntry, callback);
      }
    },
    time: {
      fromProject: function (projectId, callback) {
        return self.request('/projects/' + projectId + '/time_entries.xml', function (err, time) {
          if (!err)
            time = time.timeEntries;

          callback(err, time);
        });
      },
      fromTodo: function (todoId, callback) {
        return self.request('/todo_items/' + todoId + '/time_entries.xml', function (err, time) {
          if (!err)
            time = time.timeEntries;

          callback(err, time);
        });
      },
      report: function (options, callback) {
        var ar = [];
        for (var option in options) {
          ar.push(option + '=' + options[option]);
        }
        ar = (ar.length > 0) ? ar.join('&') : '';
        return self.request('/time_entries/report.xml?' + ar, function (err, time) {
          if (!err)
            time = time.timeEntries;

          callback(err, time);
        });
      }
    },
    files: {
      fromProject: function (projectId, offset, callback) {
        return self.request('/projects/' + projectId + '/attachments.xml?n=' + offset, function (err, files) {
          if (!err)
            files = files.files.attachment;

          callback(err, files);
        });
      }
    }
  };

  return this.api;
};

Basecamp.prototype.request = function (path, method, data, callback) {
  if (!callback && typeof data === "function") {
    callback = data;
    data = null;
  }
  if (!data && typeof method === "function") {
    callback = method;
    method = null;
  }
  method = method || "GET";
  
  if (!callback)
    return;

  function normalise(input, key) {
    var key = key || 'root',
      type = getType(input),
      norm = {};

    if (type != 'Object' && type != 'Array')
      return input;

    if (type == 'Array')
      norm = [];

    for (var sub in input) {
      if (sub == '@') continue;

      if (sub == '#') {
        switch (input[sub]) {
          case 'false':
            norm = false;
            break;
          case 'true':
            norm = true;
            break;
          default:
            norm = input[sub];
            break;
        }
      } else {
        norm[nicerKey(sub)] = normalise(input[sub], sub);
      }
    }

    return norm;
  }

  function getType(obj) {
    return Object.prototype.toString.call(obj).match(/^\[object (.*)\]$/)[1]
  }

  function nicerKey(key) {
    return key.replace(/-([a-z])/g, function (g) {
      return g[1].toUpperCase();
    });
  }

  function encodeData(data) {
    var builder = new xml2js.Builder({ headless: true });
    var reqData = { request: {} };
    reqData.request = data;
    var xml = builder.buildObject(reqData);
    return xml;
  }
    
  var expectedStatusCode = 200;
  switch (method) {
    case "POST": expectedStatusCode = 201; break;
  }

  var options = {
    "host": this.schemeFreeHost,
    "path": path,
    "method": method,
    "headers": {
      "Authorization": 'Basic ' + this.key,
      "Host": this.schemeFreeHost,
      "Accept": 'application/xml',
      "Content-Type": 'application/xml',
      "User-Agent": 'NodeJS'
    }
  };

  var postData;
  if (data) {
    postData = encodeData(data);
    console.log(postData);
    options.headers['Content-Length'] = Buffer.byteLength(postData);
  }
  
  var req = https.request(options, function (res) {
    var xml = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      xml += chunk;
    }).on('end', function () {
      if (res.statusCode != expectedStatusCode) {
        console.error('Basecamp API error: ' + res.statusCode + ' ' + options.path);
        callback(true, { 'status': res.statusCode });
        return;
      }

      var parser = new xml2js.Parser();
      parser.addListener('end', function (result) {
        callback(false, normalise(result));
      });
      parser.parseString(xml);
    });
  });

  req.on('error', function (e) {
    console.error('error');
    console.error(e);
    callback(e, null);
  });

  if (postData)
    req.write(postData);

  req.end();
};

module.exports = Basecamp;
