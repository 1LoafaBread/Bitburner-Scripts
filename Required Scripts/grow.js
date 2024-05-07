export async function main(ns) {
    var server = ns.args[0];
    var type = ns.args[1];

    async function growServer(server) {
        var maxMoney = ns.getServerMaxMoney(server);

        var growAmount = await ns.grow(server);
        growAmount -= 1;
        
        var newMoney = ns.getServerMoneyAvailable(server);
        var percentage = (newMoney / maxMoney) * 100;

        ns.tprint(`${ns.getHostname()} :: Grew Server '${server}' by ${growAmount.toFixed(6)}% (${percentage.toFixed(2)}% Full).`);

        await ns.sleep(2000);
    }

    if (type == "all") {
        while (true) {
            if (currentMoney < maxMoney) {
                await growServer(server);
            } else {
                ns.tprint(`${ns.getHostname()} :: Money Cap Reached on Server '${server}'.`);
                break;
            }
        }
    } else if (type == "walk") {
        await growServer(server);
    } else {
        ns.tprint(`Unknown Type: ${type}`);
    }
}
