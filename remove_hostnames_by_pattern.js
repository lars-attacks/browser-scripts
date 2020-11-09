/* globals Session Meteor Hosts Services Issues StatusMap */
/* eslint-disable no-unused-vars */
function removeHostnamesByPattern (pattern) {
    // Removes generic hostnames containing the provided pattern
    //
    // Created by XanderK
    //
    var hosts = Hosts.find({
      projectId: Session.get('projectId')
    }).fetch()
    hosts.forEach(function (host) {
      var hostnames = []
      host.hostnames.forEach(function (name) {
        if (name.includes(pattern)) {
          console.log("removing " + name)
          return
        }
  
        hostnames.push(name)
      })
  
      Hosts.update({
        _id: host._id
      }, {
        $set: {
          'hostnames': hostnames,
          lastModifiedBy: Meteor.user().emails[0].address
        }
      })
    })
  }