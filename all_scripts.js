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
/* globals Session Meteor Hosts Services Issues StatusMap */
/* eslint-disable no-unused-vars */
function changeHostsToSpecifiedColorByServicesOrIssues (servicesOrIssues, statusOption, lairColor) {
  // Changes host color based on services|issues of the host
  //
  // This is good for editing large chucks of hosts based on service or vuln color.
  // Example: You've marked a bunch of services green and want to change all hosts, whose services are now all
  // green, to green. You run: changeHostsToSpecifiedColorByServicesOrIssues('services', 'lair-green', 'lair-green')
  //
  // Created by Isaiah Sarju
  //
  // Services or Issues Options (servicesOrIssues)
  // 'services': Change hosts based on hosts' services
  // 'issues': Change hosts based on hosts' issues
  //
  // Status Options (statusOption)
  // 'all': Change all hosts to specified lairColor
  // 'none': Hosts with no services|issues associated with them are changed to specified lairColor
  // 'lair-color': If all services|issues of a host are 'lair-color' change host to specified lairColor. Number of services|issues for host must be > 0
  // 'same': If there are no services|issues or all services|issues are the same color, set host color to specified lairColor
  // 'diff': If there are > 1 services|issues and services|issues differ in color, set host color to specified lairColor
  //
  // Lair Color Options (lairColor): lair-grey, lair-blue, lair-green, lair-orange, lair-red
  //
  // Usage
  // changeHostsToSpecifiedColorByServicesOrIssues('doesnmatter', 'all', 'lair-green'); Change all hosts to lair-green
  // changeHostsToSpecifiedColorByServicesOrIssues('services', 'none', 'lair-green'); If host has no services change to lair-green
  // changeHostsToSpecifiedColorByServicesOrIssues('issues', 'lair-orange', 'lair-red'); If all issues are lair-orange change host to lair-red
  // changeHostsToSpecifiedColorByServicesOrIssues('issues', 'same', 'lair-blue'); If host has same colored issues change host to lair-blue
  // changeHostsToSpecifiedColorByServicesOrIssues('services', 'diff', 'lair-grey'); If host has different colored services change host to lair-grey

  var projectId = Session.get('projectId')
  var modifiedBy = Meteor.user().emails[0].address
  var statCount = 0
  var count = 0

  // Define allSameColor callback function for object.every()
  // Returns true if value's color is same as (value - 1)'s color
  function allSameColor (value, index, array) {
    // Base Case
    if (index === 0) {
      return true
    }

    // Return true if status is same as previous status
    // else return false
    return (value.status === array[index - 1].status)
  }

  // Define changeHostColor
  function changeHostColor (id, newColor) {
    Hosts.update({
      '_id': id
    }, {
      $set: {
        'status': newColor,
        'lastModifiedBy': modifiedBy
      }
    })

  }

  // Define getServices
  // Returns service array of given host id
  function getServices (id) {
    return Services.find({
      'projectId': projectId,
      'hostId': id
    }).fetch()
  }

  // Define getIssues
  // Returns service array of given host id
  function getIssues (id) {
    var hostIpv4 = Hosts.findOne({ '_id': id }).ipv4
    return Issues.find({
      'projectId': projectId,
      'hosts.ipv4': hostIpv4
    }).fetch()
  }

  // Define getServicesOrIssues
  // Returns array of Services or Issues for host based on servicesOrIssues
  function getServicesOrIssues (id) {
    if (servicesOrIssues === 'services') {
      return getServices(id)
    } else if (servicesOrIssues === 'issues') {
      return getIssues(id)
    }
    throw {
      name: 'Incorrect servicesOrIssues Selection',
      message: 'Incorrect servicesOrIssues selection: "' + servicesOrIssues + '" is not a valid servicesOrIssues for this function'
    }
  }

  if (StatusMap.indexOf(lairColor) === -1) {
    console.log('Lair Supserviceed colors: ' + StatusMap)
    throw {
      name: 'Wrong lairColor',
      message: 'Provided lairColor: "' + lairColor + '" is not Lair compliant'
    }
  }

  // Get all hosts
  var hosts = Hosts.find({
    'projectId': projectId
  }).fetch()

  // If statusOption === 'all' Change all services to specified lairColor
  if (statusOption === 'all') {
    hosts.forEach(function (host) {
      // Change host to lairColor
      changeHostColor(host._id, lairColor)
    })

    // set count to hosts.length
    count = hosts.length
  } else if (statusOption === 'none') {
    hosts.forEach(function (host) {
      var hostid = host._id
      var arrayLen = getServicesOrIssues(hostid).length

      // If host has no services|issues update its color
      if (arrayLen <= 0) {
        // Change host to lairColor
        changeHostColor(hostid, lairColor)

        // Update Count
        statCount++
      }
    })

    // set count to statCount
    count = statCount
  } else if (StatusMap.indexOf(statusOption) !== -1) {
    // Iterate over each host
    hosts.forEach(function (host) {
      // changeColor starts as false
      var changeColor = false
      var hostid = host._id

      // Get array of services|issues for current host
      var obj = getServicesOrIssues(hostid)

      changeColor = (obj.length > 0 && obj[0].status === statusOption && obj.every(allSameColor))

      // If changeColor value is true, meaning all services|issues of this host are the same color
      // and there are >= 1 services|issues, then change host to the specified lairColor
      if (changeColor) {
        // Change host to lairColor
        changeHostColor(hostid, lairColor)

        // Update Count
        statCount++
      }

      // set count to statCount
      count = statCount
    })
  } else if (statusOption === 'same') {
    hosts.forEach(function (host) {
      // changeColor starts as false
      var changeColor = false
      var hostid = host._id

      // Get array of services|issues for current host
      var obj = getServicesOrIssues(hostid)

      changeColor = (obj.every(allSameColor))

      // If changeColor value is true, meaning all services|issues of this host are the same color
      // and there are >= 1 services|issues, then change host to the specified lairColor
      if (changeColor) {
        // Change host color
        changeHostColor(hostid, lairColor)

        // Update Count
        statCount++
      }

      // set count to statCount
      count = statCount
    })
  } else if (statusOption === 'diff') {
    hosts.forEach(function (host) {
      // changeColor starts as false
      var changeColor = false
      var hostid = host._id

      // Get array of services|issues for current host
      var obj = getServicesOrIssues(hostid)

      changeColor = !(obj.every(allSameColor))

      // If changeColor value is true, services|issues of this host vary in color
      // and there are >= 1 services|issues, then change host to the specified lairColor
      if (changeColor) {
        // Change host color
        changeHostColor(hostid, lairColor)

        // Update Count
        statCount++
      }

      // set count to statCount
      count = statCount
    })
  } else {
    throw {
      name: 'Incorrect statusOption Selection',
      message: 'Incorrect statusOption selection: "' + statusOption + '" is not a valid statusOption for this function'
    }
  }

  console.log('Total of ' + count + ' host(s) updated')
}
/* eslint-disable no-unused-vars */
/* globals Session Meteor Services */
function changeServicesRegexToSpecifiedColor (lairServiceRegex, lairColor) {
  // Changes the status of a given service to the specified color
  //
  // Updated to include Regex by Isaiah Sarju
  // Created by: Dan Kottmann
  // Updated by: Ryan Dorey
  // Usage: changeServicesRegexToSpecifiedColor(/*.sql.*/, 'lair-blue')
  // Colors available: lair-grey, lair-blue, lair-green, lair-orange, lair-red
  // Requires client-side updates: true

  var projectId = Session.get('projectId')
  var modifiedBy = Meteor.user().emails[0].address

  if (lairColor !== 'lair-grey' && lairColor !== 'lair-blue' && lairColor !== 'lair-green' && lairColor !== 'lair-orange' && lairColor !== 'lair-red') {
    console.log('Invalid color specified')
    return
  }
  var services = Services.find({
    'projectId': projectId,
    'service': {
      '$regex': lairServiceRegex
    }
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
        'status': lairColor,
        'lastModifiedBy': modifiedBy
      }
    })
  })
  console.log('Total of ' + services.length + ' service(s) updated to ' + lairColor + '.')
}
/* eslint-disable no-unused-vars */
/* globals Session Meteor Services */
function changeServicesToSpecifiedColor (lairPort, lairColor) {
  // Changes the status of the given service number to the specified color
  //
  // Created by: Dan Kottmann
  // Updated by: Ryan Dorey
  // Usage: changeServicesToSpecifiedColor(80, 'lair-orange')
  // Colors available: lair-grey, lair-blue, lair-green, lair-orange, lair-red
  // Requires client-side updates: true

  var projectId = Session.get('projectId')
  var modifiedBy = Meteor.user().emails[0].address

  if (lairColor !== 'lair-grey' && lairColor !== 'lair-blue' && lairColor !== 'lair-green' && lairColor !== 'lair-orange' && lairColor !== 'lair-red') {
    console.log('Invalid color specified')
    return
  }
  var services = Services.find({
    'projectId': projectId,
    'service': lairPort
  }).fetch()
  if (services.length < 1) {
    console.log('No services found')
    return
  }
  services.forEach(function (service) {
    console.log('Updating: ' + service.service + '/' + service.protocol)
    Services.update({
      '_id': service._id
    }, {
      $set: {
        'status': lairColor,
        'last_modified_by': modifiedBy
      }
    })
  })
  console.log('Total of ' + services.length + ' service(s) updated')
}
/* eslint-disable no-unused-vars */
/* globals Meteor Session Services */
function changeServicesToColorByPort (lairPort, lairColor) {
    // Changes the status of a given service to the specified color
    // Modified version of the same function by service name. 
    //
    // Original Created by: Dan Kottmann
    // Updated by: Ryan Dorey
    // Changed by: Brook Keele
    // Usage: changeServicesToColorByPort(51022, 'lair-orange')
    // Colors available: lair-grey, lair-blue, lair-green, lair-orange, lair-red
    // Requires client-side updates: true
  
    var projectId = Session.get('projectId')
    var modifiedBy = Meteor.user().emails[0].address
  
    if (lairColor !== 'lair-grey' && lairColor !== 'lair-blue' && lairColor !== 'lair-green' && lairColor !== 'lair-orange' && lairColor !== 'lair-red') {
      console.log('Invalid color specified')
      return
    }
    var services = Services.find({
      'projectId': projectId,
      'port': lairPort
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
          'status': lairColor,
          'last_modifiedBy': modifiedBy
        }
      })
    })
    console.log('Total of ' + services.length + ' service(s) updated to ' + lairColor + '.')
  }/* eslint-disable no-unused-vars */
