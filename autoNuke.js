export async function main(ns) {
    async function scanServers(serverList, visitedServers) {
        for (const server of serverList) {
            if (visitedServers.has(server)) {
                continue;
            }

            if (!ns.hasRootAccess(server)) {
                serversNoRootAccess.add(server);
            }

            if (ns.hasRootAccess(server) && server !== "home" && server !== ns.getHostname()) {
                visitedServers.add(server);

                const subServers = ns.scan(server);
                await scanServers(subServers, visitedServers);
            }
        }
    }

    async function checkCanHackServer(server) {
        const playerHackingLevel = ns.getHackingLevel();
        const serverHackingLevel = ns.getServerRequiredHackingLevel(server);
        var ableToHack = false;

        if (serverHackingLevel <= playerHackingLevel) {
            var openPortsRequired = ns.getServerNumPortsRequired(server);

            if (openPortsRequired >= 5) {
                if (ns.fileExists("BruteSSH.exe", "home") && ns.fileExists("FTPCrack.exe", "home") && ns.fileExists("relaySMTP.exe", "home") && ns.fileExists("HTTPWorm.exe", "home") && ns.fileExists("SQLInject.exe", "home")) {
                    ableToHack = true;
                }
            } else if (openPortsRequired >= 4) {
                if (ns.fileExists("BruteSSH.exe", "home") && ns.fileExists("FTPCrack.exe", "home") && ns.fileExists("relaySMTP.exe", "home") && ns.fileExists("HTTPWorm.exe", "home")) {
                    ableToHack = true;
                }
            } else if (openPortsRequired >= 3) {
                if (ns.fileExists("BruteSSH.exe", "home") && ns.fileExists("FTPCrack.exe", "home") && ns.fileExists("relaySMTP.exe", "home")) {
                    ableToHack = true;
                }
            } else if (openPortsRequired >= 2) {
                if (ns.fileExists("BruteSSH.exe", "home") && ns.fileExists("FTPCrack.exe", "home")) {
                    ableToHack = true;
                }
            } else if (openPortsRequired >= 1) {
                if (ns.fileExists("BruteSSH.exe", "home")) {
                    ableToHack = true;
                }
            } else {
                ableToHack = true;
            }
        }

        return ableToHack;
    }

    function hackServer(server) {
        var openPortsRequired = ns.getServerNumPortsRequired(server);

        if (openPortsRequired >= 5) {
            ns.brutessh(server);
            ns.ftpcrack(server);
            ns.relaysmtp(server);
            ns.httpworm(server);
            ns.sqlinject(server);
        } else if (openPortsRequired >= 4) {
            ns.brutessh(server);
            ns.ftpcrack(server);
            ns.relaysmtp(server);
            ns.httpworm(server);
        } else if (openPortsRequired >= 3) {
            ns.brutessh(server);
            ns.ftpcrack(server);
            ns.relaysmtp(server);
        } else if (openPortsRequired >= 2) {
            ns.brutessh(server);
            ns.ftpcrack(server);
        } else if (openPortsRequired >= 1) {
            ns.brutessh(server);
        }

        ns.nuke(server);

        if (ns.hasRootAccess(server)) {
            ns.tprint(`Gained Root Access on Server: ${server} (Required Hack LvL: ${ns.getServerRequiredHackingLevel(server)}) (Required Open Ports: ${ns.getServerNumPortsRequired(server)})`)
        } else {
            ns.tprint(`Failed to Gain Root Access on Server: ${server} (Required Hack LvL: ${ns.getServerRequiredHackingLevel(server)}) (Required Open Ports: ${ns.getServerNumPortsRequired(server)})`)
        }
    }

    const visitedServers = new Set();
    const serversNoRootAccess = new Set();

    await scanServers(ns.scan(ns.getHostname()), visitedServers);

    for (const server of serversNoRootAccess) {
        if (await checkCanHackServer(server)) {
            await hackServer(server)
        } else {
            ns.tprint(`Not all requirements have been met to NUKE: ${server} (Required Hack LvL: ${ns.getServerRequiredHackingLevel(server)}) (Required Open Ports: ${ns.getServerNumPortsRequired(server)})`)
        }
    }
}
