/* eslint-disable no-unused-vars */
/* globals Meteor Session Services */
function bulkRemoveHosts(hostsToRemove) {
	// Removes all hosts in the Lair project that are contained in the provided array of IP addresses.
	// Useful if the client has removed parts of the scope
    //
    // Created by: Brook Keele
    // Usage: bulkRemoveHosts(["192.168.0.1","192.168.0.2","192.168.0.3","192.168.0.4"])
    // Requires client-side updates: true
	
	var projectId = Session.get('projectId')
	var modifiedBy = Meteor.user().emails[0].address

	var hosts = Hosts.find({
	'projectId': projectId}).fetch()

	count=0
	hosts.forEach(function(host) {
		if (hostsToRemove.includes(host.ipv4)) {
			Meteor.call('removeHost', projectId, host._id, function(err) {
        if (err) {
          console.log("Error removing " + host.ipv4 + ". " + err)
        } else {
       	  Meteor.call('removeHostFromIssues', projectId, host._id)
        }
			})
			count ++
		}
	})
	console.log('Total of ' + count + ' host(s) removed.')
}