/* globals Meteor Session Services */
function changeServicesToSpecifiedColorByProduct (lairServiceProduct, lairColor) {
    // Changes the status of a given service to the specified color
    //
    // Based of changeServicesToSpecifiedColor, Created by: Dan Kottmann
    // Updated by: Brook Keele
    // Usage: changeServicesToSpecifiedColorByProduct('Microsoft HTTPAPI httpd 2.0', 'lair-orange')
    // Colors available: lair-grey, lair-blue, lair-green, lair-orange, lair-red
    // Requires client-side updates: true
  
    var projectId = Session.get('projectId')
    var modifiedBy = Meteor.user().emails[0].address
  
    if (lairColor !== 'lair-grey' && lairColor !== 'lair-blue' && lairColor !== 'lair-green' && lairColor !== 'lair-orange' && lairColor !== 'lair-red') {
      console.log('Invalid color specified')
      return
    }
    var services = Services.find({
      'projectId': projectId,
      'product': lairServiceProduct
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
          'status': lairColor,
          'last_modifiedBy': modifiedBy
        }
      })
    })
    console.log('Total of ' + services.length + ' service(s) updated to ' + lairColor + '.')
  }
  /* eslint-disable no-unused-vars */
/* globals Meteor Session Services */
function changeServicesToSpecifiedColor (lairService, lairColor) {
  // Changes the status of a given service to the specified color
  //
  // Created by: Dan Kottmann
  // Updated by: Ryan Dorey
  // Usage: changeServicesToSpecifiedColor('dce-rpc', 'lair-orange')
  // Colors available: lair-grey, lair-blue, lair-green, lair-orange, lair-red
  // Requires client-side updates: true

  var projectId = Session.get('projectId')
  var modifiedBy = Meteor.user().emails[0].address

  if (lairColor !== 'lair-grey' && lairColor !== 'lair-blue' && lairColor !== 'lair-green' && lairColor !== 'lair-orange' && lairColor !== 'lair-red') {
    console.log('Invalid color specified')
    return
  }
  var services = Services.find({
    'projectId': projectId,
    'service': lairService
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
        'status': lairColor,
        'last_modifiedBy': modifiedBy
      }
    })
  })
  console.log('Total of ' + services.length + ' service(s) updated to ' + lairColor + '.')
}
/* eslint-disable no-unused-vars */
/* globals projectId Hosts Services Session StatusMap */
function countHostServicesBycolor (color) {
  // Logs a count of all service by color per host
  //
  // Created by: Matt Burch
  // Usage: countHostServicesBycolor('lair-grey')
  // Supserviceed colors: console.log(StatusMap)
  //
  var hosts = {}
  var projectId = Session.get('projectId')

  if (StatusMap.indexOf(color) === -1) {
    console.log('Lair Supserviceed colors: ' + StatusMap)
    throw {
      name: 'Wrong color',
      message: 'Provided color: "' + color + '" is not Lair compliant'
    }
  }

  var services = Services.find({
    'projectId': projectId,
    'status': color
  }).fetch()
  services.forEach(function (service) {
    host = Hosts.findOne({
      'projectId': projectId,
      '_id': service.hostId
    })
    if (hosts.hasOwnProperty(host.ipv4)) {
      hosts[host.ipv4]++
    } else {
      hosts[host.ipv4] = 1
    }
  })
  for (var host in hosts) {
    console.log(host + ' (' + hosts[host] + ')')
  }
}
/* eslint-disable no-unused-vars */
/* globals projectId Hosts Services Session StatusMap */
function countHostServicesBycolor (color) {
  // Logs a count of all service by color per host
  //
  // Created by: Matt Burch
  // Usage: countHostServicesBycolor('lair-grey')
  // Supserviceed colors: console.log(StatusMap)
  //
  var hosts = {}
  var projectId = Session.get('projectId')

  if (StatusMap.indexOf(color) === -1) {
    console.log('Lair Supserviceed colors: ' + StatusMap)
    throw {
      name: 'Wrong color',
      message: 'Provided color: "' + color + '" is not Lair compliant'
    }
  }

  var services = Services.find({
    'projectId': projectId,
    'status': color
  }).fetch()
  services.forEach(function (service) {
    host = Hosts.findOne({
      'projectId': projectId,
      '_id': service.hostId
    })
    if (hosts.hasOwnProperty(host.ipv4)) {
      hosts[host.ipv4]++
    } else {
      hosts[host.ipv4] = 1
    }
  })
  for (var host in hosts) {
    console.log(host + ' (' + hosts[host] + ')')
  }
}
function deleteHostsByCIDR () {
  // Delete list of IPv4 targets from supplied CIDR range
  //
  // Created by: Matt Burch
  // Usage: deleteHostsByCIDR('x.x.x.x/x') or deleteHostsByCIDR('x.x.x.x/x','y.y.y.y/y')
  //

  var hostTargets = []
  var projectId = Session.get('projectId')
  var nets = Array.prototype.slice.call(arguments, 0)
  var hosts = Hosts.find({
    projectId: projectId
  }).fetch()
  var hostip = {}
  var hostid = {}
  var count = 0

  function dec2Bin (octet, cidr) {
    var pad = '00000000'
    var bin = parseInt(octet[0], 10).toString(2)
    var bincidr = (bin.length >= pad.length ? bin : pad.slice(0, pad.length - bin.length) + bin)

    for (var i = 1; i <= octet.length; i++) {
      bin = parseInt(octet[i], 10).toString(2)
      bincidr += (bin.length >= pad.length ? bin : pad.slice(0, pad.length - bin.length) + bin)
    }

    return bincidr.slice(0, parseInt(cidr, 10))
  }

  hosts.forEach(function (host) {
    var ip = host.ipv4.split('.')
    hostip[dec2Bin(ip, 32)] = host.ipv4
    hostid[host.ipv4] = host._id
  })

  nets.forEach(function (cidr) {
    cidr = cidr.split('/')
    var net = cidr[0].split('.')
    var netbin = dec2Bin(net, cidr[1])

    for (var key in hostip) {
      if ((key.slice(0, parseInt(cidr[1], 10))) === netbin) {
        Meteor.call('removeHost', projectId, hostid[hostip[key]], function(err) {
          if (!err) {
            Meteor.call('removeHostFromIssues', projectId, hostip[key])
          }
        })
        count ++
      }
    }
    console.log('Total of ' + count + ' host(s) removed.')
  })
}
/* eslint-disable no-unused-vars */
/* globals Session Hosts Meteor */

function deleteHostsByStatus (status) {
  // Deletes all hosts of a given status
  //
  // Usage: deleteHostsByStatus('lair-grey')
  // Created by: Dan Kottmann
  // Requires client-side updates: true

  var projectId = Session.get('projectId')
  var hosts = Hosts.find({
    'projectId': projectId,
    'status': status
  }).fetch()
  if (hosts.length < 1) {
    console.log('No matching hosts found')
    return
  }
  hosts.forEach(function (host) {
    console.log('Removing ' + host.ipv4)
    Meteor.call('removeHost', projectId, host._id, function (err) {
      if (!err) {
        Meteor.call('removeHostFromIssues', projectId, host.ipv4)
      }
    })
  })
  console.log('Total of ' + hosts.length + ' host(s) removed.')
}
/* eslint-disable no-unused-vars */
/* globals Session Hosts Services Meteor */

function deleteHostServicesByTool (ipAddr, lastModBy) {
  // Looks at a provided host and deletes any service by
  // specified 'Last Modified By' value.
  // Useful if a scanner adds large sum of bad Services.
  //
  //
  // Usage: deleteHostServicesByTool('192.168.1.141', 'nexpose')
  // Created by: Ryan Dorey
  // Requires client-side updates: true

  var projectId = Session.get('projectId')

  var host = Hosts.findOne({
    'projectId': projectId,
    'ipv4': ipAddr
  })
  if (typeof host === 'undefined') {
    console.log('No matching host found')
    return
  }

  var services = Services.find({
    'projectId': projectId,
    'hostId': host._id,
    'lastModifiedBY': lastModBy
  }).fetch()
  if (services.length < 1) {
    console.log('No matching Services found')
  }

  services.forEach(function (service) {
    console.log('Removing ' + service.protocol + '/' + service.service)
    Meteor.call('removeService', projectId, service._id, function () {})
  })
  console.log('Total of ' + services.length + ' service(s) removed.')
}
/* eslint-disable no-unused-vars */
/* globals Session Issues Meteor */

