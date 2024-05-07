export async function main(ns) {
    var server = ns.args[0];
    var type = ns.args[1];

    async function hackServer(server) {
        var weakenAmount = await ns.weaken(server);

        ns.tprint(`${ns.getHostname()} :: Weakened Server '${server}' Security Level By ${weakenAmount.toFixed(3)} (Current Security LVL: ${ns.getServerSecurityLevel(serverToAttack).toFixed(3)}) (Min: ${ns.getServerMinSecurityLevel(serverToAttack)})`);
        
        if (ns.getServerSecurityLevel(server) == ns.getServerMinSecurityLevel(server)) {
            ns.tprint(`${ns.getHostname()} :: Server '${server}' Reached Lowest Security Level.`);
        }
        
        await ns.sleep(2000);
    }

    if (type == "all") {
        while (true) {
            if (ns.getServerMoneyAvailable(server) > ns.getServerMaxMoney(server) * 0.01) {
                await hackServer(server);
            } else {
                ns.tprint(`${ns.getHostname()} :: Insufficient Money on '${server}'.`);
                break;
            }
        }
    } else if (type == "walk") {
        await hackServer(server);
    } else {
        ns.tprint(`Unknown Type: ${type}`);
    }
}
