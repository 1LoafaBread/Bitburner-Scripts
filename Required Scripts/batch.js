export async function main(ns) {
    var serverToAttack = ns.args[0];

    await ns.weaken(serverToAttack);
    await ns.grow(serverToAttack);
    await ns.weaken(serverToAttack);
    await ns.hack(serverToAttack);
}