function deleteIssuesByStatus (status) {
  // Deletes all Issues of a given status
  //
  // Usage: deleteIssuesByStatus('lair-grey')
  // Created by: Isaiah Sarju
  // Requires client-side updates: true

  var projectId = Session.get('projectId')
  var issues = Issues.find({
    'projectId': projectId,
    'status': status
  }).fetch()
  if (issues.length < 1) {
    console.log('No matching Issues found')
    return
  }
  issues.forEach(function (issue) {
    console.log('Removing ' + issue.title)
    Meteor.call('removeIssue', projectId, issue._id)
  })
  console.log('Total of ' + issues.length + ' Issue(s) removed.')
}
/* eslint-disable no-unused-vars */
/* globals Session Issues Meteor */

function deleteIssuesWithNoHosts () {
  // Looks at all issues and deletes
  // any Issue that has a zero (0) host count.
  // Useful if a host was removed from the project
  // and left orphaned issues behind.
  //
  //
  // Usage: deleteIssuesNoHosts()
  // Created by: Ryan Dorey
  // Requires client-side updates: true

  var projectId = Session.get('projectId')
  var orphanedIssues = Issues.find({
    'projectId': projectId,
    'hosts': {
      $size: 0
    }
  }).fetch()

  if (orphanedIssues.length < 1) {
    console.log('No orphaned issues present')
    return
  }
  orphanedIssues.forEach(function (issue) {
    console.log('Removing: ' + issue.title)
    Meteor.call('removeIssue', projectId, issue._id, function () {})
  })
  console.log('Total of ' + orphanedIssues.length + ' vuln(s) removed')
}
/* eslint-disable no-unused-vars */
/* globals Session Services Meteor */

function deleteServices (port, protocol, service) {
  // Script to delete phantom services (mostly for UDP)
  // Examples:
  //  deleteServices(4172, 'udp', 'unknown')
  // Usage:
  //  deleteServices(port, protocol, service)
  //  deleteServices(0, 'udp', 'general')
  // Author: Alex Lauerman
  // Requires client-side updates: false

  var projectId = Session.get('projectId')
  var services = Services.find({
    'projectId': projectId,
    'port': port,
    'protocol': protocol,
    'service': service
  })

  services.forEach(function (service) {
    console.log('Removing Service : ' + service._id + ' ' + service.port + '/' + service.protocol + ' ' + service.service)
    Meteor.call('removeService', projectId, service.hostId, service._id)
  })
}
function dumpIssueEvidence () {
  // Dump the contents of issue evidence
  //
  // Usage: dumpIssueEvidence()
  // Created by: Matt Burch
  // Requires client-side updates: false

  var projectId = Session.get('projectId')
  var issues = Issues.find({
    'projectId': projectId
  }).fetch()

  issues.forEach( function(issue) {
    console.log(issue.title)
    console.log(issue.evidence)
  })
}
/* eslint-disable no-unused-vars */
/* globals Session Services _ Hosts Meteor */

function dumpServiceNotes (noteRegex, ip) {
  // Dump the contents of service notes matching a specific regex (matches against note 'title')
  // By supplying an empty string for the 'ip' you can dump all notes.
  // Examples:
  //   dumpServiceNotes('^SSL Self-Signed', '')
  //   dumpServiceNotes('Software Enumeration', '192.168.1.1')
  //
  // Usage: dumpServiceNotes(regex, ip)
  // Created by: Dan Kottmann
  // Requires client-side updates: false

  var projectId = Session.get('projectId')
  var re = new RegExp(noteRegex, 'i')
  var services = Services.find({
    'projectId': projectId,
    'notes': {
      $elemMatch: {
        'title': {
          $regex: noteRegex,
          $options: 'i'
        }
      }
    }
  }, {
    notes: 1,
    hostId: 1
  }).fetch()
  var hostIds = _.pluck(services, 'hostId')
  var hosts = Hosts.find({
    '_id': {
      $in: hostIds
    }
  }, {
    sort: {
      longIpv4Addr: 1
    },
    ipv4: 1
  }).fetch()
  hosts.forEach(function (host) {
    if (ip !== '' && ip !== host.ipv4) {
      return
    }
    services = Services.find({
      'hostId': host._id
    }, {
      sort: {
        service: 1
      },
      notes: 1,
      service: 1,
      protocol: 1
    }).fetch()
    services.forEach(function (service) {
      service.notes.forEach(function (note) {
        if (re.test(note.title)) {
          console.log(host.ipv4 + ':' + service.port + '/' + service.protocol + ' - ' + note.title + '\n' + note.content)
        }
      })
    })
  })
}
/* eslint-disable no-unused-vars */
/* globals Session Hosts Services Meteor */
// APPEARS BROKEN - REMOVING NON-EMPTY HOSTS
// DO NOT USE
function filterHostsNoServices () {
  // Removes hosts that don't have open services and vulns mapped to them (i.e., tcp/udp 0)
  //
  // Created by: Chris Patten
  // Usage: filterHostsNoServices()
  //
  // Requires client-side updates: false

  // var projectId = Session.get('projectId')
  // var servicearray = []
  // var delarray = []

  // var hosts = Hosts.find({
  //   'projectId': projectId
  // }).fetch()

  // hosts.forEach(function (host) {
  //   var hostid = host._id
  //   var services = Services.find({
  //     'projectId': projectId,
  //     'hostId': host._id
  //   }).fetch()
  //   services.forEach(function (service) {
  //     // check if service is 0 and that notes are empty - add to service array
  //     if (service.port <= 0 && service.notes < 1) {
  //       servicearray.push(service.port)
  //     }
  //     if (service.port > 0) {
  //       servicearray.push(service.port)
  //     }
  //   })
  //   // check last index for 0 element - add host to delete array
  //   if ((servicearray[servicearray.length - 1] <= 0) || (servicearray.length <= 0)) {
  //     delarray.push(hostid)
  //   }
  //   servicearray.length = 0
  // })

  // for (var x = 0; x < delarray.length; x++) {
  //   console.log('Removing HostID: ' + delarray[x])
  //   Meteor.call('removeHost', projectId, delarray[x], function (err) {
  //     if (!err) {
  //       Meteor.call('removeHostFromIssues', projectId, delarray[x])
  //     }
  //   })
  // }
}
function findNoteByRegex(noteRegex, noteType) {
  // Performs case insensitive search of the appropriate notes (both the title and contents) for the given regex
  // noteType can be one of the following:
  //    all
  //    project
  //    host
  //    service
  //    Issue - searches the evidence field and notes
  //
  // Usage: findNote('.*Linux.*', 'all')
  // Created by: Joey Belans
  // Requires client-side updates: false

  var projectId = Session.get('projectId')

  var noteRe = new RegExp(noteRegex, 'i')
  if (noteType === 'project' || noteType === 'all') {
    console.log('Project Notes')
    var curProj = Projects.findOne({
      '_id': projectId
    }, {
      notes: 1
    })
    curProj.notes.forEach(function (note) {
      if (noteRe.test(note.title) || noteRe.test(note.content)) {
        console.log('\t' + note.title)
      }
    })
  }
  if (noteType === 'host' || noteType === 'all') {
    console.log('Host Notes')
    Hosts.find({
      'projectId': projectId,
      $or: [{
        'notes': {
          $elemMatch: {
            'title': {
              $regex: noteRegex,
              $options: 'i'
            }
          }
        }
      }, {
        'notes': {
          $elemMatch: {
            'content': {
              $regex: noteRegex,
              $options: 'i'
            }
          }
        }
      }]
    }, {
      notes: 1
    }).fetch().forEach(function (host) {
      host.notes.forEach(function (note) {
        if (noteRe.test(note.title) || noteRe.test(note.content)) {
          console.log('\t' + host.ipv4 + ' -> ' + note.title)
        }
      })
    })
  }
  if (noteType === 'service' || noteType === 'all') {
    console.log('Service Notes')
    Services.find({
      'projectId': projectId,
      $or: [{
        'notes': {
          $elemMatch: {
            'title': {
              $regex: noteRegex,
              $options: 'i'
            }
          }
        }
      }, {
        'notes': {
          $elemMatch: {
            'content': {
              $regex: noteRegex,
              $options: 'i'
            }
          }
        }
      }]
    }, {
      notes: 1
    }).fetch().forEach(function (service) {
      service.notes.forEach(function (note) {
        if (noteRe.test(note.title) || noteRe.test(note.content)) {
          var serviceHost = Hosts.findOne({
            'projectId': projectId,
            '_id': service.hostId
          })
          console.log('\t' + serviceHost.ipv4 + ' -> ' + service.service.toString() + ' -> ' + note.title)
        }
      })
    })
  }
  if (noteType === 'Issue' || noteType === 'all') {
    console.log('Issue Notes')
    Issues.find({
      'projectId': projectId,
      $or: [{
        'evidence': {
          $regex: noteRegex,
          $options: 'i'
        }
      }, {
        'notes': {
          $elemMatch: {
            'title': {
              $regex: noteRegex,
              $options: 'i'
            }
          }
        }
      }, {
        'notes': {
          $elemMatch: {
            'content': {
              $regex: noteRegex,
              $options: 'i'
            }
          }
        }
      }]
    }, {
      notes: 1
    }).fetch().forEach(function (vuln) {
      if (noteRe.test(vuln.evidence)) {
        console.log('\t' + vuln.title + ' -> Evidence Field')
      }
      vuln.notes.forEach(function (note) {
        if (noteRe.test(note.title) || noteRe.test(note.content)) {
          console.log('\t' + vuln.title + ' -> ' + note.title)
        }
      })
    })
  }
}
function generateIssueBulkListByRegex(re) {
    var projectId = Session.get('projectId')
    var services = Services.find({
      'projectId': projectId,
      'service': {
        '$regex': re
      }
    }).fetch()
  
    var entries = []
    services.forEach(function (service) {
      var host = Hosts.findOne({
        'projectId': projectId,
        '_id': service.hostId
      })
      entries.push(host.ipv4 + "," + service.port + "," + service.protocol)
    })

    console.log(entries.join('\n'))
  }  /* eslint-disable no-unused-vars */
