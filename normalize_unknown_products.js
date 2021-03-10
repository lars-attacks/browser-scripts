function NormalizeUnknownProducts () {
    // removes 'unknown' products in the services list to ensure all unknown products are empty.
    //
    // Created by: Brook Keele
    // Usage: NormalizeUnknownProducts()
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
      if (service.product.toLowerCase() == 'unknown') {
        Services.update({
          '_id': service._id
        }, {
          $set: {
            'product': '',
            'last_modifiedBy': modifiedBy
          }
        })
        updated++
      }
    })
    console.log('Total of ' + updated + ' service(s) updated.')
  }
