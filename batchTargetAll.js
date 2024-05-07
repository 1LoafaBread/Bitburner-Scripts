export async function main(ns) {
    async function scanServers(serverList, visitedServers) {
        for (const server of serverList) {
            if (visitedServers.has(server)) {
                continue;
            }

            if (ns.hasRootAccess(server) && server !== "home" && server !== ns.getHostname() && server !== "CSEC") {
                visitedServers.add(server);

                const subServers = ns.scan(server);
                await scanServers(subServers, visitedServers);
            }
        }
    }

    async function attackServer(serverToAttack) {
        var totalThreads = 0;
        
        for (const server of visitedServers) {
            let maxThreads;
            maxThreads = Math.floor(ns.getServerMaxRam(server) / ns.getScriptRam("batch.js"));

            ns.tprint(`${server} :: Batch Targeting Server '${serverToAttack}' With ${maxThreads} Threads.`);

            if (maxThreads > 0) {
                await ns.scp("batch.js", server);
                await ns.exec("batch.js", server, maxThreads, serverToAttack, "all");
                
                totalThreads += maxThreads;
            } else {
                ns.tprint(`Not enough RAM for server: ${server}`);
            }

            await ns.sleep(500);
        }
        
        ns.tprint(`Total Threads Started: ${totalThreads}`);
    }

    const visitedServers = new Set();
    var serverToAttack = ns.args[0];

    await scanServers(ns.scan(ns.getHostname()), visitedServers);
    await attackServer(serverToAttack)
}