/* globals Session Services _ Meteor */

function generatePortStringFromService (service) {
  // Generates a comma separated unique list of open services for the current project that matches
  // the regular expression provided as 'service'.

  // Usage: generatePortStringFromService(/http/)
  //
  // Created by: Tom Steele
  // Requires client-side updates: false

  var projectId = Session.get('projectId')
  var query = {
    'projectId': projectId,
    'service': service
  }
  var services = Services.find(query).fetch()
  return _.uniq(_.pluck(services, 'port')).sort(function (a, b) {
    return a - b
  }).join(',')
}
/* eslint-disable no-unused-vars */
/* globals Session Services _ Meteor */

function generateUniquePortString (protocol) {
  // Generates a comma separate unique list of open services for the current project
  //
  // Usages: generateUniquePortString()
  //         generateUniquePortString('tcp')
  // Created by: Tom Steele
  // Requires client-side updates: false

  var projectId = Session.get('projectId')
  var query = {
    'projectId': projectId
  }
  if (typeof protocol !== 'undefined') {
    query.protocol = protocol
  }
  var services = Services.find(query).fetch()
  return _.uniq(_.pluck(services, 'port')).sort(function (a, b) {
    return a - b
  }).join(',')
}
/* eslint-disable no-unused-vars */
/* globals Session Hosts Services Meteor */

function generateURLList () {
  // Generate a list of URLs for all http(s) services in the current project
  //
  // Created by: Dan Kottmann
  // Usage: generateURLList()
  // Requires client-side updates: false

  var projectId = Session.get('projectId')
  var q = {
    'projectId': projectId
  }
  var hosts = Hosts.find(q).fetch()
  if (!hosts) {
    console.log('No hosts found')
    return
  }
  var c = 0
  var urls = []
  hosts.forEach(function (host) {
    var names = host.hostnames
    var hostId = host._id
    var query = {
      'projectId': projectId,
      'hostId': hostId
    }
    query.service = {
      '$regex': 'web|www|ssl|http|https',
      '$options': 'i'
    }
    var services = Services.find(query).fetch()
    services.forEach(function (service) {
      var protocol = 'http://'
      if (service.service.match(/(ssl|https)/gi)) {
        protocol = 'https://'
      }
      c++
      urls.push(protocol + host.ipv4 + ':' + service.port)
      names.forEach(function (n) {
        c++
        urls.push(protocol + n + ':' + service.port)
      })
    })
  })
  console.log(urls.join('\n'))
  console.log(c + ' URL(s) generated')
}
/* eslint-disable no-unused-vars */
/* globals Session Hosts Services Meteor */

function generateWebDiscoTargetList() {
  // Generate a target list of URLs for webDisco.py
  //
  // Created by: Dan Kottmann (general URL exservice)
  // Updated by: Ryan Dorey (for use with webDisco.py) & Alex Lauerman
  // Usage: generateWebDiscoTargetList()
  // Requires client-side updates: false
  // Note: This only matches based on a few likely conditions and won't necessarily identify
  // 100% of SSL services, so please keep this mind as you run this.
  // Additionally, it could result in some false positives for non-http services that use SSL

  var projectId = Session.get('projectId')
  var q = {
    'projectId': projectId
  }
  var hosts = Hosts.find(q).fetch()
  if (hosts.length < 1) {
    console.log('No hosts found')
    return
  }
  var c = 0
  hosts.forEach(function (host) {
    var names = host.hostnames
    var hostId = host._id
    var query = {
      'projectId': projectId,
      'hostId': hostId
    }
    query.service = {
      '$regex': 'web|www|ssl|http|https',
      '$options': 'i'
    }
    var services = Services.find(query).fetch()
    var urls = []
    services.forEach(function (service) {
      var protocol = 'http'
      if (service.service.match(/(ssl|https)/g)) {
        protocol = 'https'
      }
      service.notes.forEach(function (note) {
        if (note.content.match(/SSL/)) {
          protocol = 'https'
        }
      })
      c++
      urls.push(protocol + ',' + host.ipv4 + ',' + service.port + ',')
      names.forEach(function (n) {
        c++
        urls.push(protocol + ',' + host.ipv4 + ',' + service.port + ',' + n)
      })
    })
  })
  console.log(urls.join('\n'))
  console.log(c + ' URL(s) generated')
}
/* eslint-disable no-unused-vars */
/* globals Session Hosts Meteor */

function getHostsByCIDR () {
  // Generate a list of hostname[ipv4] targets from supplied CIDR range
  //
  // Created by: Matt Burch
  // Usage: getHostsByCIDR('x.x.x.x/x') or getHostsByCIDR('x.x.x.x/x','y.y.y.y/y')
  //

  var hostTargets = []
  var nets = Array.prototype.slice.call(arguments, 0)
  var hosts = Hosts.find({
    projectId: Session.get('projectId')
  }).fetch()
  var hostip = {}

  function dec2Bin (octet, cidr) {
    var pad = '00000000'
    var bin = parseInt(octet[0], 10).toString(2)
    var bincidr = (bin.length >= pad.length ? bin : pad.slice(0, pad.length - bin.length) + bin)

    for (var i = 1; i <= octet.length; i++) {
      bin = parseInt(octet[i], 10).toString(2)
      bincidr += (bin.length >= pad.length ? bin : pad.slice(0, pad.length - bin.length) + bin)
    }

    return bincidr.slice(0, parseInt(cidr, 10))
  }

  hosts.forEach(function (host) {
    var ip = host.ipv4.split('.')
    hostip[dec2Bin(ip, 32)] = host.ipv4
  })

  nets.forEach(function (cidr) {
    cidr = cidr.split('/')
    var net = cidr[0].split('.')
    var netbin = dec2Bin(net, cidr[1])

    for (var key in hostip) {
      if ((key.slice(0, parseInt(cidr[1], 10))) === netbin) {
        console.log(hostip[key])
      }
    }
  })
}
function getPersonByDepartmentRegex (dep) {
  // Generate a of email addresses based on person department regex by Principal, Department, Email
  //
  // Created by: Matt Burch
  // Usage: getPersonByDepartmentRegex(/CIO/)
  //

  if (dep && typeof dep !== 'object') {
    return console.log('Department regex can not be a string, must be an object')
  }
  var projectId = Session.get('projectId')

  var people = People.find({
    projectId: projectId,
    department: {
      $regex: dep
    }
  }).fetch()

  people.forEach( function(p) {
    console.log("'" + p.principalName + "','" + p.department + "','" + p.emails.join(" ") + "'")
  })
  console.log("returned: " + people.len() + " results")
}
function getPersonEmail () {
  // Generate a list of defined people by Principal, Department, Email
  //
  // Created by: Matt Burch
  // Usage: getPersonEmail()
  //

  var projectId = Session.get('projectId')

  var people = People.find({
    projectId: projectId
  }).fetch()

  people.forEach( function(p) {
    console.log("'" + p.principalName + "','" + p.department + "','" + p.emails.join(" ") + "'")
  })
  console.log("returned: " + people.length + " results")
}
/* eslint-disable no-unused-vars */
/* globals Session Hosts Meteor Services */

function greyHostsNoServicesGreen () {
  // Loops through each host from the selected project
  // and changes the status of any gray hosts with no open services
  // to green
  //
  // Usage: greyHostsNoServicesGreen()
  // Created by: Dan Kottmann
  // Requires client-side updates: true

  var projectId = Session.get('projectId')
  var modifiedBy = Meteor.user().emails[0].address
  var hosts = Hosts.find({
    'projectId': projectId,
    'status': 'lair-grey'
  }).fetch()
  if (typeof hosts === 'undefined' || hosts.length === 0) {
    console.log('No hosts found')
    return
  }
  var c = 0
  hosts.forEach(function (host) {
    var serviceCount = Services.find({
      'hostId': host._id,
      'port': {
        $gt: 0
      }
    }).count()
    if (serviceCount === 0) {
      c++
      console.log('Updating: ' + host.ipv4)
      Hosts.update({
        '_id': host._id
      }, {
        $set: {
          'status': 'lair-green',
          'last_modified_by': modifiedBy
        }
      })
    }
  })
  console.log(c + ' host(s) updated')
}
/* eslint-disable no-unused-vars */
/* globals Session Hosts Meteor */

function hostnamesToNessus () {
  // Generate a list of hostname[ipv4] targets suitable for input into Nessus.
  //
  // Created by: Tom Steele
  // Usage: hostnamesToNessus()
  // Requires client-side updates: false

  var hosts = Hosts.find({
    projectId: Session.get('projectId')
  }).fetch()
  var vhostTargets = []
  hosts.forEach(function (host) {
    var ip = host.ipv4
    host.hostnames.forEach(function (name) {
      var item = name + '[' + ip + ']'
      vhostTargets.push(item)
    })
  })
  vhostTargets.forEach(function (item) {
    console.log(item)
  })
}
/* eslint-disable no-unused-vars */
/* globals Session Services Meteor Models */

