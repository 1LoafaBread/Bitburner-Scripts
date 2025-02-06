export async function main(ns) {
    async function purchaseServers(ramAmount, amtToPurchase) {
        var amtLeftToPurchase = 25 - ns.getPurchasedServers();
        if (amtToPurchase > amtLeftToPurchase) {
            amtToPurchase = amtLeftToPurchase;
        }

        var serverNumber = 1;
        while (ns.serverExists(`Server${serverNumber}`)) {
            serverNumber++;
        }

        for (var i = 1; i <= amtToPurchase; i++) {
            ns.purchaseServer(`Server${serverNumber}`, ramAmount);
            ns.tprint(`Purchased Server With Hostname: Server${serverNumber}`);
            serverNumber++;
        }
        ns.tprint(`Purchased ${amtToPurchase} Servers for \$${((55000 * ramAmount) * amtCanPurchase).toLocaleString()}`)
    }
    async function deleteServers() {
        var serverList = ns.getPurchasedServers();

        for (var i = 0; i < serverList.length; i++) {
            var server = serverList[i];
            ns.deleteServer(server);
            ns.tprint(`Deleted Server With Hostname: ${server}`);
        }
    }

    var manageServers = ns.args[0];
    var ramAmount = ns.args[1];
    var test = ns.args[2];

    var amtCanPurchase = (ns.getServerMoneyAvailable("home") / (55000 * ramAmount)).toFixed(0);

    if (amtCanPurchase > 25) {
        amtCanPurchase = 25;
    }

    if (manageServers == "purchase") {
        if (test == "test") {            
            ns.tprint(`You can purchase ${amtCanPurchase} servers with ${ramAmount}GB of RAM for ${((55000 * ramAmount) * amtCanPurchase).toLocaleString()}.`)
        } else {
            await purchaseServers(ramAmount, amtCanPurchase);
        }
    } else if (manageServers == "delete") {
        await deleteServers();
    } else {
        ns.tprint(`Unknown Severs Management: ${manageServers}`);
    }
}
