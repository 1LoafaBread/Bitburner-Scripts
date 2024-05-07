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

    async function attackServers(visitedServers) {
        for (const serverToAttack of visitedServers) {
            var totalThreads = 0;
            
            for (const server of visitedServers) {
                let maxThreads;
                maxThreads = Math.floor(ns.getServerMaxRam(server) / ns.getScriptRam("batch.js"));

                ns.tprint(`${server} :: Batch Targeting Server '${serverToAttack}' With ${maxThreads} Threads.`);

                if (maxThreads > 0) {
                    await ns.scp("batch.js", server);
                    await ns.exec("batch.js", server, maxThreads, serverToAttack, "walk");
                    
                    totalThreads += maxThreads;
                } else {
                    ns.tprint(`Not enough RAM for server: ${server}`);
                }

                await ns.sleep(500);
            }
            
            ns.tprint(`Total Threads Started: ${totalThreads}`);

            await waitLoop(visitedServers);
        }
    }

    async function waitLoop(visitedServers) {
        var jsRunning = false;

        while (true) {
            jsRunning = false;

            for (const server of visitedServers) {
                if (ns.ps(server).length > 0) {
                    jsRunning = true;
                    break;
                }
            }

            if (!jsRunning) {
                break;
            }

            await ns.sleep(1000);
        }
    }

    const visitedServers = new Set();

    await scanServers(ns.scan(ns.getHostname()), visitedServers);
    await attackServers(visitedServers);

    ns.tprint("Batch Walk Targeting Complete.")
}