function iisOsProfiler() {
  // Loops over every service who's product matches IIS X.X and performs a
  // best guess at the operating system, inserting the guess into the
  // service's host's os array.
  //
  // Usage: iisOsProfiler()
  // Created by: Tom Steele
  // Requires client-side updates: false

  var projectId = Session.get('projectId')
  var weight = 90
  var tool = 'IIS OS Profiler'
  var services = Services.find({
    'projectId': projectId,
    'product': {
      '$regex': /IIS\s(httpd\s)?\d+\.\d+/,
      '$options': 'i'
    }
  }).fetch()
  services.forEach(function (service) {
    var product = service.product
    var res = product.match(/\d+\.\d+/)
    if (res === null) {
      return
    }
    var version = parseFloat(res[0])
    if (isNaN(version)) {
      return
    }
    var os = Models.os()
    os.tool = tool
    os.weight = weight
    if (version < 6) {
      os.fingerprint = 'Microsoft Windows Server 2000'
    } else if (version < 7) {
      os.fingerprint = 'Microsoft Windows Server 2003'
    } else if (version < 8) {
      os.fingerprint = 'Microsoft Windows Server 2008'
    } else if (version < 9) {
      os.fingerprint = 'Microsoft Windows Server 2012'
    } else if (version < 11) {
      os.fingerprint = 'Microsoft Windows Server 2016'
    }
    if (os.fingerprint !== '') {
      Meteor.call('setOs', projectId, service.hostId, os.tool, os.fingerprint, os.weight, function (err) {
        if (err) {
          console.log('Error generating OS for', service.hostId, err)
        } else {
          console.log('Created new OS', os.fingerprint, 'for', service.hostId)
        }
      })
    }
  })
}
/* eslint-disable no-unused-vars */
/* globals Session Hosts Meteor Issues*/

function listHostsByIssueTitle (title) {
  // Retrieves all host, port, protocol instances afflicted by a certain Issue
  //
  // Created by: Dan Kottmann & updated by Alex Lauerman
  // Usage: listHostsByIssueTitle('Microsoft Windows SMB NULL Session Authentication')
  // Requires client-side updates: false

  var projectId = Session.get('projectId')
  var issue = Issues.findOne({
    'projectId': projectId,
    'title': title
  })
  var msfHostsOutput = ''
  if (!issue) {
    console.log('Issue not found')
    return
  }

  var hosts = issue.hosts
  hosts.forEach(function (host) {
    console.log(host.ipv4 + ':' + host.port + '/' + host.protocol)
    msfHostsOutput += host.ipv4 + ', '
  })
  console.log('RHOSTS: ' + msfHostsOutput.slice(0, -2))
}
/* eslint-disable no-unused-vars */
/* globals Session Hosts Meteor Issues */

function listHostsByIssueTitleRegex (issueRegex) {
  // Retrieves all host, service, protocol instances afflicted by a certain Issue
  //
  // Created by: Isaiah Sarju
  // Based on listHostsByIssueTitle Dan Kottmann & updated by Alex Lauerman
  // Usage: listHostsByIssueTitleRegex(/^SSL.*/)
  // Requires client-side updates: false

  var projectId = Session.get('projectId')
  var issues = Issues.find({
    'projectId': projectId,
    'title': {
      '$regex': issueRegex
    }
  }).fetch()
  var msfHostsOutput = ''
  if (issues.length < 1) {
    console.log('No issues found')
    return
  }
  issues.forEach(function (issue) {
    console.log(issue.title)
    var hosts = issue.hosts
    hosts.forEach(function (host) {
      console.log(host.ipv4 + ':' + host.port + '/' + host.protocol)
      msfHostsOutput += host.ipv4 + ', '
    })
    console.log('RHOSTS: ' + msfHostsOutput.slice(0, -2))
    msfHostsOutput = ''
  })
}
function listHostByTag (tag) {
  // Retrieves all host by a tag
  //
  // Created by: James Cook
  // Usage: list_host_ip_by_tag.js
  // Requires client-side updates: false
  var hosts = Hosts.find({
          projectId: Session.get('projectId'),
          tags: tag
  }).fetch()

  hosts.forEach(function (host) {
          console.log(host.ipv4)
  })
}
/* eslint-disable no-unused-vars */
/* globals Session Services Hosts Meteor StatusMap */

function listHostServicesBycolor (color) {
  // Logs a list of all services by color per host
  //
  // Created by: Matt Burch
  // Usage: countHostServicesBycolor('lair-grey')
  // Supserviceed colors: console.log(StatusMap)
  //
  var projectId = Session.get('projectId')

  if (StatusMap.indexOf(color) === -1) {
    console.log('Lair Supserviceed colors: ' + StatusMap)
    throw {
      name: 'Wrong color',
      message: 'Provided color: "' + color + '" is not Lair compliant'
    }
  }

  var services = Services.find({
    'projectId': projectId,
    'status': color
  }).fetch()
  services.forEach(function (service) {
    var host = Hosts.findOne({
      'projectId': projectId,
      '_id': service.hostId
    })
    console.log(host.ipv4 + ':' + service.port + '/' + service.protocol)
  })
}
/* eslint-disable no-unused-vars */
/* globals Session Hosts Services Meteor */

function listHostServicesByServiceRegex (serviceRegex) {
  // Logs a list of all services by service regex per host
  //
  // Created by Isaiah Sarju
  // Based on listHostServicesByColor by Matt Burch & changeServicesToSpecifiedColor by Dan Kottmann
  // Usage: listHostServicesByServiceRegex(/.*sql.*/)

  var REGEX = serviceRegex
  var projectId = Session.get('projectId')
  var serviceServices = Services.find({
    'projectId': projectId,
    'service': {
      '$regex': REGEX
    }
  }).fetch()

  if (serviceServices.length < 1) {
    console.log('No services found')
    return
  }

  serviceServices.forEach(function (service) {
    var host = Hosts.findOne({
      'projectId': projectId,
      '_id': service.hostId
    })
    console.log(host.ipv4 + ':' + service.port + '/' + service.protocol)
  })
}
/* eslint-disable no-unused-vars */
/* globals Session Hosts Services Meteor */

function listUnknownOpenServices (scope, outputFormat) {
  // Prints a list of all 'unknown' open services for each host
  // to prepare for additional efforts to identify services
  //
  // Usage: listUnknownOpenServices(searchScope, outputFormat)
  // Example: listUnknownOpenServices('both', 'nmap')
  //    searchScope:
  //      product (search the 'product' field)
  //      service (search the 'service' field)
  //      both
  //    outputFormat:
  //      list (list of hosts followed by list of all unknown services)
  //      nmap (individual host nmap cmdline with per-host services)
  //      hostAndPort (list host:service combinations. WARNING: A long list will likely be output.
  //                   Recommend doing select all + copy or saving log to file. See http://goo.gl/C6tmgw)
  //
  // Created by: Alain Iamburg

  var projectId = Session.get('projectId')
  var hostlist = []
  var tcpservices = []
  var udpservices = []

  // FOR each service of each host
  var hosts = Hosts.find({
    'projectId': projectId
  }).fetch()
  hosts.forEach(function (host) {
    var services = Services.find({
      'projectId': projectId,
      'hostId': host._id
    }).fetch()
    services.forEach(function (service) {
      if (service.port > 0) {
        if (scope === 'product') {
          if (service.product.toLowerCase() === 'unknown') {
            hostlist.push(host.ipv4)
            if (service.protocol === 'tcp') {
              tcpservices.push(service.port)
            } else if (service.protocol === 'udp') {
              udpservices.push(service.port)
            }
          }
        } else if (scope === 'service') {
          if (service.service.toLowerCase() === 'unknown') {
            hostlist.push(host.ipv4)
            if (service.protocol === 'tcp') {
              tcpservices.push(service.port)
            } else if (service.protocol === 'udp') {
              udpservices.push(service.port)
            }
          }
        } else if (scope === 'both') {
          if (service.service.toLowerCase() === 'unknown' || service.product.toLowerCase() === 'unknown') {
            hostlist.push(host.ipv4)
            if (service.protocol === 'tcp') {
              tcpservices.push(service.port)
            } else if (service.protocol === 'udp') {
              udpservices.push(service.port)
            }
          }
        }
      }
    })

    // Output nmap command line format for each host and its unknown open services
    if (outputFormat === 'nmap') {
      if (tcpservices.length > 0 && udpservices.length > 0) {
        console.log('nmap -v -sV --version-all -sS -sU ' + host.ipv4 + ' -p T:' + tcpservices.toString() + ',U:' + udpservices.toString())
      } else if (tcpservices.length > 0) {
        console.log('nmap -v -sV --version-all -sS ' + host.ipv4 + ' -p ' + tcpservices.toString())
      } else if (udpservices.length > 0) {
        console.log('nmap -v -sV --version-all -sU ' + host.ipv4 + ' -p ' + udpservices.toString())
      }
      tcpservices = []
      udpservices = []
    }

    // Output host:service
    if (outputFormat === 'hostAndPort') {
      if (tcpservices.length > 0) {
        tcpservices.forEach(function (tcpservice) {
          console.log(host.ipv4 + ':' + tcpservice.toString())
        })
      }
      if (udpservices.length > 0) {
        udpservices.forEach(function (udpservice) {
          console.log(host.ipv4 + ':' + udpservice.toString())
        })
      }
    }

  })

  if ((tcpservices.length > 0 || udpservices.length > 0) && outputFormat === 'list') {
    var tcpservicesUniq = tcpservices.filter(function (elem, pos) {
      return tcpservices.indexOf(elem) === pos
    })
    var udpservicesUniq = udpservices.filter(function (elem, pos) {
      return udpservices.indexOf(elem) === pos
    })

    // Output a list of all hosts and unknown open TCP/UDP services
    console.log('Hosts:')
    console.log(hostlist.toString())
    console.log('TCP Services:')
    console.log(tcpservicesUniq.sort(function (a, b) {
      return a - b
    }).toString())
    console.log('UDP Services:')
    console.log(udpservicesUniq.sort(function (a, b) {
      return a - b
    }).toString())
  }
}/* eslint-disable no-unused-vars */
/* globals Session Hosts Issues Meteor */

