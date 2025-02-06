# Bitburner-Scripts

This repository contains a collection of useful scripts for Bitburner NS2 that I've developed. These scripts are designed to enhance your gameplay experience and automate various tasks within the game.

## How to Support

If you find these scripts helpful and would like to support my work, cryptocurrency donations are greatly appreciated:

- PayPal: https://www.paypal.com/paypalme/1loafofbread
- Bitcoin (BTC): 14YfYXJJqDpwp3rHghhr7cuiihgvEdSBV6
- Ethereum (ETH): 0x53678F8f4966ADeD487e4826e69eF11aaedc4a43
- Solana (SOL): 7bSAFtxLPmjHkW5Ej7pqMN7Zr6u7HF7CDFWdmjEYSuUq
- Doge (DOGE): D8naE2zceDgeobUJvfWtP514HVXEvopvuj
- Litecoin (LTC): LTCvkusSZoDCxMzKkFXkkkiRi83MzfBXYU
- Monero (XMR): 41pKAT2XGafTQqasEYSw2XNJCwfsuLWPsRCkdxeinfRU2rvPQ6XGsxqRnBKUYPhrhvSoGF721Qb9Bimf7eS4vuPTPVoJdbY
- Ravencoin (RVN): RUWVDYqTby2PaNhrXpjoBevwyi6rQe7axC
- Ripple (XRP): rJwtbzoac9cYncjaAceKrexrQyEBcCFw9d

## Available Scripts

### 1. wghb.js (Weaken-Grow-Hack-Batch)

This script provides a comprehensive attack strategy for targeting servers.

**Usage:**
```
run wghb.js [weaken/grow/hack/batch] [walk/target] [targetServer] [owned]
```

- First argument: Choose the attack type (weaken, grow, hack, or batch)
- Second argument: Choose the mode (walk or target)
- Third argument (optional): Specify the target server when in target mode
- Fourth argument (optional): Use "owned" to only use purchased servers

**Examples:**
- `run wghb.js batch walk` - Performs a batch attack on all accessible servers
- `run wghb.js hack target n00dles` - Hacks the 'n00dles' server specifically
- `run wghb.js grow walk owned` - Grows all accessible servers using only purchased servers

### 2. autoServers.js

This script automates the process of purchasing and managing servers.

**Usage:**
```
run autoServers.js [purchase/delete] [RAM] [test]
```

- First argument: Choose to purchase or delete servers
- Second argument: Specify the RAM amount when purchasing
- Third argument (optional): Use "test" to simulate the purchase without spending money

**Examples:**
- `run autoServers.js purchase 8192` - Purchases servers with 8192GB RAM
- `run autoServers.js purchase 16384 test` - Tests purchasing 16384GB RAM servers
- `run autoServers.js delete` - Deletes all purchased servers

### 3. killAll.js

This script terminates all running scripts on all accessible servers.

**Usage:**
```
run killAll.js
```

This command will kill all scripts on all servers you have access to, providing a clean slate without needing to restart the game.

### 4. autoNuke.js

This script automatically attempts to gain root access on all accessible servers that you don't already have root access to.

**Usage:**
```
run autoNuke.js
```

**Functionality:**
- Scans all accessible servers
- Checks if you have the required hacking level and necessary programs to hack each server
- Attempts to open required ports and NUKE servers you're capable of hacking
- Provides feedback on successful root access gains and reasons for failures

This script is particularly useful for quickly gaining access to new servers as your hacking abilities improve.
