export async function main(ns) {
    var server = ns.args[0];
    await ns.hack(server);
}