function getHostList(Issue){
  var hosts = '';
  for(var i=0;i<Issue.hosts.length;i++){
      hosts += Issue.hosts[i].ipv4 + ',';
    }
    return hosts + '\n';
}


function mergeIssuesByTitle (issueRegex, newTitle, cvss) {
  // Merges all issues identified by a regular expression into a new or existing Issue
  // provided by newTitle.
  //
  // Usage: mergeIssuesByTitle(/^VMSA.*/, 'Multiple VMWare Vulneraiblities', 10.0)
  // Created by: Tom Steele
  // Requires client-side updates: false
  //
  // I highly recommend you perform a dry run yourself and see what issues the regex is going
  // to match, something like the following should do.
  //
  /*

   var testVulnSearch = function(testRegex) {
    // Test your regex search criteria prior
    // to using it for vuln merging in Lair.

    // Created by: Ryan Dorey
    // Usage: testVulnSearch(/^.*SSH/)
    // Requires client-side updates: false

     var projectId = Session.get('projectId')

     var issues = Issues.find({'projectId': projectId, 'title': {'$regex': testRegex}}).fetch()
     issues.forEach(function(Issue) {
       console.log('Title: ' + Issue.title + ' - CVSS: ' + Issue.cvss)
     })
     console.log('Total found: ' + issues.length)
   }

   */

  // Do some light variable checking, you're still pretty much on your own
  if (typeof issueRegex !== 'object') {
    return console.log('Issue regex can not be a string, must be a object')
  }
  if (typeof newTitle !== 'string') {
    return console.log('Invalid title')
  }
  if (typeof cvss !== 'number') {
    return console.log('Invalid cvss. Variable must be a number')
  }

  var projectId = Session.get('projectId')
  var issues = Issues.find({
    'projectId': projectId,
    'title': {
      '$regex': issueRegex
    }
  }).fetch()
  if (issues.length < 1) {
    return console.log('Did not find any issues with the given regex')
  }
  // If the Issue given in newTitle already exists, then we push it onto the regex list so we can combine them
  // Remove the existing Issue first
  var existingVenerability = Issues.findOne({
    'projectId': projectId,
    'title': newTitle
  })
  if (typeof existingVenerability !== 'undefined') {
    issues.push(existingVenerability)
    Meteor.call('removeIssue', projectId, existingVenerability._id)
  }
  console.log('Going to merge ' + issues.length + ' issues')

  var newDescription = ''
  var newSolution = ''
  var newEvidence = ''
  var newNotes = []
  var cves = []
  var hostList = []
  // Loop over each Issue and combine the data
  issues.forEach(function (Issue) {
    issue_hosts = getHostList(Issue);
    newDescription += '\n\n' + 'From ' + Issue.title + '\n' + 'Affected Hosts: ' + issue_hosts + Issue.description;
    newSolution += '\n\n' + 'From ' + Issue.title + '\n' + 'Affected Hosts: ' + issue_hosts + Issue.solution;
    newEvidence += '\n\n' + 'From ' + Issue.title + '\n' + 'Affected Hosts: ' + issue_hosts + Issue.evidence;
    newNotes = newNotes.concat(Issue.notes)
    cves = cves.concat(Issue.cves)
    hostList = hostList.concat(Issue.hosts)
  })
  var newHostList = unique(hostList)
  var newCVEs = unique(cves)

  // Create the new Issue
  Meteor.call('createIssue', projectId, newTitle, cvss, newDescription, newEvidence, newSolution, function (err, res) {
    if (err) {
      console.log('Error: could not create new Issue', err.message)
      if (existingVenerability) {
        console.log('Looks like you lost', existingVenerability.title)
      }
    } else {
      addExistingContentToVenerability(res)
    }
  })

  return console.log('Complete')

  // Adds notes, hosts, and cves to new vulnerablity
  function addExistingContentToVenerability (IssueId) {
    newNotes.forEach(function (note) {
      Meteor.call('addIssueNote', projectId, IssueId, note.title, note.content)
    })
    newHostList.forEach(function (host) {
      Meteor.call('addHostToIssue', projectId, IssueId, host.ipv4, host.port, host.protocol)
    })
    newCVEs.forEach(function (cve) {
      Meteor.call('addCVE', projectId, IssueId, cve)
    })
    removeIssues()
  }

  // Loop over all issues and remove them
  function removeIssues () {
    issues.forEach(function (Issue) {
      Meteor.call('removeIssue', projectId, Issue._id)
    })
  }

  // I found this off the internet
  function unique (arr) {
    var hash = {}
    var result = []
    for (var i = 0, l = arr.length; i < l; ++i) {
      var objString = JSON.stringify(arr[i])
      if (!hash.hasOwnProperty(objString)) {
        hash[objString] = true
        result.push(arr[i])
      }
    }
    return result
  }
}
/* eslint-disable no-unused-vars */
/* globals Session Hosts Issues Meteor */

function mergeIssues (titleRegex, minCVSS, maxCVSS, hostsRegex, newTitle, newCVSS, update) {
  // Merges all issues identified by the regular expressions into a new or existing Issue
  // provided by newTitle.
  //
  // Usage:
  // mergeIssues(/Apache/i, 7, 10, /.*/, 'Apache 2.x servers are vulnerable to multiple high risk issues', 'max', false)
  // mergeIssues(/Apache/i, 7, 10, /.*/, 'Apache 2.x servers are vulnerable to multiple high risk issues', 'max', true)
  //
  // titleRegex - regex to search titles
  // minCVSS - minimum CVSS score to include
  // maxCVSS - maximum CVSS score to include
  // hostsRegex - host IPs to include in filter
  // newTitle - title of the new Issue
  // newCVSS - new CVSS score, or choose 'max' to pick the highest CVSS score of that group
  // update - The update parameter determines whether it's a 'dry run' with output, or an actual merge. update = true will delete old entries
  //
  // Created by: Alex Lauerman and Tom Steele
  // Requires client-side updates: false

  // Do some light variable checking, you're still pretty much on your own
  if (typeof titleRegex !== 'object') {
    return console.log('Issue regex can not be a string, must be a object')
  }
  if (typeof newTitle !== 'string') {
    return console.log('Invalid title')
  }
  if (typeof newCVSS !== 'string') {
    return console.log('Invalid cvss. Variable must be a string')
  }

  var projectId = Session.get('projectId')
  var issues = Issues.find({
    'projectId': projectId,
    'title': {
      '$regex': titleRegex
    },
    'cvss': {
      '$gte': minCVSS,
      '$lte': maxCVSS
    },
    'hosts.ipv4': {
      '$regex': hostsRegex
    }
  }).fetch()
  if (issues.length < 1) {
    return console.log('Did not find any issues with the given regex')
  }

  var highestCVSS = 0

  // You can change the sort order here
  // issues.sort(sortByHostCount)
  // issues.sort(sortByTitle)
  issues.sort(sortByCVSS)
  issues.forEach(function (Issue) {
    console.log('CVSS: ' + Issue.cvss + ' - Hosts: ' + Issue.hosts.length + ' - Title: ' + Issue.title)
    if (Issue.cvss > highestCVSS) {
      highestCVSS = Issue.cvss
    }
  })

  console.log('Total found: ' + issues.length + ' Highest CVSS: ' + highestCVSS)

  if (update) {
    if (newCVSS === 'max') {
      newCVSS = highestCVSS
    }

    // If the Issue given in newTitle already exists, then we push it onto the regex list so we can combine them
    // Remove the existing Issue first
    var existingIssue = Issues.findOne({
      'projectId': projectId,
      'title': newTitle
    })
    if (typeof existingIssue !== 'undefined') {
      issues.push(existingIssue)
      Meteor.call('removeIssue', projectId, existingIssue._id)
    }
    console.log('Going to merge ' + issues.length + ' issues')

    var newDescription = ''
    var newSolution = ''
    var newEvidence = ''
    var newNotes = []
    var newReferences = []
    var cves = []
    var hostList = []
    var newFiles = []
    // Loop over each Issue and combine the data
    issues.forEach(function (Issue) {
      newDescription = newDescription + 'CVSS: ' + Issue.cvss + ' - Hosts: ' + Issue.hosts.length + ' - Title: ' + Issue.title + "\n"
      newSolution = ''
      newEvidence = ''
      newReferences = newReferences.concat(Issue.references)
      newNotes = newNotes.concat(Issue.notes)
      cves = cves.concat(Issue.cves)
      hostList = hostList.concat(Issue.hosts)
      newFiles = newFiles.concat(Issue.files)
    })
    var newHostList = unique(hostList)
    var newCVEs = unique(cves)
    // Create the new Issue
    Meteor.call('createIssue', projectId, newTitle, newCVSS, newDescription, newEvidence, newSolution, function (err, res) {
      if (err) {
        console.log('Error: could not create new Issue', err.message)
        if (existingIssue) {
          console.log('Looks like you lost', existingIssue.title)
        }
      } else {
        addExistingContentToIssue(res)
      }
    })

    return console.log('Complete')
  }

  function sortByHostCount (a, b) {
    if (a.hosts.length > b.hosts.length) {
      return -1
    }
    if (a.hosts.length < b.hosts.length) {
      return 1
    }
    return 0
  }

  function sortByTitle (a, b) {
    if (a.hosts.title > b.hosts.title) {
      return -1
    }
    if (a.hosts.title < b.hosts.title) {
      return 1
    }
    return 0
  }

  function sortByCVSS (a, b) {
    if (a.cvss > b.cvss) {
      return -1
    }
    if (a.cvss < b.cvss) {
      return 1
    }
    return 0
  }

  // Adds notes, hosts, and cves to new vulnerablity
  function addExistingContentToIssue (issueId) {
    newNotes.forEach(function (note) {
      Meteor.call('addIssueNote', projectId, issueId, note.title, note.content)
    })
    newHostList.forEach(function (host) {
      Meteor.call('addHostToIssue', projectId, issueId, host.ipv4, host.port, host.protocol)
    })
    newCVEs.forEach(function (cve) {
      Meteor.call('addCVE', projectId, issueId, cve)
    })
    newReferences.forEach(function (ref) {
      Meteor.call('addReference', projectId, issueId, ref.link, ref.name)
    })
    removeIssues()
  }

  // Loop over all issues and remove them
  function removeIssues () {
    console.log('Removing Issues')
    issues.forEach(function (Issue) {
      Meteor.call('removeIssue', projectId, Issue._id)
    })
  }

  function unique (arr) {
    var hash = {}
    var result = []
    for (var i = 0, l = arr.length; i < l; ++i) {
      var objString = JSON.stringify(arr[i])
      if (!hash.hasOwnProperty(objString)) {
        hash[objString] = true
        result.push(arr[i])
      }
    }
    return result
  }
}
/* eslint-disable no-unused-vars */
/* globals Session Hosts Meteor */

