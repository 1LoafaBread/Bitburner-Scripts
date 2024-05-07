export async function main(ns) {
    async function scanServers(serverList, visitedServers) {
        for (var i = 0; i < serverList.length; i++) {
            var server = serverList[i];
            
            if (visitedServers.includes(server)) {
                continue;
            }

            visitedServers.push(server);

            if (ns.hasRootAccess(server)) {
                ns.killall(server);

                var subServers = ns.scan(server);
                await scanServers(subServers, visitedServers);
            }
        }
    }

    var visitedServers = [];

    await scanServers(ns.scan(ns.getHostname()), visitedServers);
}
