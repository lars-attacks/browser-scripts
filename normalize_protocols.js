function NormalizeProtocols () {
    // lowercases all protocols in the services list.
    //
    // Created by: Brook Keele
    // Usage: NormalizeProtocols()
    // Requires client-side updates: true
  
    var projectId = Session.get('projectId')
    var modifiedBy = Meteor.user().emails[0].address
  
    var services = Services.find({
      'projectId': projectId,
    }).fetch()
    if (services.length < 1) {
      console.log('No services found')
      return
    }
    var updated = 0;
    services.forEach(function (service) {
      if (service.protocol != service.protocol.toLowerCase()) {
        Services.update({
          '_id': service._id
        }, {
          $set: {
            'protocol': service.protocol.toLowerCase(),
            'last_modifiedBy': modifiedBy
          }
        })
        updated++
      }
    })
    console.log('Total of ' + updated + ' service(s) updated.')
  }
