var totalThreads = 0;

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

    async function attackServer(serverToAttack, attackType) {
        for (const server of visitedServers) {
            let maxThreads;
            
            if (attackType == "grow") {
                maxThreads = Math.floor(ns.getServerMaxRam(server) / ns.getScriptRam("grow.js"));
            } else if (attackType == "hack") {
                maxThreads = Math.floor(ns.getServerMaxRam(server) / ns.getScriptRam("hack.js"));
            } else {
                maxThreads = Math.floor(ns.getServerMaxRam(server) / ns.getScriptRam("weaken.js"));
            }

            if (maxThreads > 0) {
                ns.tprint(`${server} :: ${attackType === "grow" ? "Growing" : attackType === "hack" ? "Hacking" : "Weakening"} Server ${serverToAttack} With ${maxThreads} Threads.`);
                
                await Promise.all([
                    ns.scp(`${attackType}.js`, server),
                    ns.exec(`${attackType}.js`, server, maxThreads, serverToAttack, "all"),
                ]);

                totalThreads += maxThreads;
            } else {
                ns.tprint(`Not enough RAM for server: ${server}`);
            }

            await ns.sleep(500);
        }
    }

    const visitedServers = new Set();
    const attackType = ns.args[0];
    const serverToAttack = ns.args[1]

    var currentMoney = ns.getServerMoneyAvailable(serverToAttack);
    var maxMoney = ns.getServerMaxMoney(serverToAttack);
        
    if (currentMoney < maxMoney) {
        if (ns.getServerSecurityLevel(serverToAttack) >= Math.max(ns.getServerBaseSecurityLevel(serverToAttack))) {
            if (attackType === "weaken" || attackType === "grow" || attackType === "hack") {
                await scanServers(ns.scan(ns.getHostname()), visitedServers);

                await attackServer(serverToAttack, attackType);

                ns.tprint(`Total Threads Started: ${totalThreads}`);
            } else {
                ns.tprint(`Unknown Attack Type: ${attackType}`);
            }
        } else {
            ns.tprint(`Server ${serverToAttack} already at lowest security level.`);
        }
    } else {
        ns.tprint(`Server ${serverToAttack} already at max money cap.`);
    }
}
