/* eslint-disable no-unused-vars */
/* globals Meteor Session Services */
function mergeDuplicateIssues(){
	// Iterates through all issues and finds duplicate issues. It then merges them into the first and deletes the second.
	// CAUTION: This is VERY slow
	//
	// Created By: Brook Keele
	// Usage: mergeDuplicateIssues()
	// Requires client-side updates: true
	
	var projectId = Session.get('projectId')

	var issues = Issues.find({
		'projectId': projectId
	}).fetch()

	var sortedIssues = issues.sort((a, b) => (a.title > b.title) ? 1 : -1)

	var hosts = Hosts.find({
		'projectId': projectId
	}).fetch()

	for (var i = 0; i < sortedIssues.length-1; i++) {	
		source = sortedIssues[i+1]
		dest = sortedIssues[i]
		if (source.title == dest.title && source.cvss == dest.cvss) {
			console.log("found match: " + dest.title)
			console.log(source.hosts.length + " hosts to move.")
			source.notes.forEach(function (note) {
				console.log("Adding Note")
				Meteor.call('addIssueNote', projectId, dest._id, note.title, note.content)
			})
			source.hosts.forEach(function (host) {
				hosts.forEach(function (projectHost) {
					var serviceMatch = Services.findOne({
						'projectId': projectId,
						'hostId': projectHost._id,
						'port': host.port,
						'protocol': host.protocol
					})
					if (projectHost.ipv4 == host.ipv4 && serviceMatch != null) {
						console.log("Added " + host.ipv4 + " to " + dest.title)
						Meteor.call('removeHostFromIssue', projectId, source._id, host.ipv4, host.port, host.protocol)
						Meteor.call('addHostToIssue', projectId, dest._id, host.ipv4, host.port, host.protocol)
					}
				})
			})
			source.cves.forEach(function (cve) {
				if (!dest.cves.includes(cve)) {
					console.log("Adding CVE " + cve)
					Meteor.call('addCVE', projectId, dest._id, cve)
				}
			})
			if (source.evidence != dest.evidence) {
				dest.evidence += "\n\n" + source.evidence
				console.log("Updating Evidence.")
				Meteor.call('setIssueEvidence', projectId, dest._id, dest.evidence)
			}
			console.log("Removing issue.")
			Meteor.call('removeIssue', projectId, source._id)
		}
	}
}
