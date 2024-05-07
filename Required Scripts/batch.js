export async function main(ns) {
    var serverToAttack = ns.args[0];
    var batchTargetType = ns.args[1];

    async function weakenServer() {
        if (ns.getServerSecurityLevel(serverToAttack) != ns.getServerMinSecurityLevel(serverToAttack)) {
            var weakenAmount = await ns.weaken(serverToAttack);
            weakenAmount += await ns.weaken(serverToAttack);

            ns.tprint(`${ns.getHostname()} :: Weakened Server '${serverToAttack}' Security Level By ${weakenAmount.toFixed(3)} (Current Security LVL: ${ns.getServerSecurityLevel(serverToAttack).toFixed(3)}) (Min: ${ns.getServerMinSecurityLevel(serverToAttack)})`);
        }
    }

    async function growServer() {
        var maxMoney = ns.getServerMaxMoney(serverToAttack);

        var growAmount = await ns.grow(serverToAttack);
        growAmount += await ns.grow(serverToAttack);
        
        var newMoney = ns.getServerMoneyAvailable(serverToAttack);
        var percentage = (newMoney / maxMoney) * 100;

        if (percentage < 0) {
            growAmount = ((growAmount - 1) * 100).toFixed(6)
        } else {
            growAmount = (growAmount * 100).toFixed(6)
        }

        ns.tprint(`${ns.getHostname()} :: Grew Server '${serverToAttack}' by ${growAmount}% (${percentage.toFixed(2)}% Full).`);
    }

    async function hackServer() {
        var hackAmount = await ns.hack(serverToAttack);
        
        var maxMoney = ns.getServerMaxMoney(serverToAttack);
        var newMoney = ns.getServerMoneyAvailable(serverToAttack);
        var percentage = (newMoney / maxMoney) * 100;

        if (hackAmount) {
            ns.tprint(`${ns.getHostname()} :: Hack Success on '${serverToAttack}'. ($${hackAmount.toFixed(2)} Gained) (${percentage.toFixed(2)}% Left).`);
        } else {
            ns.tprint(`${ns.getHostname()} :: Hack Failed on '${serverToAttack}'.`);
        }
    }

    if (batchTargetType == "all") {
        while (true) {
            await weakenServer();
            await growServer();
            await hackServer();
        }
    } else if (batchTargetType == "walk") {
        await weakenServer();
        await growServer();
        await hackServer();
    } else {
        ns.tprint(`Unknown Batch Target Type: ${batchTargetType}`);
    }
}
