/* eslint-disable no-unused-vars */
/* globals Session Hosts Meteor Services */

function greyServicesBlue () {
  // Loops through each service from the selected project
  // and changes the status of any gray service to blue
  //
  // Usage: greyServicesBlue()
  // Created by: Keith Thome
  // Requires client-side updates: true

  var projectId = Session.get('projectId')
  var modifiedBy = Meteor.user().emails[0].address
  var services = Services.find({
    'projectId': projectId,
    'status': 'lair-grey'
  }).fetch()
  if (services.length < 1) {
    console.log('No services found')
    return
  }
  services.forEach(function (service) {
    Services.update({
      '_id': service._id
    }, {
      $set: {
        'status': 'lair-blue',
        'last_modifiedBy': modifiedBy
      }
    })
  })
  console.log('Total of ' + services.length + ' service(s) updated to lair-blue.')
}
