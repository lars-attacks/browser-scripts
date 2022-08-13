/* eslint-disable no-unused-vars */
/* globals Session Issues Meteor */

function listAllHosts () {
  // Prints list of all hosts to the console
  // Usage: listAllHosts()
  // Created by: Lars Cohenour
  // Requires client-side updates: true

  var projectId = Session.get('projectId')
  var hosts = Hosts.find({
    'projectId': projectId,
  }).fetch()

  hosts.forEach(function (host) {
  	console.log(host.ipv4)
  })
}