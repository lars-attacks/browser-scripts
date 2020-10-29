/* globals Session Meteor Hosts Services Issues StatusMap */
/* eslint-disable no-unused-vars */
function removeIPBasedHostnames () {
  // Removes generic hostnames containing IP addresses commonly assigned by ISPs
  //
  // Created by XanderK
  //
  var hosts = Hosts.find({
    projectId: Session.get('projectId')
  }).fetch()
  hosts.forEach(function (host) {
    var ip = host.ipv4
    var hostnames = []
    host.hostnames.forEach(function (name) {
      if (name.includes(ip)) {
        console.log("removing " + name)
        return
      }
      if (name.includes(ip.replace(/\./g,"_"))) {
        console.log("removing " + name)
        return
      }
      if (name.includes(ip.replace(/\./g,"-"))) {
        console.log("removing " + name)
        return
      }
      var revIp = ip.split('.').reverse().join('.') 
      if (name.includes(revIp)) {
        console.log("removing " + name)
        return
      }
      if (name.includes(revIp.replace(/\./g,"_"))) {
        console.log("removing " + name)
        return
      }
      if (name.includes(revIp.replace(/\./g,"-"))) {
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
