/* eslint-disable no-unused-vars */
/* globals Meteor Session Services */
function bulkImportHosts(hostsToAdd) {
	// Adds hosts to the Lair project that are contained in the provided array of IP addresses. The provided array 
    // can optionally include service information to automatically import the service as well. 
    //
    // Created by: Brook Keele
    // Usage: bulkImportHosts(["192.168.0.1","192.168.0.2","192.168.0.3","192.168.0.4"])
    // Usage: bulkImportHosts(["192.168.0.1:161:udp:snmp:SNMPv3","192.168.0.1:443:tcp:https:Microsoft IIS httpd"])
    // Requires client-side updates: true
    //
    var projectId = Session.get('projectId')
    var modifiedBy = Meteor.user().emails[0].address

    hostsToAdd.forEach(function(host){
        var hostIp = host
        var service = ''
        if (host.indexOf(':') != -1) {
            var parts = host.split(':')
            hostIp = parts[0]
            port = parts[1]
            protocol = parts[2]
            service = parts[3]
            product = parts[4]
            
            Meteor.call('createHost',projectId,hostIp,'','')
            console.log("Created host record for " + hostIp)

            var newHost = Hosts.findOne({
                'projectId':projectId,
                'ipv4':hostIp
            }
            if (newHost != null) {
                Meteor.call('createService',projectId,newHost._id,port,protocol,service,product)
                console.log("Created service record for " + hostIp + ":" + port + "/" + protocol)
            }

        }
        else {
            Meteor.call('createHost',projectId,host,'','')
            console.log("Created host record for " + host)
        }
    })

    
}