function negateHostsByCIDR () {
  // Generate a list of hostname[ipv4] targets which do not exist in CIDR range
  //
  // Created by: Matt Burch
  // Usage: negateHostsByCIDR('x.x.x.x/x') or negateHostsByCIDR('x.x.x.x/x','y.y.y.y/y')
  //
  var nets = Array.prototype.slice.call(arguments, 0)
  var hosts = Hosts.find({
    projectId: Session.get('projectId')
  }).fetch()
  var hostip = {}

  function dec2Bin (octet, cidr) {
    var pad = '00000000'
    var bin = parseInt(octet[0], 10).toString(2)
    var bincidr = (bin.length >= pad.length ? bin : pad.slice(0, pad.length - bin.length) + bin)

    for (var i = 1; i <= octet.length; i++) {
      bin = parseInt(octet[i], 10).toString(2)
      bincidr += (bin.length >= pad.length ? bin : pad.slice(0, pad.length - bin.length) + bin)
    }

    return bincidr.slice(0, parseInt(cidr, 10))
  }

  hosts.forEach(function (host) {
    var ip = host.ipv4.split('.')
    hostip[dec2Bin(ip, 32)] = host.ipv4
  })

  nets.forEach(function (cidr) {
    cidr = cidr.split('/')
    var net = cidr[0].split('.')
    var netbin = dec2Bin(net, cidr[1])

    for (var key in hostip) {
      if ((key.slice(0, parseInt(cidr[1], 10))) === netbin) {
        delete hostip[key]
      }
    }
  })

  for (var key in hostip) {
    console.log(hostip[key])
  }
}
/* eslint-disable no-unused-vars */
/* globals Session Hosts Meteor Services */

function niktoHostList (services, domain) {
  // Creates a list of hosts and/or hostnames for automated Nikto scan
  //
  // Created by: Matt Burch
  // Usage: niktoHostList([/http/,80,'8000-8015'])
  // Optional Usage: niktoHostList([/http/,80,'8000-8015'],/domain\.com/)
  //
  if (domain && typeof domain !== 'object') {
    return console.log('Domain regex can not be a string, must be an object')
  }
  var HostTargets = {}
  var projectId = Session.get('projectId')

  function getHosts (lpid, port) {
    var host = Hosts.findOne({
      'projectId': projectId,
      '_id': lpid
    })

    if (!(host.ipv4 + ':' + port in HostTargets)) {
      HostTargets[host.ipv4 + ':' + port] = true
    }
    if (domain) {
      host.hostnames.forEach(function (hostname) {
        if (domain.test(hostname) && !(hostname + ':' + port in HostTargets)) {
          HostTargets[hostname + ':' + port] = true
        }
      })
    }
  }

  services.forEach(function (service) {
    var foundServices = []
    if (typeof service === 'object') {
      foundServices = Services.find({
        'projectId': projectId,
        'service': {
          '$regex': service
        }
      }).fetch()
      foundServices.forEach(function (s) {
        getHosts(s.hostId, s.port)
      })
    } else if (typeof service === 'string') {
      var list = service.split('-')
      for (var i = parseInt(list[0], 10); i <= parseInt(list[1], 10); i++) {
        foundServices = Services.find({
          'projectId': projectId,
          'service': i
        }).fetch()
        foundServices.forEach(function (s) {
          getHosts(s.hostId, s.port)
        })
      }
    } else {
      var s = Services.findOne({
        'projectId': projectId,
        'service': service
      })
      getHosts(s.hostId, service.port)
    }
  })

  for (var key in HostTargets) {
    console.log(key)
  }
}
/* eslint-disable no-unused-vars */
/* globals Session Services Hosts Meteor */

function niktoTopFindings (custom, filter) {
  // Lists Nikto Top Findings results per host/vhost
  //
  // Created by: Matt Burch
  // Usage: niktoTopFindings([], true)
  // Usage: niktoTopFindings(['(.*might be interesting.*)'], true)
  // Usage: niktoTopFindings([], false)

  var nikto = new RegExp('Nikto')
  var findings = {}
  var projectId = Session.get('projectId')
  var topFindings = [
    '(.*might be interesting.*)',
    '(.*Public HTTP Methods:.*PUT.*)',
    '(.*[Ww]eb[Dd]av.*)',
    '(.*Directory indexing found.*)',
    '(.*default file found.*)',
    '(.*Server leaks.*IP.*)',
    '(.*OSVDBID:.*)'
  ]
  if (custom.length > 0) {
    topFindings = custom
  }

  var services = Services.find({
    'projectId': projectId
  }).fetch()
  services.forEach(function (service) {
    var host = Hosts.findOne({
      'projectId': projectId,
      '_id': service.hostId
    })
    service.notes.forEach(function (note) {
      if (nikto.test(note.title)) {
        var title = note.title.match(/\(.*\)/)

        if (filter) {
          var search = new RegExp(topFindings.join('|') + '\\n', 'g')
          var f = note.content.match(search)
          if (f) {
            if (!(findings[host.ipv4 + ' ' + title])) {
              findings[host.ipv4 + ' ' + title] = []
            }
            findings[host.ipv4 + ' ' + title].push(f.join(''))
          }
        } else {
          console.log(host.ipv4 + ' ' + title)
          console.log(note.content)
        }


      }
    })
  })
  if (filter) {
    for (var key in findings) {
      console.log(key)
      console.log(findings[key].join(''))
    }
  }
}
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
  }/* globals Session Meteor Hosts Services Issues StatusMap */
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
}
/* globals Session Meteor Hosts Services Issues StatusMap */
/* eslint-disable no-unused-vars */
function removePort0ServicesNoReference () {
// Changes host color based on services|issues of the host
  //
  // This is to remove the port 0 services added by Nessus. It will check all issues and notes to avoid removing any port 0 services referenced by
  // an issue or note, but otherwise will delete all port 0 services.
  //
  // Created by XanderK
  //
  // Usage
  // removePort0ServicesNoReference()
  
  var projectId = Session.get('projectId')
  var servicearray = []
  var excludedarray = []
  var delarray = []

  var hosts = Hosts.find({
    'projectId': projectId
  }).fetch()

  hosts.forEach(function (host) {
    var hostid = host._id
    var services = Services.find({
      'projectId': projectId,
      'hostId': host._id
    }).fetch()
    services.forEach(function (service) {
      // check if service is 0 and that notes are empty - add to service array
      if (service.port <= 0 && service.notes < 1) {
	  	  var dict = { ip: host.ipv4, service: service }
        servicearray.push(dict)
      }
    })
  })
  var issues = Issues.find({
    'projectId': projectId
  }).fetch()
  
  issues.forEach(function (issue) {
    issue.hosts.forEach( function (host) {
  	  if (host.port != 0) {
	      return
	    }
	    for (var x = 0; x < servicearray.length; x++) {
		    if (servicearray[x].ip == host.ipv4 && host.protocol == servicearray[x].service.protocol) {
		      excludedarray.push(servicearray[x].service._id)
		    }
      }
	  })
  })

  for (var x = 0; x < servicearray.length; x++) {
    for (var y = 0; y < excludedarray.length; y++) {
	    if (servicearray[x].service._id == excludedarray[y]){
	      continue;
	    }
    }
	  delarray.push(servicearray[x].service)
  }
  
  console.log("Removing " + delarray.length + " out of " + servicearray.length + " port 0 services")
  for (var x = 0; x < delarray.length; x++) {
    console.log('Removing ServiceID: ' + delarray[x]._id)
    Meteor.call('removeService', projectId, delarray[x].hostId, delarray[x]._id, function (err) {})
  }
}
function searchServiceNoteContent (noteRegex, searchString) {
  // Search the contents of service notes for specific regex content, matching a note regex title
  //
  // Examples:
  //   searchServiceNoteContent('Weak Cipher', '\\D\\D\\D-\\D.*')
  //
  // Usage: searchServiceNoteContent(title, search)
  // Created by: Matt Burch
  // Requires client-side updates: false

  var projectId = Session.get('projectId')
  var re = new RegExp(noteRegex, 'i')
  var search = new RegExp(searchString, 'g')
  var ciphers = []
  var services = Services.find({
    'projectId': projectId,
    'notes': {
      $elemMatch: {
        'title': {
          $regex: noteRegex,
          $options: 'i'
        }
      }
    }
  }, {
    notes: 1,
    hostId: 1
  }).fetch()

  function unique(arr) {
    var u = {}, a = [];
    for(var i = 0, l = arr.length; i < l; ++i){
        if(!u.hasOwnProperty(arr[i])) {
            a.push(arr[i]);
            u[arr[i]] = 1;
        }
    }
    return a;
  }
  services.forEach(function (service) {
    service.notes.forEach(function (note) {
      if (re.test(note.title)) {
        ciphers.push.apply(ciphers, note.content.match(search))
      }
    })
  })
  console.log(unique(ciphers).join("\n"))
}
/* eslint-disable no-unused-vars */
/* globals Session Services StatusMap Hosts Meteor */

