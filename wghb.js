export async function main(ns) {
    function getFormattedTime() {
        const date = new Date();
        return `${date.toLocaleTimeString()}`;
    }

    async function getExecServers(serverList, execServers) {
        for (const server of serverList) {
            if (!execServers.includes(server) && ns.hasRootAccess(server) && server !== "CSEC") {
                execServers.push(server);
                const subServers = ns.scan(server);
                await getExecServers(subServers, execServers);
            }
        }
        return execServers;
    }

    async function getTargetServers(serverList, targetServers) {
        for (const server of serverList) {
            if (targetServers.includes(server)) {
                continue;
            }

            if (ns.hasRootAccess(server) && server !== "home" && server !== ns.getHostname() && server !== "CSEC" && !ns.getPurchasedServers().includes(server) && server !== "darkweb") {
                targetServers.push(server);
                const subServers = ns.scan(server);
                await getTargetServers(subServers, targetServers);
            }
        }
        return targetServers;
    }

    async function attackServers(execServers, targetServers, attackType) {
        for (const serverToAttack of targetServers) {
            ns.tprint(`\n\x1b[32m[${getFormattedTime()}] -- Targeting Server: ${serverToAttack}\x1b[0m`);

            const attackSequence = attackType === "batch" ? ["weaken", "grow", "weaken", "hack"] : [attackType];

            for (const batchAttackType of attackSequence) {
                const preServerMoneyAvailable = ns.getServerMoneyAvailable(serverToAttack);
                const preServerSecurityLevel = ns.getServerSecurityLevel(serverToAttack);

                if (batchAttackType === "weaken" && preServerSecurityLevel <= ns.getServerMinSecurityLevel(serverToAttack)) {
                    ns.tprint(`\x1b[33m[${getFormattedTime()}] Server at lowest security level, skipping weaken.\x1b[0m`);
                    continue;
                } else if (batchAttackType === "grow" && preServerMoneyAvailable >= ns.getServerMaxMoney(serverToAttack)) {
                    ns.tprint(`\x1b[33m[${getFormattedTime()}] Server at max money available, skipping grow.\x1b[0m`);
                    continue;
                }

                const promises = execServers.map(async (serverToExec) => {
                    const scriptName = `${batchAttackType}.js`;

                    const availableRam = ns.getServerMaxRam(serverToExec) - ns.getServerUsedRam(serverToExec);
                    const numThreads = Math.floor(availableRam / ns.getScriptRam(scriptName));

                    if (numThreads > 0) {
                        await ns.scp(scriptName, serverToExec);
                        const pid = ns.exec(scriptName, serverToExec, numThreads, serverToAttack);
                        if (pid === 0) {
                            ns.tprint(`\x1b[31m[${getFormattedTime()}] Failed to execute ${scriptName} on ${serverToExec}!\x1b[0m`);
                        }
                        return numThreads;
                    }
                    return 0;
                });

                const results = await Promise.all(promises);
                const totalThreads = results.reduce((sum, threads) => sum + threads, 0);

                if (batchAttackType === "hack") {
                    ns.tprint(`\x1b[36m[${getFormattedTime()}] Hacking Server With ${totalThreads} Total Threads.\x1b[0m`);
                } else if (batchAttackType === "weaken") {
                    ns.tprint(`\x1b[36m[${getFormattedTime()}] Weakening Server With ${totalThreads} Total Threads.\x1b[0m`);
                } else if (batchAttackType === "grow") {
                    ns.tprint(`\x1b[36m[${getFormattedTime()}] Growing Server With ${totalThreads} Total Threads.\x1b[0m`);
                }

                await waitLoop(execServers);

                const postServerMoneyChange = ns.getServerMoneyAvailable(serverToAttack) - preServerMoneyAvailable;
                const postServerSecurityChange = (ns.getServerSecurityLevel(serverToAttack) - preServerSecurityLevel).toFixed(3);

                ns.tprint(`|| -- Security Level Change: ${postServerSecurityChange > 0 ? "+" : ""}${postServerSecurityChange}`);
                if (batchAttackType !== "weaken") {
                    ns.tprint(`|| -- Money Change: ${postServerMoneyChange > 0 ? "+" : ""}${postServerMoneyChange.toLocaleString()}`);
                }
            }
        }

        ns.tprint(`\n\x1b[32m=== Attack Completed ===\x1b[0m`);
    }

    async function waitLoop(execServers) {
        while (true) {
            let anyRunning = false;
            const purchasedServers = ns.getPurchasedServers();
            const isBreadOnly = execServers.length === purchasedServers.length && execServers.every((server, idx) => server === purchasedServers[idx]);

            if (isBreadOnly) {
                anyRunning = execServers.some(server => ns.ps(server).length > 0);
            } else {
                anyRunning = execServers.some(server => ns.ps(server).length > 1);
            }

            if (!anyRunning) break;
            await ns.sleep(1000);
        }
    }

    const attackType = ns.args[0];
    const mode = ns.args[1];
    const serverToAttack = ns.args[2] || null;
    const ownedServersOnly = ns.args[3] || null;

    if (!["weaken", "grow", "hack", "batch"].includes(attackType) || !["walk", "target"].includes(mode)) {
        ns.tprint(`Usage: wghb.js [weaken/grow/hack/batch] [walk/target] [if target then targetServer]`);
        return;
    }

    if (mode === "walk") {
        const targetServers = await getTargetServers(ns.scan(ns.getHostname()), []);

        if (serverToAttack === "owned") {
            await attackServers(ns.getPurchasedServers(), targetServers, attackType);
        } else {
            const execServers = await getExecServers(ns.scan(ns.getHostname()), []);
            await attackServers(execServers, targetServers, attackType);
        }
    } else if (mode === "target") {
        if (!serverToAttack) {
            ns.tprint("You must specify a target server in target mode.");
            return;
        }
        const execServers = await getExecServers(ns.scan(ns.getHostname()), []);

        if (ownedServersOnly === "owned") {
            await attackServers(ns.getPurchasedServers(), [serverToAttack], attackType);
        } else {
            await attackServers(execServers, [serverToAttack], attackType);
        }
    }

    ns.tprint("\x1b[32mProcess Complete.\x1b[0m");
}
