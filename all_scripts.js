function bulkRemoveHosts(i){var r=Session.get("projectId"),e=(Meteor.user().emails[0].address,Hosts.find({projectId:r}).fetch());count=0,e.forEach(function(t){i.includes(t.ipv4)&&(Meteor.call("removeHost",r,t._id,function(o){o?console.log("Error removing "+t.ipv4+". "+o):Meteor.call("removeHostFromIssues",r,t._id)}),count++)}),console.log("Total of "+count+" host(s) removed.")}function changeHostsToSpecifiedColorByServicesOrIssues(h,f,v){function o(i,e,t){return 0===e||i.status===t[e-1].status}function i(o,e){Hosts.update({_id:o},{$set:{status:e,lastModifiedBy:l}})}function e(t){return Services.find({projectId:s,hostId:t}).fetch()}function r(o){var e=Hosts.findOne({_id:o}).ipv4;return Issues.find({projectId:s,"hosts.ipv4":e}).fetch()}function u(o){if("services"===h)return e(o);if("issues"===h)return r(o);throw{name:"Incorrect servicesOrIssues Selection",message:"Incorrect servicesOrIssues selection: \""+h+"\" is not a valid servicesOrIssues for this function"}}var s=Session.get("projectId"),l=Meteor.user().emails[0].address,c=0,d=0;if(-1===StatusMap.indexOf(v))throw console.log("Lair Supserviceed colors: "+StatusMap),{name:"Wrong lairColor",message:"Provided lairColor: \""+v+"\" is not Lair compliant"};var t=Hosts.find({projectId:s}).fetch();if("all"===f)t.forEach(function(t){i(t._id,v)}),d=t.length;else if("none"===f)t.forEach(function(o){var e=o._id;0>=u(e).length&&(i(e,v),c++)}),d=c;else if(-1!==StatusMap.indexOf(f))t.forEach(function(t){var e=!1,r=t._id,l=u(r);e=0<l.length&&l[0].status===f&&l.every(o),e&&(i(r,v),c++),d=c});else if("same"===f)t.forEach(function(r){var e=!1,l=r._id;e=u(l).every(o),e&&(i(l,v),c++),d=c});else{if("diff"!==f)throw{name:"Incorrect statusOption Selection",message:"Incorrect statusOption selection: \""+f+"\" is not a valid statusOption for this function"};t.forEach(function(r){var e=!1,l=r._id;e=!u(l).every(o),e&&(i(l,v),c++),d=c})}console.log("Total of "+d+" host(s) updated")}function changeServicesRegexToSpecifiedColor(s,l){var e=Session.get("projectId"),t=Meteor.user().emails[0].address;if("lair-grey"!==l&&"lair-blue"!==l&&"lair-green"!==l&&"lair-orange"!==l&&"lair-red"!==l)return void console.log("Invalid color specified");var o=Services.find({projectId:e,service:{$regex:s}}).fetch();return 1>o.length?void console.log("No services found"):void(o.forEach(function(o){Services.update({_id:o._id},{$set:{status:l,lastModifiedBy:t}})}),console.log("Total of "+o.length+" service(s) updated to "+l+"."))}function changeServicesToSpecifiedColor(s,l){var e=Session.get("projectId"),t=Meteor.user().emails[0].address;if("lair-grey"!==l&&"lair-blue"!==l&&"lair-green"!==l&&"lair-orange"!==l&&"lair-red"!==l)return void console.log("Invalid color specified");var o=Services.find({projectId:e,service:s}).fetch();return 1>o.length?void console.log("No services found"):void(o.forEach(function(o){console.log("Updating: "+o.service+"/"+o.protocol),Services.update({_id:o._id},{$set:{status:l,last_modified_by:t}})}),console.log("Total of "+o.length+" service(s) updated"))}function changeServicesToColorByPort(s,l){var e=Session.get("projectId"),t=Meteor.user().emails[0].address;if("lair-grey"!==l&&"lair-blue"!==l&&"lair-green"!==l&&"lair-orange"!==l&&"lair-red"!==l)return void console.log("Invalid color specified");var o=Services.find({projectId:e,port:s}).fetch();return 1>o.length?void console.log("No services found"):void(o.forEach(function(o){Services.update({_id:o._id},{$set:{status:l,last_modifiedBy:t}})}),console.log("Total of "+o.length+" service(s) updated to "+l+"."))}function changeServicesToSpecifiedColorByProduct(s,l){var e=Session.get("projectId"),t=Meteor.user().emails[0].address;if("lair-grey"!==l&&"lair-blue"!==l&&"lair-green"!==l&&"lair-orange"!==l&&"lair-red"!==l)return void console.log("Invalid color specified");var o=Services.find({projectId:e,product:s}).fetch();return 1>o.length?void console.log("No services found"):void(o.forEach(function(o){Services.update({_id:o._id},{$set:{status:l,last_modifiedBy:t}})}),console.log("Total of "+o.length+" service(s) updated to "+l+"."))}function changeServicesToSpecifiedColor(s,l){var e=Session.get("projectId"),t=Meteor.user().emails[0].address;if("lair-grey"!==l&&"lair-blue"!==l&&"lair-green"!==l&&"lair-orange"!==l&&"lair-red"!==l)return void console.log("Invalid color specified");var o=Services.find({projectId:e,service:s}).fetch();return 1>o.length?void console.log("No services found"):void(o.forEach(function(o){Services.update({_id:o._id},{$set:{status:l,last_modifiedBy:t}})}),console.log("Total of "+o.length+" service(s) updated to "+l+"."))}function countHostServicesBycolor(r){var s={},t=Session.get("projectId");if(-1===StatusMap.indexOf(r))throw console.log("Lair Supserviceed colors: "+StatusMap),{name:"Wrong color",message:"Provided color: \""+r+"\" is not Lair compliant"};for(var o in Services.find({projectId:t,status:r}).fetch().forEach(function(i){o=Hosts.findOne({projectId:t,_id:i.hostId}),s.hasOwnProperty(o.ipv4)?s[o.ipv4]++:s[o.ipv4]=1}),s)console.log(o+" ("+s[o]+")")}function countHostServicesBycolor(r){var s={},t=Session.get("projectId");if(-1===StatusMap.indexOf(r))throw console.log("Lair Supserviceed colors: "+StatusMap),{name:"Wrong color",message:"Provided color: \""+r+"\" is not Lair compliant"};for(var o in Services.find({projectId:t,status:r}).fetch().forEach(function(i){o=Hosts.findOne({projectId:t,_id:i.hostId}),s.hasOwnProperty(o.ipv4)?s[o.ipv4]++:s[o.ipv4]=1}),s)console.log(o+" ("+s[o]+")")}function deleteHostsByCIDR(){function d(i,e){for(var t="00000000",o=parseInt(i[0],10).toString(2),c=o.length>=t.length?o:t.slice(0,t.length-o.length)+o,n=1;n<=i.length;n++)o=parseInt(i[n],10).toString(2),c+=o.length>=t.length?o:t.slice(0,t.length-o.length)+o;return c.slice(0,parseInt(e,10))}var a=Session.get("projectId"),e=Array.prototype.slice.call(arguments,0),t=Hosts.find({projectId:a}).fetch(),i={},r={},s=0;t.forEach(function(e){var t=e.ipv4.split(".");i[d(t,32)]=e.ipv4,r[e.ipv4]=e._id}),e.forEach(function(e){e=e.split("/");var t=e[0].split("."),l=d(t,e[1]);for(var c in i)c.slice(0,parseInt(e[1],10))===l&&(Meteor.call("removeHost",a,r[i[c]],function(t){t||Meteor.call("removeHostFromIssues",a,i[c])}),s++);console.log("Total of "+s+" host(s) removed.")})}function deleteHostsByStatus(i){var r=Session.get("projectId"),e=Hosts.find({projectId:r,status:i}).fetch();return 1>e.length?void console.log("No matching hosts found"):void(e.forEach(function(t){console.log("Removing "+t.ipv4),Meteor.call("removeHost",r,t._id,function(e){e||Meteor.call("removeHostFromIssues",r,t.ipv4)})}),console.log("Total of "+e.length+" host(s) removed."))}function deleteHostServicesByTool(s,e){var t=Session.get("projectId"),o=Hosts.findOne({projectId:t,ipv4:s});if(void 0===o)return void console.log("No matching host found");var i=Services.find({projectId:t,hostId:o._id,lastModifiedBY:e}).fetch();1>i.length&&console.log("No matching Services found"),i.forEach(function(o){console.log("Removing "+o.protocol+"/"+o.service),Meteor.call("removeService",t,o._id,function(){})}),console.log("Total of "+i.length+" service(s) removed.")}function deleteIssuesByStatus(i){var r=Session.get("projectId"),e=Issues.find({projectId:r,status:i}).fetch();return 1>e.length?void console.log("No matching Issues found"):void(e.forEach(function(t){console.log("Removing "+t.title),Meteor.call("removeIssue",r,t._id)}),console.log("Total of "+e.length+" Issue(s) removed."))}function deleteIssuesWithNoHosts(){var o=Session.get("projectId"),e=Issues.find({projectId:o,hosts:{$size:0}}).fetch();return 1>e.length?void console.log("No orphaned issues present"):void(e.forEach(function(e){console.log("Removing: "+e.title),Meteor.call("removeIssue",o,e._id,function(){})}),console.log("Total of "+e.length+" vuln(s) removed"))}function deleteServices(r,e,t){var o=Session.get("projectId");Services.find({projectId:o,port:r,protocol:e,service:t}).forEach(function(t){console.log("Removing Service : "+t._id+" "+t.port+"/"+t.protocol+" "+t.service),Meteor.call("removeService",o,t.hostId,t._id)})}function dumpIssueEvidence(){var t=Session.get("projectId");Issues.find({projectId:t}).fetch().forEach(function(t){console.log(t.title),console.log(t.evidence)})}function dumpServiceNotes(l,c){var e=Session.get("projectId"),n=new RegExp(l,"i"),t=Services.find({projectId:e,notes:{$elemMatch:{title:{$regex:l,$options:"i"}}}},{notes:1,hostId:1}).fetch(),o=_.pluck(t,"hostId");Hosts.find({_id:{$in:o}},{sort:{longIpv4Addr:1},ipv4:1}).fetch().forEach(function(i){""!==c&&c!==i.ipv4||(t=Services.find({hostId:i._id},{sort:{service:1},notes:1,service:1,protocol:1}).fetch(),t.forEach(function(e){e.notes.forEach(function(t){n.test(t.title)&&console.log(i.ipv4+":"+e.port+"/"+e.protocol+" - "+t.title+"\n"+t.content)})}))})}function filterHostsNoServices(){}function findNoteByRegex(r,e){var s=Session.get("projectId"),o=new RegExp(r,"i");("project"===e||"all"===e)&&(console.log("Project Notes"),Projects.findOne({_id:s},{notes:1}).notes.forEach(function(t){(o.test(t.title)||o.test(t.content))&&console.log("\t"+t.title)})),"host"!==e&&"all"!==e||(console.log("Host Notes"),Hosts.find({projectId:s,$or:[{notes:{$elemMatch:{title:{$regex:r,$options:"i"}}}},{notes:{$elemMatch:{content:{$regex:r,$options:"i"}}}}]},{notes:1}).fetch().forEach(function(i){i.notes.forEach(function(e){(o.test(e.title)||o.test(e.content))&&console.log("\t"+i.ipv4+" -> "+e.title)})})),"service"!==e&&"all"!==e||(console.log("Service Notes"),Services.find({projectId:s,$or:[{notes:{$elemMatch:{title:{$regex:r,$options:"i"}}}},{notes:{$elemMatch:{content:{$regex:r,$options:"i"}}}}]},{notes:1}).fetch().forEach(function(i){i.notes.forEach(function(e){if(o.test(e.title)||o.test(e.content)){var t=Hosts.findOne({projectId:s,_id:i.hostId});console.log("\t"+t.ipv4+" -> "+i.service.toString()+" -> "+e.title)}})})),"Issue"!==e&&"all"!==e||(console.log("Issue Notes"),Issues.find({projectId:s,$or:[{evidence:{$regex:r,$options:"i"}},{notes:{$elemMatch:{title:{$regex:r,$options:"i"}}}},{notes:{$elemMatch:{content:{$regex:r,$options:"i"}}}}]},{notes:1}).fetch().forEach(function(i){o.test(i.evidence)&&console.log("\t"+i.title+" -> Evidence Field"),i.notes.forEach(function(e){(o.test(e.title)||o.test(e.content))&&console.log("\t"+i.title+" -> "+e.title)})}))}function generateIssueBulkListByRegex(r){var s=Session.get("projectId"),e=Services.find({projectId:s,service:{$regex:r}}).fetch(),t=[];e.forEach(function(i){var e=Hosts.findOne({projectId:s,_id:i.hostId});t.push(e.ipv4+","+i.port+","+i.protocol)}),console.log(t.join("\n"))}function generatePortStringFromService(i){var e=Session.get("projectId"),t=Services.find({projectId:e,service:i}).fetch();return _.uniq(_.pluck(t,"port")).sort(function(o,e){return o-e}).join(",")}function generateUniquePortString(r){var e=Session.get("projectId"),t={projectId:e};void 0!==r&&(t.protocol=r);var o=Services.find(t).fetch();return _.uniq(_.pluck(o,"port")).sort(function(o,e){return o-e}).join(",")}function generateURLList(){var c=Session.get("projectId"),e=Hosts.find({projectId:c}).fetch();if(!e)return void console.log("No hosts found");var l=0,n=[];e.forEach(function(o){var t=o.hostnames,e=o._id,i={projectId:c,hostId:e};i.service={$regex:"web|www|ssl|http|https",$options:"i"},Services.find(i).fetch().forEach(function(i){var e="http://";i.service.match(/(ssl|https)/gi)&&(e="https://"),l++,n.push(e+o.ipv4+":"+i.port),t.forEach(function(o){l++,n.push(e+o+":"+i.port)})})}),console.log(n.join("\n")),console.log(l+" URL(s) generated")}function generateWebDiscoTargetList(){var n=Session.get("projectId"),e=Hosts.find({projectId:n}).fetch();if(1>e.length)return void console.log("No hosts found");var s=0;e.forEach(function(o){var t=o.hostnames,e=o._id,i={projectId:n,hostId:e};i.service={$regex:"web|www|ssl|http|https",$options:"i"};var r=Services.find(i).fetch(),l=[];r.forEach(function(c){var n="http";c.service.match(/(ssl|https)/g)&&(n="https"),c.notes.forEach(function(t){t.content.match(/SSL/)&&(n="https")}),s++,l.push(n+","+o.ipv4+","+c.port+","),t.forEach(function(e){s++,l.push(n+","+o.ipv4+","+c.port+","+e)})})}),console.log(urls.join("\n")),console.log(s+" URL(s) generated")}function getHostsByCIDR(){function l(i,e){for(var t="00000000",o=parseInt(i[0],10).toString(2),c=o.length>=t.length?o:t.slice(0,t.length-o.length)+o,n=1;n<=i.length;n++)o=parseInt(i[n],10).toString(2),c+=o.length>=t.length?o:t.slice(0,t.length-o.length)+o;return c.slice(0,parseInt(e,10))}var e=Array.prototype.slice.call(arguments,0),t=Hosts.find({projectId:Session.get("projectId")}).fetch(),c={};t.forEach(function(e){var t=e.ipv4.split(".");c[l(t,32)]=e.ipv4}),e.forEach(function(e){e=e.split("/");var i=e[0].split("."),o=l(i,e[1]);for(var r in c)r.slice(0,parseInt(e[1],10))===o&&console.log(c[r])})}function getPersonByDepartmentRegex(i){if(i&&"object"!=typeof i)return console.log("Department regex can not be a string, must be an object");var e=Session.get("projectId"),t=People.find({projectId:e,department:{$regex:i}}).fetch();t.forEach(function(t){console.log("'"+t.principalName+"','"+t.department+"','"+t.emails.join(" ")+"'")}),console.log("returned: "+t.len()+" results")}function getPersonEmail(){var o=Session.get("projectId"),e=People.find({projectId:o}).fetch();e.forEach(function(t){console.log("'"+t.principalName+"','"+t.department+"','"+t.emails.join(" ")+"'")}),console.log("returned: "+e.length+" results")}function greyHostsNoServicesGreen(){var r=Session.get("projectId"),s=Meteor.user().emails[0].address,e=Hosts.find({projectId:r,status:"lair-grey"}).fetch();if(void 0===e||0===e.length)return void console.log("No hosts found");var t=0;e.forEach(function(o){0===Services.find({hostId:o._id,port:{$gt:0}}).count()&&(t++,console.log("Updating: "+o.ipv4),Hosts.update({_id:o._id},{$set:{status:"lair-green",last_modified_by:s}}))}),console.log(t+" host(s) updated")}function hostnamesToNessus(){var o=Hosts.find({projectId:Session.get("projectId")}).fetch(),i=[];o.forEach(function(t){var r=t.ipv4;t.hostnames.forEach(function(t){i.push(t+"["+r+"]")})}),i.forEach(function(t){console.log(t)})}function iisOsProfiler(){var o=Session.get("projectId");Services.find({projectId:o,product:{$regex:/IIS\s(httpd\s)?\d+\.\d+/,$options:"i"}}).fetch().forEach(function(l){var e=l.product,t=e.match(/\d+\.\d+/);if(null!==t){var i=parseFloat(t[0]);if(!isNaN(i)){var r=Models.os();r.tool="IIS OS Profiler",r.weight=90,6>i?r.fingerprint="Microsoft Windows Server 2000":7>i?r.fingerprint="Microsoft Windows Server 2003":8>i?r.fingerprint="Microsoft Windows Server 2008":9>i?r.fingerprint="Microsoft Windows Server 2012":11>i&&(r.fingerprint="Microsoft Windows Server 2016"),""!==r.fingerprint&&Meteor.call("setOs",o,l.hostId,r.tool,r.fingerprint,r.weight,function(t){t?console.log("Error generating OS for",l.hostId,t):console.log("Created new OS",r.fingerprint,"for",l.hostId)})}}})}function listHostsByIssueTitle(r){var e=Session.get("projectId"),t=Issues.findOne({projectId:e,title:r}),o="";return t?void(t.hosts.forEach(function(t){console.log(t.ipv4+":"+t.port+"/"+t.protocol),o+=t.ipv4+", "}),console.log("RHOSTS: "+o.slice(0,-2))):void console.log("Issue not found")}function listHostsByIssueTitleRegex(r){var e=Session.get("projectId"),t=Issues.find({projectId:e,title:{$regex:r}}).fetch(),o="";return 1>t.length?void console.log("No issues found"):void t.forEach(function(t){console.log(t.title),t.hosts.forEach(function(t){console.log(t.ipv4+":"+t.port+"/"+t.protocol),o+=t.ipv4+", "}),console.log("RHOSTS: "+o.slice(0,-2)),o=""})}function listHostByTag(t){Hosts.find({projectId:Session.get("projectId"),tags:t}).fetch().forEach(function(t){console.log(t.ipv4)})}function listHostServicesBycolor(o){var i=Session.get("projectId");if(-1===StatusMap.indexOf(o))throw console.log("Lair Supserviceed colors: "+StatusMap),{name:"Wrong color",message:"Provided color: \""+o+"\" is not Lair compliant"};Services.find({projectId:i,status:o}).fetch().forEach(function(t){var e=Hosts.findOne({projectId:i,_id:t.hostId});console.log(e.ipv4+":"+t.port+"/"+t.protocol)})}function listHostServicesByServiceRegex(i){var r=Session.get("projectId"),e=Services.find({projectId:r,service:{$regex:i}}).fetch();return 1>e.length?void console.log("No services found"):void e.forEach(function(t){var e=Hosts.findOne({projectId:r,_id:t.hostId});console.log(e.ipv4+":"+t.port+"/"+t.protocol)})}function listUnknownOpenServices(n,e){var t=Session.get("projectId"),o=[],i=[],d=[];if(Hosts.find({projectId:t}).fetch().forEach(function(r){Services.find({projectId:t,hostId:r._id}).fetch().forEach(function(e){0<e.port&&("product"===n?"unknown"===e.product.toLowerCase()&&(o.push(r.ipv4),"tcp"===e.protocol?i.push(e.port):"udp"===e.protocol&&d.push(e.port)):"service"===n?"unknown"===e.service.toLowerCase()&&(o.push(r.ipv4),"tcp"===e.protocol?i.push(e.port):"udp"===e.protocol&&d.push(e.port)):"both"==n&&("unknown"!==e.service.toLowerCase()&&"unknown"!==e.product.toLowerCase()||(o.push(r.ipv4),"tcp"===e.protocol?i.push(e.port):"udp"===e.protocol&&d.push(e.port))))}),"nmap"===e&&(0<i.length&&0<d.length?console.log("nmap -v -sV --version-all -sS -sU "+r.ipv4+" -p T:"+i.toString()+",U:"+d.toString()):0<i.length?console.log("nmap -v -sV --version-all -sS "+r.ipv4+" -p "+i.toString()):0<d.length&&console.log("nmap -v -sV --version-all -sU "+r.ipv4+" -p "+d.toString()),i=[],d=[]),"hostAndPort"===e&&(0<i.length&&i.forEach(function(t){console.log(r.ipv4+":"+t.toString())}),0<d.length&&d.forEach(function(t){console.log(r.ipv4+":"+t.toString())}))}),(0<i.length||0<d.length)&&"list"===e){var a=i.filter(function(o,e){return i.indexOf(o)===e}),l=d.filter(function(o,e){return d.indexOf(o)===e});console.log("Hosts:"),console.log(o.toString()),console.log("TCP Services:"),console.log(a.sort(function(o,e){return o-e}).toString()),console.log("UDP Services:"),console.log(l.sort(function(o,e){return o-e}).toString())}}function getHostList(i){for(var e="",r=0;r<i.hosts.length;r++)e+=i.hosts[r].ipv4+",";return e+"\n"}function mergeIssuesByTitle(I,e,t){function o(o){E.forEach(function(e){Meteor.call("addIssueNote",s,o,e.title,e.content)}),O.forEach(function(e){Meteor.call("addHostToIssue",s,o,e.ipv4,e.port,e.protocol)}),v.forEach(function(e){Meteor.call("addCVE",s,o,e)}),i()}function i(){l.forEach(function(t){Meteor.call("removeIssue",s,t._id)})}function r(i){for(var e,l={},o=[],r=0,n=i.length;r<n;++r)e=JSON.stringify(i[r]),l.hasOwnProperty(e)||(l[e]=!0,o.push(i[r]));return o}if("object"!=typeof I)return console.log("Issue regex can not be a string, must be a object");if("string"!=typeof e)return console.log("Invalid title");if("number"!=typeof t)return console.log("Invalid cvss. Variable must be a number");var s=Session.get("projectId"),l=Issues.find({projectId:s,title:{$regex:I}}).fetch();if(1>l.length)return console.log("Did not find any issues with the given regex");var c=Issues.findOne({projectId:s,title:e});void 0!==c&&(l.push(c),Meteor.call("removeIssue",s,c._id)),console.log("Going to merge "+l.length+" issues");var n="",j="",m="",E=[],S=[],$=[];l.forEach(function(t){issue_hosts=getHostList(t),n+="\n\nFrom "+t.title+"\nAffected Hosts: "+issue_hosts+t.description,j+="\n\nFrom "+t.title+"\nAffected Hosts: "+issue_hosts+t.solution,m+="\n\nFrom "+t.title+"\nAffected Hosts: "+issue_hosts+t.evidence,E=E.concat(t.notes),S=S.concat(t.cves),$=$.concat(t.hosts)});var O=r($),v=r(S);return Meteor.call("createIssue",s,e,t,n,m,j,function(i,e){i?(console.log("Error: could not create new Issue",i.message),c&&console.log("Looks like you lost",c.title)):o(e)}),console.log("Complete")}function mergeIssues(O,e,t,o,i,r,x){function l(o){T.forEach(function(e){Meteor.call("addIssueNote",d,o,e.title,e.content)}),P.forEach(function(e){Meteor.call("addHostToIssue",d,o,e.ipv4,e.port,e.protocol)}),$.forEach(function(e){Meteor.call("addCVE",d,o,e)}),M.forEach(function(e){Meteor.call("addReference",d,o,e.link,e.name)}),c()}function c(){console.log("Removing Issues"),g.forEach(function(t){Meteor.call("removeIssue",d,t._id)})}function n(i){for(var e,l={},o=[],r=0,n=i.length;r<n;++r)e=JSON.stringify(i[r]),l.hasOwnProperty(e)||(l[e]=!0,o.push(i[r]));return o}if("object"!=typeof O)return console.log("Issue regex can not be a string, must be a object");if("string"!=typeof i)return console.log("Invalid title");if("string"!=typeof r)return console.log("Invalid cvss. Variable must be a string");var d=Session.get("projectId"),g=Issues.find({projectId:d,title:{$regex:O},cvss:{$gte:e,$lte:t},"hosts.ipv4":{$regex:o}}).fetch();if(1>g.length)return console.log("Did not find any issues with the given regex");var a=0;if(g.sort(function(o,e){return o.cvss>e.cvss?-1:o.cvss<e.cvss?1:0}),g.forEach(function(t){console.log("CVSS: "+t.cvss+" - Hosts: "+t.hosts.length+" - Title: "+t.title),t.cvss>a&&(a=t.cvss)}),console.log("Total found: "+g.length+" Highest CVSS: "+a),x){"max"===r&&(r=a);var b=Issues.findOne({projectId:d,title:i});void 0!==b&&(g.push(b),Meteor.call("removeIssue",d,b._id)),console.log("Going to merge "+g.length+" issues");var h="",w="",N="",T=[],M=[],H=[],L=[],C=[];g.forEach(function(t){h=h+"CVSS: "+t.cvss+" - Hosts: "+t.hosts.length+" - Title: "+t.title+"\n",w="",N="",M=M.concat(t.references),T=T.concat(t.notes),H=H.concat(t.cves),L=L.concat(t.hosts),C=C.concat(t.files)});var P=n(L),$=n(H);return Meteor.call("createIssue",d,i,r,h,N,w,function(o,e){o?(console.log("Error: could not create new Issue",o.message),b&&console.log("Looks like you lost",b.title)):l(e)}),console.log("Complete")}}function negateHostsByCIDR(){function l(i,e){for(var t="00000000",o=parseInt(i[0],10).toString(2),c=o.length>=t.length?o:t.slice(0,t.length-o.length)+o,n=1;n<=i.length;n++)o=parseInt(i[n],10).toString(2),c+=o.length>=t.length?o:t.slice(0,t.length-o.length)+o;return c.slice(0,parseInt(e,10))}var e=Array.prototype.slice.call(arguments,0),t=Hosts.find({projectId:Session.get("projectId")}).fetch(),c={};for(var o in t.forEach(function(e){var t=e.ipv4.split(".");c[l(t,32)]=e.ipv4}),e.forEach(function(e){e=e.split("/");var i=e[0].split("."),o=l(i,e[1]);for(var r in c)r.slice(0,parseInt(e[1],10))===o&&delete c[r]}),c)console.log(c[o])}function niktoHostList(l,c){function t(t,r){var e=Hosts.findOne({projectId:i,_id:t});e.ipv4+":"+r in n||(n[e.ipv4+":"+r]=!0),c&&e.hostnames.forEach(function(t){!c.test(t)||t+":"+r in n||(n[t+":"+r]=!0)})}if(c&&"object"!=typeof c)return console.log("Domain regex can not be a string, must be an object");var n={},i=Session.get("projectId");for(var e in l.forEach(function(o){var e=[];if("object"==typeof o)e=Services.find({projectId:i,service:{$regex:o}}).fetch(),e.forEach(function(o){t(o.hostId,o.port)});else if("string"==typeof o)for(var r=o.split("-"),s=parseInt(r[0],10);s<=parseInt(r[1],10);s++)e=Services.find({projectId:i,service:s}).fetch(),e.forEach(function(o){t(o.hostId,o.port)});else{var l=Services.findOne({projectId:i,service:o});t(l.hostId,o.port)}}),n)console.log(e)}function niktoTopFindings(l,n){var t={},o=Session.get("projectId"),d=["(.*might be interesting.*)","(.*Public HTTP Methods:.*PUT.*)","(.*[Ww]eb[Dd]av.*)","(.*Directory indexing found.*)","(.*default file found.*)","(.*Server leaks.*IP.*)","(.*OSVDBID:.*)"];if(0<l.length&&(d=l),Services.find({projectId:o}).fetch().forEach(function(i){var r=Hosts.findOne({projectId:o,_id:i.hostId});i.notes.forEach(function(o){if(/Nikto/.test(o.title)){var e=o.title.match(/\(.*\)/);if(n){var i=new RegExp(d.join("|")+"\\n","g"),s=o.content.match(i);s&&(t[r.ipv4+" "+e]||(t[r.ipv4+" "+e]=[]),t[r.ipv4+" "+e].push(s.join("")))}else console.log(r.ipv4+" "+e),console.log(o.content)}})}),n)for(var e in t)console.log(e),console.log(t[e].join(""))}function NormalizeProtocols(){var r=Session.get("projectId"),s=Meteor.user().emails[0].address,e=Services.find({projectId:r}).fetch();if(1>e.length)return void console.log("No services found");var t=0;e.forEach(function(o){o.protocol!=o.protocol.toLowerCase()&&(Services.update({_id:o._id},{$set:{protocol:o.protocol.toLowerCase(),last_modifiedBy:s}}),t++)}),console.log("Total of "+t+" service(s) updated.")}function NormalizeUnknownProducts(){var r=Session.get("projectId"),s=Meteor.user().emails[0].address,e=Services.find({projectId:r}).fetch();if(1>e.length)return void console.log("No services found");var t=0;e.forEach(function(o){"unknown"==o.product.toLowerCase()&&(Services.update({_id:o._id},{$set:{product:"",last_modifiedBy:s}}),t++)}),console.log("Total of "+t+" service(s) updated.")}function removeHostnamesByPattern(i){Hosts.find({projectId:Session.get("projectId")}).fetch().forEach(function(e){var r=[];e.hostnames.forEach(function(e){return e.includes(i)?void console.log("removing "+e):void r.push(e)}),Hosts.update({_id:e._id},{$set:{hostnames:r,lastModifiedBy:Meteor.user().emails[0].address}})})}function removeIPBasedHostnames(){Hosts.find({projectId:Session.get("projectId")}).fetch().forEach(function(i){var r=i.ipv4,t=[];i.hostnames.forEach(function(o){if(o.includes(r))return void console.log("removing "+o);if(o.includes(r.replace(/\./g,"_")))return void console.log("removing "+o);if(o.includes(r.replace(/\./g,"-")))return void console.log("removing "+o);var e=r.split(".").reverse().join(".");return o.includes(e)?void console.log("removing "+o):o.includes(e.replace(/\./g,"_"))?void console.log("removing "+o):o.includes(e.replace(/\./g,"-"))?void console.log("removing "+o):void t.push(o)}),Hosts.update({_id:i._id},{$set:{hostnames:t,lastModifiedBy:Meteor.user().emails[0].address}})})}function removePort0ServicesNoReference(){var l=Session.get("projectId"),c=[],t=[],e=[];Hosts.find({projectId:l}).fetch().forEach(function(t){t._id,Services.find({projectId:l,hostId:t._id}).fetch().forEach(function(o){if(0>=o.port&&1>o.notes){var e={ip:t.ipv4,service:o};c.push(e)}})}),Issues.find({projectId:l}).fetch().forEach(function(o){o.hosts.forEach(function(o){if(0==o.port)for(var e=0;e<c.length;e++)c[e].ip==o.ipv4&&o.protocol==c[e].service.protocol&&t.push(c[e].service._id)})});for(var o=0;o<c.length;o++){for(var i=0;i<t.length;i++)c[o].service._id,t[i];e.push(c[o].service)}console.log("Removing "+e.length+" out of "+c.length+" port 0 services");for(var o=0;o<e.length;o++)console.log("Removing ServiceID: "+e[o]._id),Meteor.call("removeService",l,e[o].hostId,e[o]._id,function(){})}function searchServiceNoteContent(l,e){var t=Session.get("projectId"),o=new RegExp(l,"i"),i=new RegExp(e,"g"),r=[];Services.find({projectId:t,notes:{$elemMatch:{title:{$regex:l,$options:"i"}}}},{notes:1,hostId:1}).fetch().forEach(function(t){t.notes.forEach(function(t){o.test(t.title)&&r.push.apply(r,t.content.match(i))})}),console.log(function(i){for(var e={},t=[],o=0,l=i.length;o<l;++o)e.hasOwnProperty(i[o])||(t.push(i[o]),e[i[o]]=1);return t}(r).join("\n"))}function servicesToColorByHosts(l,n,c){var o=Session.get("projectId"),i=(Meteor.user().emails[0].address,0),d={"lair-red":4,"lair-orange":3,"lair-blue":2,"lair-green":0,"lair-grey":0};if(-1===StatusMap.indexOf(c))throw console.log("Lair Supserviceed colors: "+StatusMap),{name:"Wrong Color",message:"Provided color: \""+c+"\" is not Lair compliant"};l.forEach(function(r){var e=Hosts.findOne({projectId:o,ipv4:r}),t=Services.find({hostId:e._id,port:n}).fetch();1>t.length||t.forEach(function(s){console.log("Updating: "+r+":"+s.port+"/"+s.protocol),Meteor.call("setPortStatus",o,s._id,c),d[c]>d[e.status]&&(console.log("Updating: "+r+" status \""+c+"\""),Meteor.call("setHostStatus",o,e._id,c)),i++})}),console.log(i+" service(s) updated")}function setGlobalServiceByPort(r,e,t){var o=Session.get("projectId");Services.find({projectId:o,port:r,protocol:e,service:{$ne:t}}).forEach(function(i){Meteor.call("setServiceService",o,i._id,t,function(t){t||console.log("Modified service successfully")})})}function setHostOsByOsRegex(s,l,t){var o=Session.get("projectId"),e=Hosts.find({projectId:o,"os.fingerprint":{$regex:s}}).fetch();return 1>e.length?void console.log("No hosts found"):void e.forEach(function(i){Meteor.call("setOs",o,i._id,"Manual",l,t,function(e){return e?void console.log("Unable to update host "+i.ipv4):void console.log("Updated host "+i.ipv4)})})}function setHostServiceByPort(s,l,t,o){var i=Session.get("projectId"),s=Hosts.findOne({projectId:i,ipv4:s});Services.find({projectId:i,hostId:s._id,port:{$in:l},protocol:t,service:{$ne:o}}).forEach(function(t){Meteor.call("setServiceService",i,t._id,o,function(t){t||console.log("Modified service successfully")})})}function tagHostsByCIDR(c,e){function n(i,e){for(var t="00000000",o=parseInt(i[0],10).toString(2),c=o.length>=t.length?o:t.slice(0,t.length-o.length)+o,n=1;n<=i.length;n++)o=parseInt(i[n],10).toString(2),c+=o.length>=t.length?o:t.slice(0,t.length-o.length)+o;return c.slice(0,parseInt(e,10))}var o=Hosts.find({projectId:Session.get("projectId")}).fetch(),i={};o.forEach(function(o){var e=o.ipv4.split(".");i[n(e,32)]=o}),cidr=e.split("/");var e=cidr[0].split("."),r=n(e,cidr[1]);for(var s in i)s.slice(0,parseInt(cidr[1],10))===r&&(!function(o,e){check(o,Matchers.isObjectId),check(e,Matchers.isNonEmptyString),Hosts.update({_id:o},{$addToSet:{tags:e},$set:{lastModifiedBy:Meteor.user().emails[0].address}})}(i[s]._id,c),console.log(i[s]._id,c))}function uniqueServicesByHostsCIDR(){function n(i,e){for(var t="00000000",o=parseInt(i[0],10).toString(2),c=o.length>=t.length?o:t.slice(0,t.length-o.length)+o,n=1;n<=i.length;n++)o=parseInt(i[n],10).toString(2),c+=o.length>=t.length?o:t.slice(0,t.length-o.length)+o;return c.slice(0,parseInt(e,10))}var e=Session.get("projectId"),t=Array.prototype.slice.call(arguments,0),o=Hosts.find({projectId:e}).fetch(),d={},r={},s=[];o.forEach(function(e){var t=e.ipv4.split(".");d[n(t,32)]=e.ipv4,r[e.ipv4]=e._id}),t.forEach(function(e){e=e.split("/");var l=e[0].split("."),o=n(l,e[1]);for(var i in d)i.slice(0,parseInt(e[1],10))===o&&s.push(r[d[i]])});var i=Services.find({projectId:e,hostId:{$in:s}}).fetch();return _.uniq(_.pluck(i,"port")).sort(function(o,e){return o-e}).join(",")}function bulkRemoveHosts(r){var s=Session.get("projectId"),e=Meteor.user().emails[0].address,t=Hosts.find({projectId:s}).fetch();count=0,t.forEach(function(t){r.includes(t.ipv4)&&(Meteor.call("removeHost",s,t._id,function(o){o?console.log("Error removing "+t.ipv4+". "+o):Meteor.call("removeHostFromIssues",s,t._id)}),count++)}),console.log("Total of "+count+" host(s) removed.")}function changeHostsToSpecifiedColorByServicesOrIssues(h,f,v){function o(i,e,t){return 0===e||i.status===t[e-1].status}function u(o,e){Hosts.update({_id:o},{$set:{status:e,lastModifiedBy:l}})}function e(t){return Services.find({projectId:s,hostId:t}).fetch()}function i(o){var e=Hosts.findOne({_id:o}).ipv4;return Issues.find({projectId:s,"hosts.ipv4":e}).fetch()}function r(o){if("services"===h)return e(o);if("issues"===h)return i(o);throw{name:"Incorrect servicesOrIssues Selection",message:"Incorrect servicesOrIssues selection: \""+h+"\" is not a valid servicesOrIssues for this function"}}var s=Session.get("projectId"),l=Meteor.user().emails[0].address,c=0,d=0;if(-1===StatusMap.indexOf(v))throw console.log("Lair Supserviceed colors: "+StatusMap),{name:"Wrong lairColor",message:"Provided lairColor: \""+v+"\" is not Lair compliant"};var t=Hosts.find({projectId:s}).fetch();if("all"===f)t.forEach(function(t){u(t._id,v)}),d=t.length;else if("none"===f)t.forEach(function(o){var e=o._id,t=r(e).length;0>=t&&(u(e,v),c++)}),d=c;else if(-1!==StatusMap.indexOf(f))t.forEach(function(t){var e=!1,i=t._id,l=r(i);e=0<l.length&&l[0].status===f&&l.every(o),e&&(u(i,v),c++),d=c});else if("same"===f)t.forEach(function(i){var e=!1,n=i._id,s=r(n);e=s.every(o),e&&(u(n,v),c++),d=c});else if("diff"===f)t.forEach(function(i){var e=!1,n=i._id,s=r(n);e=!s.every(o),e&&(u(n,v),c++),d=c});else throw{name:"Incorrect statusOption Selection",message:"Incorrect statusOption selection: \""+f+"\" is not a valid statusOption for this function"};console.log("Total of "+d+" host(s) updated")}function changeServicesRegexToSpecifiedColor(s,l){var e=Session.get("projectId"),t=Meteor.user().emails[0].address;if("lair-grey"!==l&&"lair-blue"!==l&&"lair-green"!==l&&"lair-orange"!==l&&"lair-red"!==l)return void console.log("Invalid color specified");var o=Services.find({projectId:e,service:{$regex:s}}).fetch();return 1>o.length?void console.log("No services found"):void(o.forEach(function(o){Services.update({_id:o._id},{$set:{status:l,lastModifiedBy:t}})}),console.log("Total of "+o.length+" service(s) updated to "+l+"."))}function changeServicesToColorByPort(s,l){var e=Session.get("projectId"),t=Meteor.user().emails[0].address;if("lair-grey"!==l&&"lair-blue"!==l&&"lair-green"!==l&&"lair-orange"!==l&&"lair-red"!==l)return void console.log("Invalid color specified");var o=Services.find({projectId:e,port:s}).fetch();return 1>o.length?void console.log("No services found"):void(o.forEach(function(o){Services.update({_id:o._id},{$set:{status:l,last_modifiedBy:t}})}),console.log("Total of "+o.length+" service(s) updated to "+l+"."))}function changeServicesToSpecifiedColor(s,l){var e=Session.get("projectId"),t=Meteor.user().emails[0].address;if("lair-grey"!==l&&"lair-blue"!==l&&"lair-green"!==l&&"lair-orange"!==l&&"lair-red"!==l)return void console.log("Invalid color specified");var o=Services.find({projectId:e,service:s}).fetch();return 1>o.length?void console.log("No services found"):void(o.forEach(function(o){Services.update({_id:o._id},{$set:{status:l,last_modifiedBy:t}})}),console.log("Total of "+o.length+" service(s) updated to "+l+"."))}function changeServicesToSpecifiedColorByProduct(s,l){var e=Session.get("projectId"),t=Meteor.user().emails[0].address;if("lair-grey"!==l&&"lair-blue"!==l&&"lair-green"!==l&&"lair-orange"!==l&&"lair-red"!==l)return void console.log("Invalid color specified");var o=Services.find({projectId:e,product:s}).fetch();return 1>o.length?void console.log("No services found"):void(o.forEach(function(o){Services.update({_id:o._id},{$set:{status:l,last_modifiedBy:t}})}),console.log("Total of "+o.length+" service(s) updated to "+l+"."))}function changeServicesToSpecifiedColor(s,l){var e=Session.get("projectId"),t=Meteor.user().emails[0].address;if("lair-grey"!==l&&"lair-blue"!==l&&"lair-green"!==l&&"lair-orange"!==l&&"lair-red"!==l)return void console.log("Invalid color specified");var o=Services.find({projectId:e,service:s}).fetch();return 1>o.length?void console.log("No services found"):void(o.forEach(function(o){console.log("Updating: "+o.service+"/"+o.protocol),Services.update({_id:o._id},{$set:{status:l,last_modified_by:t}})}),console.log("Total of "+o.length+" service(s) updated"))}function countHostServicesBycolor(s){var l={},t=Session.get("projectId");if(-1===StatusMap.indexOf(s))throw console.log("Lair Supserviceed colors: "+StatusMap),{name:"Wrong color",message:"Provided color: \""+s+"\" is not Lair compliant"};var e=Services.find({projectId:t,status:s}).fetch();for(var o in e.forEach(function(i){o=Hosts.findOne({projectId:t,_id:i.hostId}),l.hasOwnProperty(o.ipv4)?l[o.ipv4]++:l[o.ipv4]=1}),l)console.log(o+" ("+l[o]+")")}function countHostServicesBycolor(s){var l={},t=Session.get("projectId");if(-1===StatusMap.indexOf(s))throw console.log("Lair Supserviceed colors: "+StatusMap),{name:"Wrong color",message:"Provided color: \""+s+"\" is not Lair compliant"};var e=Services.find({projectId:t,status:s}).fetch();for(var o in e.forEach(function(i){o=Hosts.findOne({projectId:t,_id:i.hostId}),l.hasOwnProperty(o.ipv4)?l[o.ipv4]++:l[o.ipv4]=1}),l)console.log(o+" ("+l[o]+")")}function deleteHostServicesByTool(s,e){var t=Session.get("projectId"),o=Hosts.findOne({projectId:t,ipv4:s});if("undefined"==typeof o)return void console.log("No matching host found");var i=Services.find({projectId:t,hostId:o._id,lastModifiedBY:e}).fetch();1>i.length&&console.log("No matching Services found"),i.forEach(function(o){console.log("Removing "+o.protocol+"/"+o.service),Meteor.call("removeService",t,o._id,function(){})}),console.log("Total of "+i.length+" service(s) removed.")}function deleteHostsByCIDR(){function d(i,e){for(var t="00000000",o=parseInt(i[0],10).toString(2),c=o.length>=t.length?o:t.slice(0,t.length-o.length)+o,n=1;n<=i.length;n++)o=parseInt(i[n],10).toString(2),c+=o.length>=t.length?o:t.slice(0,t.length-o.length)+o;return c.slice(0,parseInt(e,10))}var a=Session.get("projectId"),e=Array.prototype.slice.call(arguments,0),t=Hosts.find({projectId:a}).fetch(),i={},r={},s=0;t.forEach(function(e){var t=e.ipv4.split(".");i[d(t,32)]=e.ipv4,r[e.ipv4]=e._id}),e.forEach(function(e){e=e.split("/");var t=e[0].split("."),l=d(t,e[1]);for(var c in i)c.slice(0,parseInt(e[1],10))===l&&(Meteor.call("removeHost",a,r[i[c]],function(t){t||Meteor.call("removeHostFromIssues",a,i[c])}),s++);console.log("Total of "+s+" host(s) removed.")})}function deleteHostsByStatus(i){var r=Session.get("projectId"),e=Hosts.find({projectId:r,status:i}).fetch();return 1>e.length?void console.log("No matching hosts found"):void(e.forEach(function(t){console.log("Removing "+t.ipv4),Meteor.call("removeHost",r,t._id,function(e){e||Meteor.call("removeHostFromIssues",r,t.ipv4)})}),console.log("Total of "+e.length+" host(s) removed."))}function deleteIssuesByStatus(i){var r=Session.get("projectId"),e=Issues.find({projectId:r,status:i}).fetch();return 1>e.length?void console.log("No matching Issues found"):void(e.forEach(function(t){console.log("Removing "+t.title),Meteor.call("removeIssue",r,t._id)}),console.log("Total of "+e.length+" Issue(s) removed."))}function deleteIssuesWithNoHosts(){var o=Session.get("projectId"),e=Issues.find({projectId:o,hosts:{$size:0}}).fetch();return 1>e.length?void console.log("No orphaned issues present"):void(e.forEach(function(e){console.log("Removing: "+e.title),Meteor.call("removeIssue",o,e._id,function(){})}),console.log("Total of "+e.length+" vuln(s) removed"))}function deleteServices(s,e,t){var o=Session.get("projectId"),i=Services.find({projectId:o,port:s,protocol:e,service:t});i.forEach(function(t){console.log("Removing Service : "+t._id+" "+t.port+"/"+t.protocol+" "+t.service),Meteor.call("removeService",o,t.hostId,t._id)})}function dumpIssueEvidence(){var o=Session.get("projectId"),e=Issues.find({projectId:o}).fetch();e.forEach(function(t){console.log(t.title),console.log(t.evidence)})}function dumpServiceNotes(c,n){var e=Session.get("projectId"),d=new RegExp(c,"i"),t=Services.find({projectId:e,notes:{$elemMatch:{title:{$regex:c,$options:"i"}}}},{notes:1,hostId:1}).fetch(),o=_.pluck(t,"hostId"),i=Hosts.find({_id:{$in:o}},{sort:{longIpv4Addr:1},ipv4:1}).fetch();i.forEach(function(i){""!==n&&n!==i.ipv4||(t=Services.find({hostId:i._id},{sort:{service:1},notes:1,service:1,protocol:1}).fetch(),t.forEach(function(e){e.notes.forEach(function(t){d.test(t.title)&&console.log(i.ipv4+":"+e.port+"/"+e.protocol+" - "+t.title+"\n"+t.content)})}))})}function filterHostsNoServices(){}function findNoteByRegex(s,e){var l=Session.get("projectId"),o=new RegExp(s,"i");if("project"===e||"all"===e){console.log("Project Notes");var t=Projects.findOne({_id:l},{notes:1});t.notes.forEach(function(t){(o.test(t.title)||o.test(t.content))&&console.log("\t"+t.title)})}("host"===e||"all"===e)&&(console.log("Host Notes"),Hosts.find({projectId:l,$or:[{notes:{$elemMatch:{title:{$regex:s,$options:"i"}}}},{notes:{$elemMatch:{content:{$regex:s,$options:"i"}}}}]},{notes:1}).fetch().forEach(function(i){i.notes.forEach(function(e){(o.test(e.title)||o.test(e.content))&&console.log("\t"+i.ipv4+" -> "+e.title)})})),("service"===e||"all"===e)&&(console.log("Service Notes"),Services.find({projectId:l,$or:[{notes:{$elemMatch:{title:{$regex:s,$options:"i"}}}},{notes:{$elemMatch:{content:{$regex:s,$options:"i"}}}}]},{notes:1}).fetch().forEach(function(i){i.notes.forEach(function(e){if(o.test(e.title)||o.test(e.content)){var t=Hosts.findOne({projectId:l,_id:i.hostId});console.log("\t"+t.ipv4+" -> "+i.service.toString()+" -> "+e.title)}})})),("Issue"===e||"all"===e)&&(console.log("Issue Notes"),Issues.find({projectId:l,$or:[{evidence:{$regex:s,$options:"i"}},{notes:{$elemMatch:{title:{$regex:s,$options:"i"}}}},{notes:{$elemMatch:{content:{$regex:s,$options:"i"}}}}]},{notes:1}).fetch().forEach(function(i){o.test(i.evidence)&&console.log("\t"+i.title+" -> Evidence Field"),i.notes.forEach(function(e){(o.test(e.title)||o.test(e.content))&&console.log("\t"+i.title+" -> "+e.title)})}))}function generateIssueBulkListByRegex(r){var s=Session.get("projectId"),e=Services.find({projectId:s,service:{$regex:r}}).fetch(),t=[];e.forEach(function(i){var e=Hosts.findOne({projectId:s,_id:i.hostId});t.push(e.ipv4+","+i.port+","+i.protocol)}),console.log(t.join("\n"))}function generatePortStringFromService(i){var e=Session.get("projectId"),t=Services.find({projectId:e,service:i}).fetch();return _.uniq(_.pluck(t,"port")).sort(function(o,e){return o-e}).join(",")}function generateUniquePortString(r){var e=Session.get("projectId"),t={projectId:e};"undefined"!=typeof r&&(t.protocol=r);var o=Services.find(t).fetch();return _.uniq(_.pluck(o,"port")).sort(function(o,e){return o-e}).join(",")}function generateURLList(){var n=Session.get("projectId"),e=Hosts.find({projectId:n}).fetch();if(!e)return void console.log("No hosts found");var l=0,c=[];e.forEach(function(o){var t=o.hostnames,e=o._id,i={projectId:n,hostId:e};i.service={$regex:"web|www|ssl|http|https",$options:"i"};var r=Services.find(i).fetch();r.forEach(function(i){var e="http://";i.service.match(/(ssl|https)/gi)&&(e="https://"),l++,c.push(e+o.ipv4+":"+i.port),t.forEach(function(o){l++,c.push(e+o+":"+i.port)})})}),console.log(c.join("\n")),console.log(l+" URL(s) generated")}function generateWebDiscoTargetList(){var n=Session.get("projectId"),e=Hosts.find({projectId:n}).fetch();if(1>e.length)return void console.log("No hosts found");var s=0;e.forEach(function(o){var t=o.hostnames,e=o._id,i={projectId:n,hostId:e};i.service={$regex:"web|www|ssl|http|https",$options:"i"};var r=Services.find(i).fetch(),l=[];r.forEach(function(c){var n="http";c.service.match(/(ssl|https)/g)&&(n="https"),c.notes.forEach(function(t){t.content.match(/SSL/)&&(n="https")}),s++,l.push(n+","+o.ipv4+","+c.port+","),t.forEach(function(e){s++,l.push(n+","+o.ipv4+","+c.port+","+e)})})}),console.log(urls.join("\n")),console.log(s+" URL(s) generated")}function getHostsByCIDR(){function l(i,e){for(var t="00000000",o=parseInt(i[0],10).toString(2),c=o.length>=t.length?o:t.slice(0,t.length-o.length)+o,n=1;n<=i.length;n++)o=parseInt(i[n],10).toString(2),c+=o.length>=t.length?o:t.slice(0,t.length-o.length)+o;return c.slice(0,parseInt(e,10))}var e=Array.prototype.slice.call(arguments,0),t=Hosts.find({projectId:Session.get("projectId")}).fetch(),c={};t.forEach(function(e){var t=e.ipv4.split(".");c[l(t,32)]=e.ipv4}),e.forEach(function(e){e=e.split("/");var i=e[0].split("."),o=l(i,e[1]);for(var r in c)r.slice(0,parseInt(e[1],10))===o&&console.log(c[r])})}function getPersonByDepartmentRegex(i){if(i&&"object"!=typeof i)return console.log("Department regex can not be a string, must be an object");var e=Session.get("projectId"),t=People.find({projectId:e,department:{$regex:i}}).fetch();t.forEach(function(t){console.log("'"+t.principalName+"','"+t.department+"','"+t.emails.join(" ")+"'")}),console.log("returned: "+t.len()+" results")}function getPersonEmail(){var o=Session.get("projectId"),e=People.find({projectId:o}).fetch();e.forEach(function(t){console.log("'"+t.principalName+"','"+t.department+"','"+t.emails.join(" ")+"'")}),console.log("returned: "+e.length+" results")}function greyHostsNoServicesGreen(){var r=Session.get("projectId"),s=Meteor.user().emails[0].address,e=Hosts.find({projectId:r,status:"lair-grey"}).fetch();if("undefined"==typeof e||0===e.length)return void console.log("No hosts found");var t=0;e.forEach(function(i){var e=Services.find({hostId:i._id,port:{$gt:0}}).count();0===e&&(t++,console.log("Updating: "+i.ipv4),Hosts.update({_id:i._id},{$set:{status:"lair-green",last_modified_by:s}}))}),console.log(t+" host(s) updated")}function hostnamesToNessus(){var o=Hosts.find({projectId:Session.get("projectId")}).fetch(),i=[];o.forEach(function(t){var r=t.ipv4;t.hostnames.forEach(function(t){i.push(t+"["+r+"]")})}),i.forEach(function(t){console.log(t)})}function iisOsProfiler(){var o=Session.get("projectId"),e=Services.find({projectId:o,product:{$regex:/IIS\s(httpd\s)?\d+\.\d+/,$options:"i"}}).fetch();e.forEach(function(l){var e=l.product,t=e.match(/\d+\.\d+/);if(null!==t){var i=parseFloat(t[0]);if(!isNaN(i)){var r=Models.os();r.tool="IIS OS Profiler",r.weight=90,6>i?r.fingerprint="Microsoft Windows Server 2000":7>i?r.fingerprint="Microsoft Windows Server 2003":8>i?r.fingerprint="Microsoft Windows Server 2008":9>i?r.fingerprint="Microsoft Windows Server 2012":11>i&&(r.fingerprint="Microsoft Windows Server 2016"),""!==r.fingerprint&&Meteor.call("setOs",o,l.hostId,r.tool,r.fingerprint,r.weight,function(t){t?console.log("Error generating OS for",l.hostId,t):console.log("Created new OS",r.fingerprint,"for",l.hostId)})}}})}function listHostServicesBycolor(i){var r=Session.get("projectId");if(-1===StatusMap.indexOf(i))throw console.log("Lair Supserviceed colors: "+StatusMap),{name:"Wrong color",message:"Provided color: \""+i+"\" is not Lair compliant"};var e=Services.find({projectId:r,status:i}).fetch();e.forEach(function(t){var e=Hosts.findOne({projectId:r,_id:t.hostId});console.log(e.ipv4+":"+t.port+"/"+t.protocol)})}function listHostServicesByServiceRegex(i){var r=Session.get("projectId"),e=Services.find({projectId:r,service:{$regex:i}}).fetch();return 1>e.length?void console.log("No services found"):void e.forEach(function(t){var e=Hosts.findOne({projectId:r,_id:t.hostId});console.log(e.ipv4+":"+t.port+"/"+t.protocol)})}function listHostsByIssueTitle(s){var e=Session.get("projectId"),t=Issues.findOne({projectId:e,title:s}),o="";if(!t)return void console.log("Issue not found");var l=t.hosts;l.forEach(function(t){console.log(t.ipv4+":"+t.port+"/"+t.protocol),o+=t.ipv4+", "}),console.log("RHOSTS: "+o.slice(0,-2))}function listHostsByIssueTitleRegex(r){var e=Session.get("projectId"),t=Issues.find({projectId:e,title:{$regex:r}}).fetch(),o="";return 1>t.length?void console.log("No issues found"):void t.forEach(function(i){console.log(i.title);var e=i.hosts;e.forEach(function(t){console.log(t.ipv4+":"+t.port+"/"+t.protocol),o+=t.ipv4+", "}),console.log("RHOSTS: "+o.slice(0,-2)),o=""})}function listHostByTag(o){var e=Hosts.find({projectId:Session.get("projectId"),tags:o}).fetch();e.forEach(function(t){console.log(t.ipv4)})}function listUnknownOpenServices(d,e){var t=Session.get("projectId"),o=[],i=[],a=[],g=Hosts.find({projectId:t}).fetch();if(g.forEach(function(r){var s=Services.find({projectId:t,hostId:r._id}).fetch();s.forEach(function(e){0<e.port&&("product"===d?"unknown"===e.product.toLowerCase()&&(o.push(r.ipv4),"tcp"===e.protocol?i.push(e.port):"udp"===e.protocol&&a.push(e.port)):"service"===d?"unknown"===e.service.toLowerCase()&&(o.push(r.ipv4),"tcp"===e.protocol?i.push(e.port):"udp"===e.protocol&&a.push(e.port)):"both"==d&&("unknown"===e.service.toLowerCase()||"unknown"===e.product.toLowerCase())&&(o.push(r.ipv4),"tcp"===e.protocol?i.push(e.port):"udp"===e.protocol&&a.push(e.port)))}),"nmap"===e&&(0<i.length&&0<a.length?console.log("nmap -v -sV --version-all -sS -sU "+r.ipv4+" -p T:"+i.toString()+",U:"+a.toString()):0<i.length?console.log("nmap -v -sV --version-all -sS "+r.ipv4+" -p "+i.toString()):0<a.length&&console.log("nmap -v -sV --version-all -sU "+r.ipv4+" -p "+a.toString()),i=[],a=[]),"hostAndPort"===e&&(0<i.length&&i.forEach(function(t){console.log(r.ipv4+":"+t.toString())}),0<a.length&&a.forEach(function(t){console.log(r.ipv4+":"+t.toString())}))}),(0<i.length||0<a.length)&&"list"===e){var l=i.filter(function(o,e){return i.indexOf(o)===e}),c=a.filter(function(o,e){return a.indexOf(o)===e});console.log("Hosts:"),console.log(o.toString()),console.log("TCP Services:"),console.log(l.sort(function(o,e){return o-e}).toString()),console.log("UDP Services:"),console.log(c.sort(function(o,e){return o-e}).toString())}}function mergeDuplicateIssues(){for(var l=Session.get("projectId"),e=Issues.find({projectId:l}).fetch(),t=e.sort((o,e)=>o.title>e.title?1:-1),o=Hosts.find({projectId:l}).fetch(),i=0;i<t.length-1;i++)source=t[i+1],dest=t[i],source.title==dest.title&&source.cvss==dest.cvss&&(console.log("found match: "+dest.title),console.log(source.hosts.length+" hosts to move."),source.notes.forEach(function(e){console.log("Adding Note"),Meteor.call("addIssueNote",l,dest._id,e.title,e.content)}),source.hosts.forEach(function(e){o.forEach(function(t){var o=Services.findOne({projectId:l,hostId:t._id,port:e.port,protocol:e.protocol});t.ipv4==e.ipv4&&null!=o&&(console.log("Added "+e.ipv4+" to "+dest.title),Meteor.call("removeHostFromIssue",l,source._id,e.ipv4,e.port,e.protocol),Meteor.call("addHostToIssue",l,dest._id,e.ipv4,e.port,e.protocol))})}),source.cves.forEach(function(e){dest.cves.includes(e)||(console.log("Adding CVE "+e),Meteor.call("addCVE",l,dest._id,e))}),source.evidence!=dest.evidence&&(dest.evidence+="\n\n"+source.evidence,console.log("Updating Evidence."),Meteor.call("setIssueEvidence",l,dest._id,dest.evidence)),console.log("Removing issue."),Meteor.call("removeIssue",l,source._id))}function mergeIssues(O,e,t,o,i,r,x){function l(o){T.forEach(function(e){Meteor.call("addIssueNote",d,o,e.title,e.content)}),P.forEach(function(e){Meteor.call("addHostToIssue",d,o,e.ipv4,e.port,e.protocol)}),$.forEach(function(e){Meteor.call("addCVE",d,o,e)}),M.forEach(function(e){Meteor.call("addReference",d,o,e.link,e.name)}),c()}function c(){console.log("Removing Issues"),g.forEach(function(t){Meteor.call("removeIssue",d,t._id)})}function n(i){for(var e,l={},o=[],r=0,n=i.length;r<n;++r)e=JSON.stringify(i[r]),l.hasOwnProperty(e)||(l[e]=!0,o.push(i[r]));return o}if("object"!=typeof O)return console.log("Issue regex can not be a string, must be a object");if("string"!=typeof i)return console.log("Invalid title");if("string"!=typeof r)return console.log("Invalid cvss. Variable must be a string");var d=Session.get("projectId"),g=Issues.find({projectId:d,title:{$regex:O},cvss:{$gte:e,$lte:t},"hosts.ipv4":{$regex:o}}).fetch();if(1>g.length)return console.log("Did not find any issues with the given regex");var a=0;if(g.sort(function(o,e){return o.cvss>e.cvss?-1:o.cvss<e.cvss?1:0}),g.forEach(function(t){console.log("CVSS: "+t.cvss+" - Hosts: "+t.hosts.length+" - Title: "+t.title),t.cvss>a&&(a=t.cvss)}),console.log("Total found: "+g.length+" Highest CVSS: "+a),x){"max"===r&&(r=a);var b=Issues.findOne({projectId:d,title:i});"undefined"!=typeof b&&(g.push(b),Meteor.call("removeIssue",d,b._id)),console.log("Going to merge "+g.length+" issues");var h="",w="",N="",T=[],M=[],H=[],L=[],C=[];g.forEach(function(t){h=h+"CVSS: "+t.cvss+" - Hosts: "+t.hosts.length+" - Title: "+t.title+"\n",w="",N="",M=M.concat(t.references),T=T.concat(t.notes),H=H.concat(t.cves),L=L.concat(t.hosts),C=C.concat(t.files)});var P=n(L),$=n(H);return Meteor.call("createIssue",d,i,r,h,N,w,function(o,e){o?(console.log("Error: could not create new Issue",o.message),b&&console.log("Looks like you lost",b.title)):l(e)}),console.log("Complete")}}function getHostList(i){for(var e="",r=0;r<i.hosts.length;r++)e+=i.hosts[r].ipv4+",";return e+"\n"}function mergeIssuesByTitle(I,e,t){function o(o){E.forEach(function(e){Meteor.call("addIssueNote",s,o,e.title,e.content)}),O.forEach(function(e){Meteor.call("addHostToIssue",s,o,e.ipv4,e.port,e.protocol)}),v.forEach(function(e){Meteor.call("addCVE",s,o,e)}),i()}function i(){l.forEach(function(t){Meteor.call("removeIssue",s,t._id)})}function r(i){for(var e,l={},o=[],r=0,n=i.length;r<n;++r)e=JSON.stringify(i[r]),l.hasOwnProperty(e)||(l[e]=!0,o.push(i[r]));return o}if("object"!=typeof I)return console.log("Issue regex can not be a string, must be a object");if("string"!=typeof e)return console.log("Invalid title");if("number"!=typeof t)return console.log("Invalid cvss. Variable must be a number");var s=Session.get("projectId"),l=Issues.find({projectId:s,title:{$regex:I}}).fetch();if(1>l.length)return console.log("Did not find any issues with the given regex");var c=Issues.findOne({projectId:s,title:e});"undefined"!=typeof c&&(l.push(c),Meteor.call("removeIssue",s,c._id)),console.log("Going to merge "+l.length+" issues");var n="",j="",m="",E=[],S=[],$=[];l.forEach(function(t){issue_hosts=getHostList(t),n+="\n\nFrom "+t.title+"\nAffected Hosts: "+issue_hosts+t.description,j+="\n\nFrom "+t.title+"\nAffected Hosts: "+issue_hosts+t.solution,m+="\n\nFrom "+t.title+"\nAffected Hosts: "+issue_hosts+t.evidence,E=E.concat(t.notes),S=S.concat(t.cves),$=$.concat(t.hosts)});var O=r($),v=r(S);return Meteor.call("createIssue",s,e,t,n,m,j,function(i,e){i?(console.log("Error: could not create new Issue",i.message),c&&console.log("Looks like you lost",c.title)):o(e)}),console.log("Complete")}function negateHostsByCIDR(){function l(i,e){for(var t="00000000",o=parseInt(i[0],10).toString(2),c=o.length>=t.length?o:t.slice(0,t.length-o.length)+o,n=1;n<=i.length;n++)o=parseInt(i[n],10).toString(2),c+=o.length>=t.length?o:t.slice(0,t.length-o.length)+o;return c.slice(0,parseInt(e,10))}var e=Array.prototype.slice.call(arguments,0),t=Hosts.find({projectId:Session.get("projectId")}).fetch(),c={};for(var o in t.forEach(function(e){var t=e.ipv4.split(".");c[l(t,32)]=e.ipv4}),e.forEach(function(e){e=e.split("/");var i=e[0].split("."),o=l(i,e[1]);for(var r in c)r.slice(0,parseInt(e[1],10))===o&&delete c[r]}),c)console.log(c[o])}function niktoHostList(l,c){function t(t,r){var e=Hosts.findOne({projectId:i,_id:t});e.ipv4+":"+r in n||(n[e.ipv4+":"+r]=!0),c&&e.hostnames.forEach(function(t){c.test(t)&&!(t+":"+r in n)&&(n[t+":"+r]=!0)})}if(c&&"object"!=typeof c)return console.log("Domain regex can not be a string, must be an object");var n={},i=Session.get("projectId");for(var e in l.forEach(function(o){var e=[];if("object"==typeof o)e=Services.find({projectId:i,service:{$regex:o}}).fetch(),e.forEach(function(o){t(o.hostId,o.port)});else if("string"==typeof o)for(var r=o.split("-"),s=parseInt(r[0],10);s<=parseInt(r[1],10);s++)e=Services.find({projectId:i,service:s}).fetch(),e.forEach(function(o){t(o.hostId,o.port)});else{var l=Services.findOne({projectId:i,service:o});t(l.hostId,o.port)}}),n)console.log(e)}function niktoTopFindings(c,n){var t={},o=Session.get("projectId"),d=["(.*might be interesting.*)","(.*Public HTTP Methods:.*PUT.*)","(.*[Ww]eb[Dd]av.*)","(.*Directory indexing found.*)","(.*default file found.*)","(.*Server leaks.*IP.*)","(.*OSVDBID:.*)"];0<c.length&&(d=c);var e=Services.find({projectId:o}).fetch();if(e.forEach(function(i){var r=Hosts.findOne({projectId:o,_id:i.hostId});i.notes.forEach(function(o){if(/Nikto/.test(o.title)){var e=o.title.match(/\(.*\)/);if(n){var i=new RegExp(d.join("|")+"\\n","g"),s=o.content.match(i);s&&(!t[r.ipv4+" "+e]&&(t[r.ipv4+" "+e]=[]),t[r.ipv4+" "+e].push(s.join("")))}else console.log(r.ipv4+" "+e),console.log(o.content)}})}),n)for(var i in t)console.log(i),console.log(t[i].join(""))}function NormalizeProtocols(){var r=Session.get("projectId"),s=Meteor.user().emails[0].address,e=Services.find({projectId:r}).fetch();if(1>e.length)return void console.log("No services found");var t=0;e.forEach(function(o){o.protocol!=o.protocol.toLowerCase()&&(Services.update({_id:o._id},{$set:{protocol:o.protocol.toLowerCase(),last_modifiedBy:s}}),t++)}),console.log("Total of "+t+" service(s) updated.")}function NormalizeUnknownProducts(){var r=Session.get("projectId"),s=Meteor.user().emails[0].address,e=Services.find({projectId:r}).fetch();if(1>e.length)return void console.log("No services found");var t=0;e.forEach(function(o){"unknown"==o.product.toLowerCase()&&(Services.update({_id:o._id},{$set:{product:"",last_modifiedBy:s}}),t++)}),console.log("Total of "+t+" service(s) updated.")}function removePort0ServicesNoReference(){var n=Session.get("projectId"),d=[],t=[],e=[],o=Hosts.find({projectId:n}).fetch();o.forEach(function(t){var e=t._id,o=Services.find({projectId:n,hostId:t._id}).fetch();o.forEach(function(o){if(0>=o.port&&1>o.notes){var e={ip:t.ipv4,service:o};d.push(e)}})});var i=Issues.find({projectId:n}).fetch();i.forEach(function(o){o.hosts.forEach(function(o){if(0==o.port)for(var e=0;e<d.length;e++)d[e].ip==o.ipv4&&o.protocol==d[e].service.protocol&&t.push(d[e].service._id)})});for(var r=0;r<d.length;r++){for(var s=0;s<t.length;s++)if(d[r].service._id==t[s])continue;e.push(d[r].service)}console.log("Removing "+e.length+" out of "+d.length+" port 0 services");for(var r=0;r<e.length;r++)console.log("Removing ServiceID: "+e[r]._id),Meteor.call("removeService",n,e[r].hostId,e[r]._id,function(){})}function removeIPBasedHostnames(){var t=Hosts.find({projectId:Session.get("projectId")}).fetch();t.forEach(function(i){var r=i.ipv4,t=[];i.hostnames.forEach(function(o){if(o.includes(r))return void console.log("removing "+o);if(o.includes(r.replace(/\./g,"_")))return void console.log("removing "+o);if(o.includes(r.replace(/\./g,"-")))return void console.log("removing "+o);var e=r.split(".").reverse().join(".");return o.includes(e)?void console.log("removing "+o):o.includes(e.replace(/\./g,"_"))?void console.log("removing "+o):o.includes(e.replace(/\./g,"-"))?void console.log("removing "+o):void t.push(o)}),Hosts.update({_id:i._id},{$set:{hostnames:t,lastModifiedBy:Meteor.user().emails[0].address}})})}function removeHostnamesByPattern(i){var e=Hosts.find({projectId:Session.get("projectId")}).fetch();e.forEach(function(e){var r=[];e.hostnames.forEach(function(e){return e.includes(i)?void console.log("removing "+e):void r.push(e)}),Hosts.update({_id:e._id},{$set:{hostnames:r,lastModifiedBy:Meteor.user().emails[0].address}})})}function searchServiceNoteContent(c,e){var t=Session.get("projectId"),o=new RegExp(c,"i"),i=new RegExp(e,"g"),r=[],s=Services.find({projectId:t,notes:{$elemMatch:{title:{$regex:c,$options:"i"}}}},{notes:1,hostId:1}).fetch();s.forEach(function(t){t.notes.forEach(function(t){o.test(t.title)&&r.push.apply(r,t.content.match(i))})}),console.log(function(i){for(var e={},t=[],o=0,l=i.length;o<l;++o)e.hasOwnProperty(i[o])||(t.push(i[o]),e[i[o]]=1);return t}(r).join("\n"))}function servicesToColorByHosts(c,n,d){var o=Session.get("projectId"),e=Meteor.user().emails[0].address,i=0,a={"lair-red":4,"lair-orange":3,"lair-blue":2,"lair-green":0,"lair-grey":0};if(-1===StatusMap.indexOf(d))throw console.log("Lair Supserviceed colors: "+StatusMap),{name:"Wrong Color",message:"Provided color: \""+d+"\" is not Lair compliant"};c.forEach(function(s){var e=Hosts.findOne({projectId:o,ipv4:s}),t=Services.find({hostId:e._id,port:n}).fetch();1>t.length||t.forEach(function(r){console.log("Updating: "+s+":"+r.port+"/"+r.protocol),Meteor.call("setPortStatus",o,r._id,d),a[d]>a[e.status]&&(console.log("Updating: "+s+" status \""+d+"\""),Meteor.call("setHostStatus",o,e._id,d)),i++})}),console.log(i+" service(s) updated")}function setGlobalServiceByPort(s,e,t){var o=Session.get("projectId"),i=Services.find({projectId:o,port:s,protocol:e,service:{$ne:t}});i.forEach(function(i){Meteor.call("setServiceService",o,i._id,t,function(t){t||console.log("Modified service successfully")})})}function setHostOsByOsRegex(s,l,t){var o=Session.get("projectId"),e=Hosts.find({projectId:o,"os.fingerprint":{$regex:s}}).fetch();return 1>e.length?void console.log("No hosts found"):void e.forEach(function(i){Meteor.call("setOs",o,i._id,"Manual",l,t,function(e){return e?void console.log("Unable to update host "+i.ipv4):void console.log("Updated host "+i.ipv4)})})}function setHostServiceByPort(l,c,t,o){var i=Session.get("projectId"),l=Hosts.findOne({projectId:i,ipv4:l}),r=Services.find({projectId:i,hostId:l._id,port:{$in:c},protocol:t,service:{$ne:o}});r.forEach(function(t){Meteor.call("setServiceService",i,t._id,o,function(t){t||console.log("Modified service successfully")})})}function tagHostsByCIDR(n,e){function d(o,e){return check(o,Matchers.isObjectId),check(e,Matchers.isNonEmptyString),Hosts.update({_id:o},{$addToSet:{tags:e},$set:{lastModifiedBy:Meteor.user().emails[0].address}})}function o(i,e){for(var t="00000000",o=parseInt(i[0],10).toString(2),c=o.length>=t.length?o:t.slice(0,t.length-o.length)+o,n=1;n<=i.length;n++)o=parseInt(i[n],10).toString(2),c+=o.length>=t.length?o:t.slice(0,t.length-o.length)+o;return c.slice(0,parseInt(e,10))}var i=Hosts.find({projectId:Session.get("projectId")}).fetch(),r={};i.forEach(function(i){var e=i.ipv4.split(".");r[o(e,32)]=i}),cidr=e.split("/");var e=cidr[0].split("."),s=o(e,cidr[1]);for(var l in r)l.slice(0,parseInt(cidr[1],10))===s&&(d(r[l]._id,n),console.log(r[l]._id,n))}function uniqueServicesByHostsCIDR(){function n(i,e){for(var t="00000000",o=parseInt(i[0],10).toString(2),c=o.length>=t.length?o:t.slice(0,t.length-o.length)+o,n=1;n<=i.length;n++)o=parseInt(i[n],10).toString(2),c+=o.length>=t.length?o:t.slice(0,t.length-o.length)+o;return c.slice(0,parseInt(e,10))}var e=Session.get("projectId"),t=Array.prototype.slice.call(arguments,0),o=Hosts.find({projectId:e}).fetch(),d={},r={},s=[];o.forEach(function(e){var t=e.ipv4.split(".");d[n(t,32)]=e.ipv4,r[e.ipv4]=e._id}),t.forEach(function(e){e=e.split("/");var l=e[0].split("."),o=n(l,e[1]);for(var i in d)i.slice(0,parseInt(e[1],10))===o&&s.push(r[d[i]])});var i=Services.find({projectId:e,hostId:{$in:s}}).fetch();return _.uniq(_.pluck(i,"port")).sort(function(o,e){return o-e}).join(",")}function bulkRemoveHosts(e){var t=Session.get("projectId"),o=Meteor.user().emails[0].address,i=Hosts.find({projectId:t}).fetch();count=0,i.forEach(function(o){e.includes(o.ipv4)&&(Meteor.call("removeHost",t,o._id,function(e){e?console.log("Error removing "+o.ipv4+". "+e):Meteor.call("removeHostFromIssues",t,o._id)}),count++)}),console.log("Total of "+count+" host(s) removed.")}function changeHostsToSpecifiedColorByServicesOrIssues(e,t,o){function i(e,t,o){return!(0!==t)||e.status===o[t-1].status}function r(e,t){Hosts.update({_id:e},{$set:{status:t,lastModifiedBy:d}})}function s(e){return Services.find({projectId:n,hostId:e}).fetch()}function l(e){var t=Hosts.findOne({_id:e}).ipv4;return Issues.find({projectId:n,"hosts.ipv4":t}).fetch()}function c(t){if("services"===e)return s(t);if("issues"===e)return l(t);throw{name:"Incorrect servicesOrIssues Selection",message:"Incorrect servicesOrIssues selection: \""+e+"\" is not a valid servicesOrIssues for this function"}}var n=Session.get("projectId"),d=Meteor.user().emails[0].address,a=0,g=0;if(-1===StatusMap.indexOf(o))throw console.log("Lair Supserviceed colors: "+StatusMap),{name:"Wrong lairColor",message:"Provided lairColor: \""+o+"\" is not Lair compliant"};var p=Hosts.find({projectId:n}).fetch();if("all"===t)p.forEach(function(e){r(e._id,o)}),g=p.length;else if("none"===t)p.forEach(function(e){var t=e._id,i=c(t).length;0>=i&&(r(t,o),a++)}),g=a;else if(-1!==StatusMap.indexOf(t))p.forEach(function(e){var s=!1,l=e._id,n=c(l);s=0<n.length&&n[0].status===t&&n.every(i),s&&(r(l,o),a++),g=a});else if("same"===t)p.forEach(function(e){var t=!1,s=e._id,l=c(s);t=l.every(i),t&&(r(s,o),a++),g=a});else if("diff"===t)p.forEach(function(e){var t=!1,s=e._id,l=c(s);t=!l.every(i),t&&(r(s,o),a++),g=a});else throw{name:"Incorrect statusOption Selection",message:"Incorrect statusOption selection: \""+t+"\" is not a valid statusOption for this function"};console.log("Total of "+g+" host(s) updated")}function changeServicesRegexToSpecifiedColor(e,t){var o=Session.get("projectId"),i=Meteor.user().emails[0].address;if("lair-grey"!==t&&"lair-blue"!==t&&"lair-green"!==t&&"lair-orange"!==t&&"lair-red"!==t)return void console.log("Invalid color specified");var r=Services.find({projectId:o,service:{$regex:e}}).fetch();return 1>r.length?void console.log("No services found"):void(r.forEach(function(e){Services.update({_id:e._id},{$set:{status:t,lastModifiedBy:i}})}),console.log("Total of "+r.length+" service(s) updated to "+t+"."))}function changeServicesToColorByPort(e,t){var o=Session.get("projectId"),i=Meteor.user().emails[0].address;if("lair-grey"!==t&&"lair-blue"!==t&&"lair-green"!==t&&"lair-orange"!==t&&"lair-red"!==t)return void console.log("Invalid color specified");var r=Services.find({projectId:o,port:e}).fetch();return 1>r.length?void console.log("No services found"):void(r.forEach(function(e){Services.update({_id:e._id},{$set:{status:t,last_modifiedBy:i}})}),console.log("Total of "+r.length+" service(s) updated to "+t+"."))}function changeServicesToSpecifiedColor(e,t){var o=Session.get("projectId"),i=Meteor.user().emails[0].address;if("lair-grey"!==t&&"lair-blue"!==t&&"lair-green"!==t&&"lair-orange"!==t&&"lair-red"!==t)return void console.log("Invalid color specified");var r=Services.find({projectId:o,service:e}).fetch();return 1>r.length?void console.log("No services found"):void(r.forEach(function(e){Services.update({_id:e._id},{$set:{status:t,last_modifiedBy:i}})}),console.log("Total of "+r.length+" service(s) updated to "+t+"."))}function changeServicesToSpecifiedColorByProduct(e,t){var o=Session.get("projectId"),i=Meteor.user().emails[0].address;if("lair-grey"!==t&&"lair-blue"!==t&&"lair-green"!==t&&"lair-orange"!==t&&"lair-red"!==t)return void console.log("Invalid color specified");var r=Services.find({projectId:o,product:e}).fetch();return 1>r.length?void console.log("No services found"):void(r.forEach(function(e){Services.update({_id:e._id},{$set:{status:t,last_modifiedBy:i}})}),console.log("Total of "+r.length+" service(s) updated to "+t+"."))}function changeServicesToSpecifiedColor(e,t){var o=Session.get("projectId"),i=Meteor.user().emails[0].address;if("lair-grey"!==t&&"lair-blue"!==t&&"lair-green"!==t&&"lair-orange"!==t&&"lair-red"!==t)return void console.log("Invalid color specified");var r=Services.find({projectId:o,service:e}).fetch();return 1>r.length?void console.log("No services found"):void(r.forEach(function(e){console.log("Updating: "+e.service+"/"+e.protocol),Services.update({_id:e._id},{$set:{status:t,last_modified_by:i}})}),console.log("Total of "+r.length+" service(s) updated"))}function countHostServicesBycolor(e){var t={},o=Session.get("projectId");if(-1===StatusMap.indexOf(e))throw console.log("Lair Supserviceed colors: "+StatusMap),{name:"Wrong color",message:"Provided color: \""+e+"\" is not Lair compliant"};var i=Services.find({projectId:o,status:e}).fetch();for(var r in i.forEach(function(e){r=Hosts.findOne({projectId:o,_id:e.hostId}),t.hasOwnProperty(r.ipv4)?t[r.ipv4]++:t[r.ipv4]=1}),t)console.log(r+" ("+t[r]+")")}function countHostServicesBycolor(e){var t={},o=Session.get("projectId");if(-1===StatusMap.indexOf(e))throw console.log("Lair Supserviceed colors: "+StatusMap),{name:"Wrong color",message:"Provided color: \""+e+"\" is not Lair compliant"};var i=Services.find({projectId:o,status:e}).fetch();for(var r in i.forEach(function(e){r=Hosts.findOne({projectId:o,_id:e.hostId}),t.hasOwnProperty(r.ipv4)?t[r.ipv4]++:t[r.ipv4]=1}),t)console.log(r+" ("+t[r]+")")}function deleteHostServicesByTool(e,t){var o=Session.get("projectId"),i=Hosts.findOne({projectId:o,ipv4:e});if("undefined"==typeof i)return void console.log("No matching host found");var r=Services.find({projectId:o,hostId:i._id,lastModifiedBY:t}).fetch();1>r.length&&console.log("No matching Services found"),r.forEach(function(e){console.log("Removing "+e.protocol+"/"+e.service),Meteor.call("removeService",o,e._id,function(){})}),console.log("Total of "+r.length+" service(s) removed.")}function deleteHostsByCIDR(){function e(e,t){for(var o="00000000",r=parseInt(e[0],10).toString(2),s=r.length>=o.length?r:o.slice(0,o.length-r.length)+r,l=1;l<=e.length;l++)r=parseInt(e[l],10).toString(2),s+=r.length>=o.length?r:o.slice(0,o.length-r.length)+r;return s.slice(0,parseInt(t,10))}var t=Session.get("projectId"),o=Array.prototype.slice.call(arguments,0),i=Hosts.find({projectId:t}).fetch(),r={},s={},l=0;i.forEach(function(t){var o=t.ipv4.split(".");r[e(o,32)]=t.ipv4,s[t.ipv4]=t._id}),o.forEach(function(o){o=o.split("/");var i=o[0].split("."),c=e(i,o[1]);for(var n in r)n.slice(0,parseInt(o[1],10))===c&&(Meteor.call("removeHost",t,s[r[n]],function(e){e||Meteor.call("removeHostFromIssues",t,r[n])}),l++);console.log("Total of "+l+" host(s) removed.")})}function deleteHostsByStatus(e){var t=Session.get("projectId"),o=Hosts.find({projectId:t,status:e}).fetch();return 1>o.length?void console.log("No matching hosts found"):void(o.forEach(function(e){console.log("Removing "+e.ipv4),Meteor.call("removeHost",t,e._id,function(o){o||Meteor.call("removeHostFromIssues",t,e.ipv4)})}),console.log("Total of "+o.length+" host(s) removed."))}function deleteIssuesByStatus(e){var t=Session.get("projectId"),o=Issues.find({projectId:t,status:e}).fetch();return 1>o.length?void console.log("No matching Issues found"):void(o.forEach(function(e){console.log("Removing "+e.title),Meteor.call("removeIssue",t,e._id)}),console.log("Total of "+o.length+" Issue(s) removed."))}function deleteIssuesWithNoHosts(){var e=Session.get("projectId"),t=Issues.find({projectId:e,hosts:{$size:0}}).fetch();return 1>t.length?void console.log("No orphaned issues present"):void(t.forEach(function(t){console.log("Removing: "+t.title),Meteor.call("removeIssue",e,t._id,function(){})}),console.log("Total of "+t.length+" vuln(s) removed"))}function deleteServices(e,t,o){var i=Session.get("projectId"),r=Services.find({projectId:i,port:e,protocol:t,service:o});r.forEach(function(e){console.log("Removing Service : "+e._id+" "+e.port+"/"+e.protocol+" "+e.service),Meteor.call("removeService",i,e.hostId,e._id)})}function dumpIssueEvidence(){var e=Session.get("projectId"),t=Issues.find({projectId:e}).fetch();t.forEach(function(e){console.log(e.title),console.log(e.evidence)})}function dumpServiceNotes(e,t){var o=Session.get("projectId"),i=new RegExp(e,"i"),r=Services.find({projectId:o,notes:{$elemMatch:{title:{$regex:e,$options:"i"}}}},{notes:1,hostId:1}).fetch(),s=_.pluck(r,"hostId"),l=Hosts.find({_id:{$in:s}},{sort:{longIpv4Addr:1},ipv4:1}).fetch();l.forEach(function(e){""!==t&&t!==e.ipv4||(r=Services.find({hostId:e._id},{sort:{service:1},notes:1,service:1,protocol:1}).fetch(),r.forEach(function(t){t.notes.forEach(function(o){i.test(o.title)&&console.log(e.ipv4+":"+t.port+"/"+t.protocol+" - "+o.title+"\n"+o.content)})}))})}function filterHostsNoServices(){}function findNoteByRegex(e,t){var o=Session.get("projectId"),i=new RegExp(e,"i");if("project"===t||"all"===t){console.log("Project Notes");var r=Projects.findOne({_id:o},{notes:1});r.notes.forEach(function(e){(i.test(e.title)||i.test(e.content))&&console.log("\t"+e.title)})}("host"===t||"all"===t)&&(console.log("Host Notes"),Hosts.find({projectId:o,$or:[{notes:{$elemMatch:{title:{$regex:e,$options:"i"}}}},{notes:{$elemMatch:{content:{$regex:e,$options:"i"}}}}]},{notes:1}).fetch().forEach(function(e){e.notes.forEach(function(t){(i.test(t.title)||i.test(t.content))&&console.log("\t"+e.ipv4+" -> "+t.title)})})),("service"===t||"all"===t)&&(console.log("Service Notes"),Services.find({projectId:o,$or:[{notes:{$elemMatch:{title:{$regex:e,$options:"i"}}}},{notes:{$elemMatch:{content:{$regex:e,$options:"i"}}}}]},{notes:1}).fetch().forEach(function(e){e.notes.forEach(function(t){if(i.test(t.title)||i.test(t.content)){var r=Hosts.findOne({projectId:o,_id:e.hostId});console.log("\t"+r.ipv4+" -> "+e.service.toString()+" -> "+t.title)}})})),("Issue"===t||"all"===t)&&(console.log("Issue Notes"),Issues.find({projectId:o,$or:[{evidence:{$regex:e,$options:"i"}},{notes:{$elemMatch:{title:{$regex:e,$options:"i"}}}},{notes:{$elemMatch:{content:{$regex:e,$options:"i"}}}}]},{notes:1}).fetch().forEach(function(e){i.test(e.evidence)&&console.log("\t"+e.title+" -> Evidence Field"),e.notes.forEach(function(t){(i.test(t.title)||i.test(t.content))&&console.log("\t"+e.title+" -> "+t.title)})}))}function generateIssueBulkListByRegex(e){var t=Session.get("projectId"),o=Services.find({projectId:t,service:{$regex:e}}).fetch(),i=[];o.forEach(function(e){var o=Hosts.findOne({projectId:t,_id:e.hostId});i.push(o.ipv4+","+e.port+","+e.protocol)}),console.log(i.join("\n"))}function generatePortStringFromService(e){var t=Session.get("projectId"),o=Services.find({projectId:t,service:e}).fetch();return _.uniq(_.pluck(o,"port")).sort(function(e,t){return e-t}).join(",")}function generateUniquePortString(e){var t=Session.get("projectId"),o={projectId:t};"undefined"!=typeof e&&(o.protocol=e);var i=Services.find(o).fetch();return _.uniq(_.pluck(i,"port")).sort(function(e,t){return e-t}).join(",")}function generateURLList(){var e=Session.get("projectId"),t=Hosts.find({projectId:e}).fetch();if(!t)return void console.log("No hosts found");var o=0,i=[];t.forEach(function(t){var r=t.hostnames,s=t._id,l={projectId:e,hostId:s};l.service={$regex:"web|www|ssl|http|https",$options:"i"};var c=Services.find(l).fetch();c.forEach(function(e){var s="http://";e.service.match(/(ssl|https)/gi)&&(s="https://"),o++,i.push(s+t.ipv4+":"+e.port),r.forEach(function(t){o++,i.push(s+t+":"+e.port)})})}),console.log(i.join("\n")),console.log(o+" URL(s) generated")}function generateWebDiscoTargetList(){var e=Session.get("projectId"),t=Hosts.find({projectId:e}).fetch();if(1>t.length)return void console.log("No hosts found");var o=0;t.forEach(function(t){var i=t.hostnames,r=t._id,s={projectId:e,hostId:r};s.service={$regex:"web|www|ssl|http|https",$options:"i"};var l=Services.find(s).fetch(),c=[];l.forEach(function(e){var r="http";e.service.match(/(ssl|https)/g)&&(r="https"),e.notes.forEach(function(e){e.content.match(/SSL/)&&(r="https")}),o++,c.push(r+","+t.ipv4+","+e.port+","),i.forEach(function(i){o++,c.push(r+","+t.ipv4+","+e.port+","+i)})})}),console.log(urls.join("\n")),console.log(o+" URL(s) generated")}function getHostsByCIDR(){function e(e,t){for(var o="00000000",r=parseInt(e[0],10).toString(2),s=r.length>=o.length?r:o.slice(0,o.length-r.length)+r,l=1;l<=e.length;l++)r=parseInt(e[l],10).toString(2),s+=r.length>=o.length?r:o.slice(0,o.length-r.length)+r;return s.slice(0,parseInt(t,10))}var t=Array.prototype.slice.call(arguments,0),o=Hosts.find({projectId:Session.get("projectId")}).fetch(),i={};o.forEach(function(t){var o=t.ipv4.split(".");i[e(o,32)]=t.ipv4}),t.forEach(function(t){t=t.split("/");var o=t[0].split("."),r=e(o,t[1]);for(var s in i)s.slice(0,parseInt(t[1],10))===r&&console.log(i[s])})}function getPersonByDepartmentRegex(e){if(e&&"object"!=typeof e)return console.log("Department regex can not be a string, must be an object");var t=Session.get("projectId"),o=People.find({projectId:t,department:{$regex:e}}).fetch();o.forEach(function(e){console.log("'"+e.principalName+"','"+e.department+"','"+e.emails.join(" ")+"'")}),console.log("returned: "+o.len()+" results")}function getPersonEmail(){var e=Session.get("projectId"),t=People.find({projectId:e}).fetch();t.forEach(function(e){console.log("'"+e.principalName+"','"+e.department+"','"+e.emails.join(" ")+"'")}),console.log("returned: "+t.length+" results")}function greyHostsNoServicesGreen(){var e=Session.get("projectId"),t=Meteor.user().emails[0].address,o=Hosts.find({projectId:e,status:"lair-grey"}).fetch();if("undefined"==typeof o||0===o.length)return void console.log("No hosts found");var i=0;o.forEach(function(e){var o=Services.find({hostId:e._id,port:{$gt:0}}).count();0===o&&(i++,console.log("Updating: "+e.ipv4),Hosts.update({_id:e._id},{$set:{status:"lair-green",last_modified_by:t}}))}),console.log(i+" host(s) updated")}function hostnamesToNessus(){var e=Hosts.find({projectId:Session.get("projectId")}).fetch(),t=[];e.forEach(function(e){var o=e.ipv4;e.hostnames.forEach(function(e){t.push(e+"["+o+"]")})}),t.forEach(function(e){console.log(e)})}function iisOsProfiler(){var e=Session.get("projectId"),t=Services.find({projectId:e,product:{$regex:/IIS\s(httpd\s)?\d+\.\d+/,$options:"i"}}).fetch();t.forEach(function(t){var o=t.product,i=o.match(/\d+\.\d+/);if(null!==i){var r=parseFloat(i[0]);if(!isNaN(r)){var s=Models.os();s.tool="IIS OS Profiler",s.weight=90,6>r?s.fingerprint="Microsoft Windows Server 2000":7>r?s.fingerprint="Microsoft Windows Server 2003":8>r?s.fingerprint="Microsoft Windows Server 2008":9>r?s.fingerprint="Microsoft Windows Server 2012":11>r&&(s.fingerprint="Microsoft Windows Server 2016"),""!==s.fingerprint&&Meteor.call("setOs",e,t.hostId,s.tool,s.fingerprint,s.weight,function(e){e?console.log("Error generating OS for",t.hostId,e):console.log("Created new OS",s.fingerprint,"for",t.hostId)})}}})}function listHostServicesBycolor(e){var t=Session.get("projectId");if(-1===StatusMap.indexOf(e))throw console.log("Lair Supserviceed colors: "+StatusMap),{name:"Wrong color",message:"Provided color: \""+e+"\" is not Lair compliant"};var o=Services.find({projectId:t,status:e}).fetch();o.forEach(function(e){var o=Hosts.findOne({projectId:t,_id:e.hostId});console.log(o.ipv4+":"+e.port+"/"+e.protocol)})}function listHostServicesByServiceRegex(e){var t=Session.get("projectId"),o=Services.find({projectId:t,service:{$regex:e}}).fetch();return 1>o.length?void console.log("No services found"):void o.forEach(function(e){var o=Hosts.findOne({projectId:t,_id:e.hostId});console.log(o.ipv4+":"+e.port+"/"+e.protocol)})}function listHostsByIssueTitle(e){var t=Session.get("projectId"),o=Issues.findOne({projectId:t,title:e}),i="";if(!o)return void console.log("Issue not found");var r=o.hosts;r.forEach(function(e){console.log(e.ipv4+":"+e.port+"/"+e.protocol),i+=e.ipv4+", "}),console.log("RHOSTS: "+i.slice(0,-2))}function listHostsByIssueTitleRegex(e){var t=Session.get("projectId"),o=Issues.find({projectId:t,title:{$regex:e}}).fetch(),i="";return 1>o.length?void console.log("No issues found"):void o.forEach(function(e){console.log(e.title);var t=e.hosts;t.forEach(function(e){console.log(e.ipv4+":"+e.port+"/"+e.protocol),i+=e.ipv4+", "}),console.log("RHOSTS: "+i.slice(0,-2)),i=""})}function listHostByTag(e){var t=Hosts.find({projectId:Session.get("projectId"),tags:e}).fetch();t.forEach(function(e){console.log(e.ipv4)})}function listUnknownOpenServices(e,t){var o=Session.get("projectId"),i=[],r=[],s=[],l=Hosts.find({projectId:o}).fetch();if(l.forEach(function(l){var c=Services.find({projectId:o,hostId:l._id}).fetch();c.forEach(function(t){0<t.port&&("product"===e?"unknown"===t.product.toLowerCase()&&(i.push(l.ipv4),"tcp"===t.protocol?r.push(t.port):"udp"===t.protocol&&s.push(t.port)):"service"===e?"unknown"===t.service.toLowerCase()&&(i.push(l.ipv4),"tcp"===t.protocol?r.push(t.port):"udp"===t.protocol&&s.push(t.port)):"both"==e&&("unknown"===t.service.toLowerCase()||"unknown"===t.product.toLowerCase())&&(i.push(l.ipv4),"tcp"===t.protocol?r.push(t.port):"udp"===t.protocol&&s.push(t.port)))}),"nmap"===t&&(0<r.length&&0<s.length?console.log("nmap -v -sV --version-all -sS -sU "+l.ipv4+" -p T:"+r.toString()+",U:"+s.toString()):0<r.length?console.log("nmap -v -sV --version-all -sS "+l.ipv4+" -p "+r.toString()):0<s.length&&console.log("nmap -v -sV --version-all -sU "+l.ipv4+" -p "+s.toString()),r=[],s=[]),"hostAndPort"===t&&(0<r.length&&r.forEach(function(e){console.log(l.ipv4+":"+e.toString())}),0<s.length&&s.forEach(function(e){console.log(l.ipv4+":"+e.toString())}))}),(0<r.length||0<s.length)&&"list"===t){var c=r.filter(function(e,t){return r.indexOf(e)===t}),n=s.filter(function(e,t){return s.indexOf(e)===t});console.log("Hosts:"),console.log(i.toString()),console.log("TCP Services:"),console.log(c.sort(function(e,t){return e-t}).toString()),console.log("UDP Services:"),console.log(n.sort(function(e,t){return e-t}).toString())}}function mergeDuplicateIssues(){for(var e=Session.get("projectId"),t=Issues.find({projectId:e}).fetch(),o=t.sort((e,t)=>e.title>t.title?1:-1),r=Hosts.find({projectId:e}).fetch(),s=0;s<o.length-1;s++)source=o[s+1],dest=o[s],source.title==dest.title&&source.cvss==dest.cvss&&(console.log("found match: "+dest.title),console.log(source.hosts.length+" hosts to move."),source.notes.forEach(function(t){console.log("Adding Note"),Meteor.call("addIssueNote",e,dest._id,t.title,t.content)}),source.hosts.forEach(function(t){r.forEach(function(o){var i=Services.findOne({projectId:e,hostId:o._id,port:t.port,protocol:t.protocol});o.ipv4==t.ipv4&&null!=i&&(console.log("Added "+t.ipv4+" to "+dest.title),Meteor.call("removeHostFromIssue",e,source._id,t.ipv4,t.port,t.protocol),Meteor.call("addHostToIssue",e,dest._id,t.ipv4,t.port,t.protocol))})}),source.cves.forEach(function(t){dest.cves.includes(t)||(console.log("Adding CVE "+t),Meteor.call("addCVE",e,dest._id,t))}),source.evidence!=dest.evidence&&(dest.evidence+="\n\n"+source.evidence,console.log("Updating Evidence."),Meteor.call("setIssueEvidence",e,dest._id,dest.evidence)),console.log("Removing issue."),Meteor.call("removeIssue",e,source._id))}function mergeIssues(e,t,o,i,r,s,l){function c(e){I.forEach(function(t){Meteor.call("addIssueNote",a,e,t.title,t.content)}),$.forEach(function(t){Meteor.call("addHostToIssue",a,e,t.ipv4,t.port,t.protocol)}),O.forEach(function(t){Meteor.call("addCVE",a,e,t)}),j.forEach(function(t){Meteor.call("addReference",a,e,t.link,t.name)}),n()}function n(){console.log("Removing Issues"),g.forEach(function(e){Meteor.call("removeIssue",a,e._id)})}function d(e){for(var t,o={},r=[],s=0,c=e.length;s<c;++s)t=JSON.stringify(e[s]),o.hasOwnProperty(t)||(o[t]=!0,r.push(e[s]));return r}if("object"!=typeof e)return console.log("Issue regex can not be a string, must be a object");if("string"!=typeof r)return console.log("Invalid title");if("string"!=typeof s)return console.log("Invalid cvss. Variable must be a string");var a=Session.get("projectId"),g=Issues.find({projectId:a,title:{$regex:e},cvss:{$gte:t,$lte:o},"hosts.ipv4":{$regex:i}}).fetch();if(1>g.length)return console.log("Did not find any issues with the given regex");var p=0;if(g.sort(function(e,t){return e.cvss>t.cvss?-1:e.cvss<t.cvss?1:0}),g.forEach(function(e){console.log("CVSS: "+e.cvss+" - Hosts: "+e.hosts.length+" - Title: "+e.title),e.cvss>p&&(p=e.cvss)}),console.log("Total found: "+g.length+" Highest CVSS: "+p),l){"max"===s&&(s=p);var h=Issues.findOne({projectId:a,title:r});"undefined"!=typeof h&&(g.push(h),Meteor.call("removeIssue",a,h._id)),console.log("Going to merge "+g.length+" issues");var f="",v="",u="",I=[],j=[],m=[],E=[],S=[];g.forEach(function(e){f=f+"CVSS: "+e.cvss+" - Hosts: "+e.hosts.length+" - Title: "+e.title+"\n",v="",u="",j=j.concat(e.references),I=I.concat(e.notes),m=m.concat(e.cves),E=E.concat(e.hosts),S=S.concat(e.files)});var $=d(E),O=d(m);return Meteor.call("createIssue",a,r,s,f,u,v,function(e,t){e?(console.log("Error: could not create new Issue",e.message),h&&console.log("Looks like you lost",h.title)):c(t)}),console.log("Complete")}}function getHostList(e){for(var t="",o=0;o<e.hosts.length;o++)t+=e.hosts[o].ipv4+",";return t+"\n"}function mergeIssuesByTitle(e,t,o){function i(e){p.forEach(function(t){Meteor.call("addIssueNote",l,e,t.title,t.content)}),v.forEach(function(t){Meteor.call("addHostToIssue",l,e,t.ipv4,t.port,t.protocol)}),u.forEach(function(t){Meteor.call("addCVE",l,e,t)}),r()}function r(){c.forEach(function(e){Meteor.call("removeIssue",l,e._id)})}function s(e){for(var t,o={},r=[],s=0,c=e.length;s<c;++s)t=JSON.stringify(e[s]),o.hasOwnProperty(t)||(o[t]=!0,r.push(e[s]));return r}if("object"!=typeof e)return console.log("Issue regex can not be a string, must be a object");if("string"!=typeof t)return console.log("Invalid title");if("number"!=typeof o)return console.log("Invalid cvss. Variable must be a number");var l=Session.get("projectId"),c=Issues.find({projectId:l,title:{$regex:e}}).fetch();if(1>c.length)return console.log("Did not find any issues with the given regex");var n=Issues.findOne({projectId:l,title:t});"undefined"!=typeof n&&(c.push(n),Meteor.call("removeIssue",l,n._id)),console.log("Going to merge "+c.length+" issues");var d="",a="",g="",p=[],h=[],f=[];c.forEach(function(e){issue_hosts=getHostList(e),d+="\n\nFrom "+e.title+"\nAffected Hosts: "+issue_hosts+e.description,a+="\n\nFrom "+e.title+"\nAffected Hosts: "+issue_hosts+e.solution,g+="\n\nFrom "+e.title+"\nAffected Hosts: "+issue_hosts+e.evidence,p=p.concat(e.notes),h=h.concat(e.cves),f=f.concat(e.hosts)});var v=s(f),u=s(h);return Meteor.call("createIssue",l,t,o,d,g,a,function(e,t){e?(console.log("Error: could not create new Issue",e.message),n&&console.log("Looks like you lost",n.title)):i(t)}),console.log("Complete")}function negateHostsByCIDR(){function e(e,t){for(var o="00000000",r=parseInt(e[0],10).toString(2),s=r.length>=o.length?r:o.slice(0,o.length-r.length)+r,l=1;l<=e.length;l++)r=parseInt(e[l],10).toString(2),s+=r.length>=o.length?r:o.slice(0,o.length-r.length)+r;return s.slice(0,parseInt(t,10))}var t=Array.prototype.slice.call(arguments,0),o=Hosts.find({projectId:Session.get("projectId")}).fetch(),i={};for(var r in o.forEach(function(t){var o=t.ipv4.split(".");i[e(o,32)]=t.ipv4}),t.forEach(function(t){t=t.split("/");var o=t[0].split("."),r=e(o,t[1]);for(var s in i)s.slice(0,parseInt(t[1],10))===r&&delete i[s]}),i)console.log(i[r])}function niktoHostList(e,t){function o(e,o){var s=Hosts.findOne({projectId:r,_id:e});s.ipv4+":"+o in i||(i[s.ipv4+":"+o]=!0),t&&s.hostnames.forEach(function(e){t.test(e)&&!(e+":"+o in i)&&(i[e+":"+o]=!0)})}if(t&&"object"!=typeof t)return console.log("Domain regex can not be a string, must be an object");var i={},r=Session.get("projectId");for(var s in e.forEach(function(e){var t=[];if("object"==typeof e)t=Services.find({projectId:r,service:{$regex:e}}).fetch(),t.forEach(function(e){o(e.hostId,e.port)});else if("string"==typeof e)for(var l=e.split("-"),c=parseInt(l[0],10);c<=parseInt(l[1],10);c++)t=Services.find({projectId:r,service:c}).fetch(),t.forEach(function(e){o(e.hostId,e.port)});else{var n=Services.findOne({projectId:r,service:e});o(n.hostId,e.port)}}),i)console.log(s)}function niktoTopFindings(e,t){var o={},i=Session.get("projectId"),r=["(.*might be interesting.*)","(.*Public HTTP Methods:.*PUT.*)","(.*[Ww]eb[Dd]av.*)","(.*Directory indexing found.*)","(.*default file found.*)","(.*Server leaks.*IP.*)","(.*OSVDBID:.*)"];0<e.length&&(r=e);var s=Services.find({projectId:i}).fetch();if(s.forEach(function(e){var s=Hosts.findOne({projectId:i,_id:e.hostId});e.notes.forEach(function(e){if(/Nikto/.test(e.title)){var i=e.title.match(/\(.*\)/);if(t){var l=new RegExp(r.join("|")+"\\n","g"),c=e.content.match(l);c&&(!o[s.ipv4+" "+i]&&(o[s.ipv4+" "+i]=[]),o[s.ipv4+" "+i].push(c.join("")))}else console.log(s.ipv4+" "+i),console.log(e.content)}})}),t)for(var l in o)console.log(l),console.log(o[l].join(""))}function NormalizeProtocols(){var e=Session.get("projectId"),t=Meteor.user().emails[0].address,o=Services.find({projectId:e}).fetch();if(1>o.length)return void console.log("No services found");var i=0;o.forEach(function(e){e.protocol!=e.protocol.toLowerCase()&&(Services.update({_id:e._id},{$set:{protocol:e.protocol.toLowerCase(),last_modifiedBy:t}}),i++)}),console.log("Total of "+i+" service(s) updated.")}function NormalizeUnknownProducts(){var e=Session.get("projectId"),t=Meteor.user().emails[0].address,o=Services.find({projectId:e}).fetch();if(1>o.length)return void console.log("No services found");var i=0;o.forEach(function(e){"unknown"==e.product.toLowerCase()&&(Services.update({_id:e._id},{$set:{product:"",last_modifiedBy:t}}),i++)}),console.log("Total of "+i+" service(s) updated.")}function removePort0ServicesNoReference(){var e=Session.get("projectId"),t=[],o=[],i=[],r=Hosts.find({projectId:e}).fetch();r.forEach(function(o){var i=o._id,r=Services.find({projectId:e,hostId:o._id}).fetch();r.forEach(function(e){if(0>=e.port&&1>e.notes){var i={ip:o.ipv4,service:e};t.push(i)}})});var s=Issues.find({projectId:e}).fetch();s.forEach(function(e){e.hosts.forEach(function(e){if(0==e.port)for(var i=0;i<t.length;i++)t[i].ip==e.ipv4&&e.protocol==t[i].service.protocol&&o.push(t[i].service._id)})});for(var l=0;l<t.length;l++){for(var c=0;c<o.length;c++)if(t[l].service._id==o[c])continue;i.push(t[l].service)}console.log("Removing "+i.length+" out of "+t.length+" port 0 services");for(var l=0;l<i.length;l++)console.log("Removing ServiceID: "+i[l]._id),Meteor.call("removeService",e,i[l].hostId,i[l]._id,function(){})}function removeIPBasedHostnames(){var e=Hosts.find({projectId:Session.get("projectId")}).fetch();e.forEach(function(e){var t=e.ipv4,o=[];e.hostnames.forEach(function(e){if(e.includes(t))return void console.log("removing "+e);if(e.includes(t.replace(/\./g,"_")))return void console.log("removing "+e);if(e.includes(t.replace(/\./g,"-")))return void console.log("removing "+e);var i=t.split(".").reverse().join(".");return e.includes(i)?void console.log("removing "+e):e.includes(i.replace(/\./g,"_"))?void console.log("removing "+e):e.includes(i.replace(/\./g,"-"))?void console.log("removing "+e):void o.push(e)}),Hosts.update({_id:e._id},{$set:{hostnames:o,lastModifiedBy:Meteor.user().emails[0].address}})})}function removeHostnamesByPattern(e){var t=Hosts.find({projectId:Session.get("projectId")}).fetch();t.forEach(function(t){var o=[];t.hostnames.forEach(function(t){return t.includes(e)?void console.log("removing "+t):void o.push(t)}),Hosts.update({_id:t._id},{$set:{hostnames:o,lastModifiedBy:Meteor.user().emails[0].address}})})}function searchServiceNoteContent(e,t){var o=Session.get("projectId"),i=new RegExp(e,"i"),r=new RegExp(t,"g"),s=[],l=Services.find({projectId:o,notes:{$elemMatch:{title:{$regex:e,$options:"i"}}}},{notes:1,hostId:1}).fetch();l.forEach(function(e){e.notes.forEach(function(e){i.test(e.title)&&s.push.apply(s,e.content.match(r))})}),console.log(function(e){for(var t={},o=[],r=0,s=e.length;r<s;++r)t.hasOwnProperty(e[r])||(o.push(e[r]),t[e[r]]=1);return o}(s).join("\n"))}function servicesToColorByHosts(e,t,o){var i=Session.get("projectId"),r=Meteor.user().emails[0].address,s=0,l={"lair-red":4,"lair-orange":3,"lair-blue":2,"lair-green":0,"lair-grey":0};if(-1===StatusMap.indexOf(o))throw console.log("Lair Supserviceed colors: "+StatusMap),{name:"Wrong Color",message:"Provided color: \""+o+"\" is not Lair compliant"};e.forEach(function(e){var r=Hosts.findOne({projectId:i,ipv4:e}),c=Services.find({hostId:r._id,port:t}).fetch();1>c.length||c.forEach(function(t){console.log("Updating: "+e+":"+t.port+"/"+t.protocol),Meteor.call("setPortStatus",i,t._id,o),l[o]>l[r.status]&&(console.log("Updating: "+e+" status \""+o+"\""),Meteor.call("setHostStatus",i,r._id,o)),s++})}),console.log(s+" service(s) updated")}function setGlobalServiceByPort(e,t,o){var i=Session.get("projectId"),r=Services.find({projectId:i,port:e,protocol:t,service:{$ne:o}});r.forEach(function(e){Meteor.call("setServiceService",i,e._id,o,function(e){e||console.log("Modified service successfully")})})}function setHostOsByOsRegex(e,t,o){var i=Session.get("projectId"),r=Hosts.find({projectId:i,"os.fingerprint":{$regex:e}}).fetch();return 1>r.length?void console.log("No hosts found"):void r.forEach(function(e){Meteor.call("setOs",i,e._id,"Manual",t,o,function(t){return t?void console.log("Unable to update host "+e.ipv4):void console.log("Updated host "+e.ipv4)})})}function setHostServiceByPort(e,t,o,i){var r=Session.get("projectId"),e=Hosts.findOne({projectId:r,ipv4:e}),s=Services.find({projectId:r,hostId:e._id,port:{$in:t},protocol:o,service:{$ne:i}});s.forEach(function(e){Meteor.call("setServiceService",r,e._id,i,function(e){e||console.log("Modified service successfully")})})}function tagHostsByCIDR(e,t){function o(e,t){return check(e,Matchers.isObjectId),check(t,Matchers.isNonEmptyString),Hosts.update({_id:e},{$addToSet:{tags:t},$set:{lastModifiedBy:Meteor.user().emails[0].address}})}function i(e,t){for(var o="00000000",r=parseInt(e[0],10).toString(2),s=r.length>=o.length?r:o.slice(0,o.length-r.length)+r,l=1;l<=e.length;l++)r=parseInt(e[l],10).toString(2),s+=r.length>=o.length?r:o.slice(0,o.length-r.length)+r;return s.slice(0,parseInt(t,10))}var r=Hosts.find({projectId:Session.get("projectId")}).fetch(),s={};r.forEach(function(e){var t=e.ipv4.split(".");s[i(t,32)]=e}),cidr=t.split("/");var t=cidr[0].split("."),l=i(t,cidr[1]);for(var c in s)c.slice(0,parseInt(cidr[1],10))===l&&(o(s[c]._id,e),console.log(s[c]._id,e))}function uniqueServicesByHostsCIDR(){function e(e,t){for(var o="00000000",r=parseInt(e[0],10).toString(2),s=r.length>=o.length?r:o.slice(0,o.length-r.length)+r,l=1;l<=e.length;l++)r=parseInt(e[l],10).toString(2),s+=r.length>=o.length?r:o.slice(0,o.length-r.length)+r;return s.slice(0,parseInt(t,10))}var t=Session.get("projectId"),o=Array.prototype.slice.call(arguments,0),i=Hosts.find({projectId:t}).fetch(),r={},s={},l=[];i.forEach(function(t){var o=t.ipv4.split(".");r[e(o,32)]=t.ipv4,s[t.ipv4]=t._id}),o.forEach(function(t){t=t.split("/");var o=t[0].split("."),i=e(o,t[1]);for(var c in r)c.slice(0,parseInt(t[1],10))===i&&l.push(s[r[c]])});var c=Services.find({projectId:t,hostId:{$in:l}}).fetch();return _.uniq(_.pluck(c,"port")).sort(function(e,t){return e-t}).join(",")}/* eslint-disable no-unused-vars */
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
/* globals Meteor Session Services */
function mergeDuplicateIssues(){
	// Iterates through all issues and finds duplicate issues. It then merges them into the first and deletes the second.
	// CAUTION: This is VERY slow
	//
	// Created By: Brook Keele
	// Usage: mergeDuplicateIssues()
	// Requires client-side updates: true
	
	var projectId = Session.get('projectId')

	var issues = Issues.find({
		'projectId': projectId
	}).fetch()

	var sortedIssues = issues.sort((a, b) => (a.title > b.title) ? 1 : -1)

	var hosts = Hosts.find({
		'projectId': projectId
	}).fetch()

	for (var i = 0; i < sortedIssues.length-1; i++) {	
		source = sortedIssues[i+1]
		dest = sortedIssues[i]
		if (source.title == dest.title && source.cvss == dest.cvss) {
			console.log("found match: " + dest.title)
			console.log(source.hosts.length + " hosts to move.")
			source.notes.forEach(function (note) {
				console.log("Adding Note")
				Meteor.call('addIssueNote', projectId, dest._id, note.title, note.content)
			})
			source.hosts.forEach(function (host) {
				hosts.forEach(function (projectHost) {
					var serviceMatch = Services.findOne({
						'projectId': projectId,
						'hostId': projectHost._id,
						'port': host.port,
						'protocol': host.protocol
					})
					if (projectHost.ipv4 == host.ipv4 && serviceMatch != null) {
						console.log("Added " + host.ipv4 + " to " + dest.title)
						Meteor.call('removeHostFromIssue', projectId, source._id, host.ipv4, host.port, host.protocol)
						Meteor.call('addHostToIssue', projectId, dest._id, host.ipv4, host.port, host.protocol)
					}
				})
			})
			source.cves.forEach(function (cve) {
				if (!dest.cves.includes(cve)) {
					console.log("Adding CVE " + cve)
					Meteor.call('addCVE', projectId, dest._id, cve)
				}
			})
			if (source.evidence != dest.evidence) {
				dest.evidence += "\n\n" + source.evidence
				console.log("Updating Evidence.")
				Meteor.call('setIssueEvidence', projectId, dest._id, dest.evidence)
			}
			console.log("Removing issue.")
			Meteor.call('removeIssue', projectId, source._id)
		}
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
  }function searchServiceNoteContent (noteRegex, searchString) {
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
