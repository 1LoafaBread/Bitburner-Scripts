export async function main(ns) {
    var server = ns.args[0];
    var type = ns.args[1];

    async function hackServer(server) {
        var preMoney = ns.getServerMoneyAvailable(server);
        var hackSuccess = await ns.hack(server);
        var moneyGained = preMoney - ns.getServerMoneyAvailable(server);

        var maxMoney = ns.getServerMaxMoney(server);
        var newMoney = ns.getServerMoneyAvailable(server);
        var percentage = (newMoney / maxMoney) * 100;

        if (hackSuccess) {
            ns.tprint(`${ns.getHostname()} :: Hack Success on '${server}'! ($${moneyGained.toFixed(2)} Gained) (${percentage.toFixed(2)}% Left).`);
        } else {
            ns.tprint(`${ns.getHostname()} :: Hack Failed on '${server}'.`);
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
