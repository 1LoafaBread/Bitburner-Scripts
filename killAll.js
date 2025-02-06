export async function main(ns) {
    async function killAllScrips(serverList, serversList) {
        for (var i = 0; i < serverList.length; i++) {
            var server = serverList[i];
            
            if (serversList.includes(server)) {
                continue;
            }

            serversList.push(server);

            if (ns.hasRootAccess(server)) {
                ns.killall(server);

                var subServers = ns.scan(server);
                await killAllScrips(subServers, serversList);
            }
        }
    }

    var serversList = [];

    await killAllScrips(ns.scan(ns.getHostname()), serversList);

    ns.tprint(`Killed All Running Scripts.`)
}
