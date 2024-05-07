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

    async function attackServer(serverToAttack) {
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
                
                await ns.scp(`${attackType}.js`, server);
                await ns.exec(`${attackType}.js`, server, maxThreads, serverToAttack, "all");
                
                totalThreads += maxThreads;
            } else {
                ns.tprint(`Not enough RAM for server: ${server}`);
            }

            await ns.sleep(500);
        }
        
        ns.tprint(`Total Threads Started: ${totalThreads}`);

        await waitTime(serverToAttack);
    }

    async function waitTime(server) {
        for (var i = 0; i < waitTimeMs; i++) {
            await ns.sleep(1000);

            if (attackType == "grow") {
                var percentage = (ns.getServerMoneyAvailable(server) / ns.getServerMaxMoney(server)) * 100;

                if (percentage == 100) {
                    ns.tprint(`Server '${server}' Reached Max Money Cap.`)
                    break;
                }
            } else if (attackType == "weaken") {
                if (ns.getServerSecurityLevel(server) == ns.getServerMinSecurityLevel(server)) {
                    ns.tprint(`${ns.getHostname()} :: Server '${server}' Reached Lowest Security Level.`);
                    break;
                }
            } else {
                if (ns.getServerMoneyAvailable(server) < ns.getServerMaxMoney(server) * 0.01) {
                    ns.tprint(`${ns.getHostname()} :: Insufficient Money on '${server}'.`);
                    break;
                }
            }
        }

        for (const server of visitedServers) {
            ns.scriptKill(`${attackType}.js`, server);
        }

        await ns.sleep(2000);
    }

    const visitedServers = new Set();
    var attackType = ns.args[0]
    var waitTimeMs = ns.args[1]

    await scanServers(ns.scan(ns.getHostname()), visitedServers);

    for (const server of visitedServers) {
        ns.tprint("")

        if (attackType == "grow") {
            var percentage = (ns.getServerMoneyAvailable(server) / ns.getServerMaxMoney(server)) * 100;
            ns.tprint(`Server '${server}' is currently ${percentage}% full at $${ns.getServerMoneyAvailable(server)}. (Max: $${ns.getServerMaxMoney(server)})`)

            if (percentage != 100) {
                ns.tprint("")
                
                await attackServer(server);
                totalThreads = 0;
            } else {
                ns.tprint(`Server '${server}' is already at it's max money cap.`)
            }
        } else if (attackType == "weaken") {
            ns.tprint(`Server '${server}' is currently at a security level of ${ns.getServerSecurityLevel(server)} (Min: ${ns.getServerMinSecurityLevel(server)})`)

            if (ns.getServerSecurityLevel(server) != ns.getServerMinSecurityLevel(server)) {
                ns.tprint("")

                await attackServer(server);
                totalThreads = 0;
            } else {
                ns.tprint(`Server '${server}' is already at it's lowest security level.`)
            }
        } else {
            var maxMoney = ns.getServerMaxMoney(server);
            var newMoney = ns.getServerMoneyAvailable(server);
            var percentage = (newMoney / maxMoney) * 100;

            ns.tprint(`Server '${server}' is currently at ${percentage.toFixed(2)}% of it's max money cap.`)

            if (ns.getServerMoneyAvailable(server) > ns.getServerMaxMoney(server) * 0.01) {
                ns.tprint("")

                await attackServer(server);
                totalThreads = 0;
            } else {
                var maxMoney = ns.getServerMaxMoney(server);
                var newMoney = ns.getServerMoneyAvailable(server);
                var percentage = (newMoney / maxMoney) * 100;

                ns.tprint(`Server '${server}' has insufficient money available to hack.`)
            }
        }

        ns.tprint("")
        await ns.sleep(1000)
    }
}
