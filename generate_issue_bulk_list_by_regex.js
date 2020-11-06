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
  }  