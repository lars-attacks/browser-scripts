/* globals Session Meteor Hosts Services Issues StatusMap */
/* eslint-disable no-unused-vars */
function removePort0ServicesNoReference () {
// Changes host color based on services|issues of the host
  //
  // This is to remove the port 0 services added by Nessus. It will check all issues and notes to avoid removing any port 0 services referenced by
  // an issue or note, but otherwise will delete all port 0 services.
  //
  // Created by XanderK
  //
  // Usage
  // removePort0ServicesNoReference()
  
  var projectId = Session.get('projectId')
  var servicearray = []
  var excludedarray = []
  var delarray = []

  var hosts = Hosts.find({
    'projectId': projectId
  }).fetch()

  hosts.forEach(function (host) {
    var hostid = host._id
    var services = Services.find({
      'projectId': projectId,
      'hostId': host._id
    }).fetch()
    services.forEach(function (service) {
      // check if service is 0 and that notes are empty - add to service array
      if (service.port <= 0 && service.notes < 1) {
	  	  var dict = { ip: host.ipv4, service: service }
        servicearray.push(dict)
      }
    })
  })
  var issues = Issues.find({
    'projectId': projectId
  }).fetch()
  
  issues.forEach(function (issue) {
    issue.hosts.forEach( function (host) {
  	  if (host.port != 0) {
	      return
	    }
	    for (var x = 0; x < servicearray.length; x++) {
		    if (servicearray[x].ip == host.ipv4 && host.protocol == servicearray[x].service.protocol) {
		      excludedarray.push(servicearray[x].service._id)
		    }
      }
	  })
  })

  for (var x = 0; x < servicearray.length; x++) {
    for (var y = 0; y < excludedarray.length; y++) {
	    if (servicearray[x].service._id == excludedarray[y]){
	      continue;
	    }
    }
	  delarray.push(servicearray[x].service)
  }
  
  console.log("Removing " + delarray.length + " out of " + servicearray.length + " port 0 services")
  for (var x = 0; x < delarray.length; x++) {
    console.log('Removing ServiceID: ' + delarray[x]._id)
    Meteor.call('removeService', projectId, delarray[x].hostId, delarray[x]._id, function (err) {})
  }
}
