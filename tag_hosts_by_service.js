/* eslint-disable no-unused-vars */
/* globals Session Services Meteor */

function tagHostsByService (port, protocol, service, tag) {
  // Script to tag hosts by port and protocol
  // Usage:
  //  tagHostsByService(port, protocol, service, tag)
  // Examples:
  //  tagHostsByService(9100, 'tcp', 'jetdirect', 'Printer')
  // Author: Jess Hires
  // Requires client-side updates: false

  var projectId = Session.get('projectId')
  var services = Services.find({
    'projectId': projectId,
    'port': port,
    'protocol': protocol,
    'service': service
  })

  function addHostTag (hostId, tag) {
  check(hostId, Matchers.isObjectId)
  check(tag, Matchers.isNonEmptyString)
  return Hosts.update({
      _id: hostId
    }, {
      $addToSet: {
        tags: tag
      },
      $set: {
        lastModifiedBy: Meteor.user().emails[0].address
      }
    })
  }
  
  services.forEach(function (service) {
    console.log('Tagging host with service as "' + tag + '": ' + service._id + ' ' + service.port + '/' + service.protocol + ' ' + service.service)
    addHostTag(service.hostId, tag)
  })
}