function servicesToColorByHosts (hosts, port, color) {
  // Changes the status of provided service to provided color by Array of hosts
  // for lair-blue, lair-orange, lair-red; Host status is updated to color also
  //
  // Created by: Matt Burch
  // Usage: servicesToColorByHosts(['192.168.1.1','192.168.1.2'],80,'lair-blue')
  // Supserviceed Colors: console.log(StatusMap)
  //
  // Requires client-side updates: true

  var projectId = Session.get('projectId')
  var modifiedBy = Meteor.user().emails[0].address
  var count = 0
  var status = {
    'lair-red': 4,
    'lair-orange': 3,
    'lair-blue': 2,
    'lair-green': 0,
    'lair-grey': 0
  }

  if (StatusMap.indexOf(color) === -1) {
    console.log('Lair Supserviceed colors: ' + StatusMap)
    throw {
      name: 'Wrong Color',
      message: 'Provided color: "' + color + '" is not Lair compliant'
    }
  }
  hosts.forEach(function (target) {
    var host = Hosts.findOne({
      projectId: projectId,
      'ipv4': target
    })
    var hostServices = Services.find({
      'hostId': host._id,
      'port': port
    }).fetch()
    if (hostServices.length < 1) {
      return
    }

    hostServices.forEach(function (service) {
      console.log('Updating: ' + target + ':' + service.port + '/' + service.protocol)
      Meteor.call('setPortStatus', projectId, service._id, color)
      if (status[color] > status[host.status]) {
        console.log('Updating: ' + target + ' status "' + color + '"')
        Meteor.call('setHostStatus', projectId, host._id, color)
      }
      count++
    })
  })
  console.log(count + ' service(s) updated')
}
function setGlobalServiceByPort(port, protocol, service) {
  // Set the service name for the specified service.
  //
  // Usage: setGlobalServiceByPort(443, 'tcp', 'https')
  // Created by: Jason Doyle
  // Requires client-side updates: false

  var projectId = Session.get('projectId')
  var services = Services.find({
    'projectId': projectId,
    'port': port,
    'protocol': protocol,
    'service': {
      '$ne': service
    }
  })
  services.forEach(function (s) {
    Meteor.call('setServiceService', projectId, s._id, service, function (err) {
      if (!err) {
        console.log('Modified service successfully')
      }
    })
  })
}
/* globals Session Hosts sortWeight Meteor*/
/* eslint-disable no-unused-vars */
function setHostOsByOsRegex (osRegex, newOs, weight) {
  // Loops through each host from the selected project
  // and sets the Operating System value if the host's
  // Os matches the provided regex. Assigns the provided weight as well.
  //
  // Usage: setHostOsByOsRegex(/.*Linux.*/, 'Linux', 100)
  // Created by: Dan Kottmann
  // Requires client-side updates: false

  var projectId = Session.get('projectId')

  var query = {
    'projectId': projectId,
    'os.fingerprint': {
      $regex: osRegex
    }
  }
  var hosts = Hosts.find(query).fetch()

  if (hosts.length < 1) {
    console.log('No hosts found')
    return
  }

  hosts.forEach(function (host) {
    Meteor.call('setOs', projectId, host._id, 'Manual', newOs, weight, function (err) {
      if (err) {
        console.log('Unable to update host ' + host.ipv4)
        return
      }
      console.log('Updated host ' + host.ipv4)
    })
  })
}
function setHostServiceByPort(host, port, protocol, service) {
  // Set the service name for a list of services per host.
  //
  // Usage: setHostServiceByPort('10.10.4.3', [7734,8824,10360], 'tcp', 'unknown')
  // Created by: Matt Burch
  // Requires client-side updates: false

  var projectId = Session.get('projectId')
  var host = Hosts.findOne({
    'projectId': projectId,
    'ipv4': host,
  })
  var services = Services.find({
    'projectId': projectId,
    'hostId': host._id,
    'port': {
      '$in': port
    },
    'protocol': protocol,
    'service': {
      '$ne': service
    }
  })
  services.forEach(function (s) {
    Meteor.call('setServiceService', projectId, s._id, service, function (err) {
      if (!err) {
        console.log('Modified service successfully')
      }
    })
  })
}

function tagHostsByCIDR (tag, net) {
  // Add a tag to hosts in a given cidr.
  //
  // Created by: James Cook
  // borrowed a lot from: https://github.com/lair-framework/browser-scripts/blob/master/get_hosts_by_cidr.js
  // Usage: tagHostsByCIDR('tagname', 'x.x.x.x/x')
  //
  var hostTargets = []
  var hosts = Hosts.find({
    projectId: Session.get('projectId')
  }).fetch()
  var hostip = {}


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

  function dec2Bin (octet, cidr) {
    var pad = '00000000'
    var bin = parseInt(octet[0], 10).toString(2)
    var bincidr = (bin.length >= pad.length ? bin : pad.slice(0, pad.length - bin.length) + bin)

    for (var i = 1; i <= octet.length; i++) {
      bin = parseInt(octet[i], 10).toString(2)
      bincidr += (bin.length >= pad.length ? bin : pad.slice(0, pad.length - bin.length) + bin)
    }

    return bincidr.slice(0, parseInt(cidr, 10))
  }

  hosts.forEach(function (host) {
    var ip = host.ipv4.split('.')
    hostip[dec2Bin(ip, 32)] = host
  })

  cidr = net.split('/')
  var net = cidr[0].split('.')
  var netbin = dec2Bin(net, cidr[1])

  for (var key in hostip) {
    if ((key.slice(0, parseInt(cidr[1], 10))) === netbin) {
      addHostTag(hostip[key]._id, tag)
      console.log(hostip[key]._id, tag)
    }
  }
}
function uniqueServicesByHostsCIDR () {
  // Print a unique service list for hosts CIDR range
  //
  // Created by: Matt Burch
  // Usage: uniqueServicesByHostsCIDR('x.x.x.x/x') or uniqueServicesByHostsCIDR('x.x.x.x/x','y.y.y.y/y')
  //

  var hostTargets = []
  var projectId = Session.get('projectId')
  var nets = Array.prototype.slice.call(arguments, 0)
  var hosts = Hosts.find({
    projectId: projectId
  }).fetch()
  var hostip = {}
  var hostid = {}
  var ids = []

  function dec2Bin (octet, cidr) {
    var pad = '00000000'
    var bin = parseInt(octet[0], 10).toString(2)
    var bincidr = (bin.length >= pad.length ? bin : pad.slice(0, pad.length - bin.length) + bin)

    for (var i = 1; i <= octet.length; i++) {
      bin = parseInt(octet[i], 10).toString(2)
      bincidr += (bin.length >= pad.length ? bin : pad.slice(0, pad.length - bin.length) + bin)
    }

    return bincidr.slice(0, parseInt(cidr, 10))
  }

  hosts.forEach(function (host) {
    var ip = host.ipv4.split('.')
    hostip[dec2Bin(ip, 32)] = host.ipv4
    hostid[host.ipv4] = host._id
  })

  nets.forEach(function (cidr) {
    cidr = cidr.split('/')
    var net = cidr[0].split('.')
    var netbin = dec2Bin(net, cidr[1])

    for (var key in hostip) {
      if ((key.slice(0, parseInt(cidr[1], 10))) === netbin) {
        ids.push(hostid[hostip[key]])
      }
    }
  })

  var services = Services.find({projectId: projectId, hostId: {$in: ids}}).fetch()
  return _.uniq(_.pluck(services, 'port')).sort(function (a, b) {
    return a - b
  }).join(',')
}
