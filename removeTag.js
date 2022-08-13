function removeTag (tag) {
  // Removes all instances of provided tag
  //
  // Created by: Lars Cohenour
  // Borrowed heavilty from:
  // https://github.com/lair-framework/browser-scripts/blob/master/list_hosts_by_tag.js
  // https://github.com/lair-framework/browser-scripts/blob/master/change_service_to_specified_color.js
  // Usage: setHostsByStatus('tagname', 'lair-color')
  // Requires client-side updates: true
 
  var projectId = Session.get('projectId')
  var modifiedBy = Meteor.user().emails[0].address

  //get tagged hosts
  var hosts = Hosts.find({
          projectId: Session.get('projectId'),
          tags: tag
  }).fetch()

  //set tagged host status
  hosts.forEach(function (host) {
    console.log('Removed ' + tag + ' from ' + host.ipv4)
    Hosts.update({
      '_id': host._id
    }, {
      $pull: {
        'tags': tag
      }
    })
  })
}