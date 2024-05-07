# Bitburner-Scripts
Some useful Bitburner scripts that I made.

The usage instructions of the scripts are provided below.

## How to Support
Support me by making cryptocurrency donations ^~^
- Bitcoin (BTC) - 14YfYXJJqDpwp3rHghhr7cuiihgvEdSBV6
- Ethereum (ETH) - 0x53678F8f4966ADeD487e4826e69eF11aaedc4a43
- Solana (SOL) - 7bSAFtxLPmjHkW5Ej7pqMN7Zr6u7HF7CDFWdmjEYSuUq
- Doge (DOGE) - D8naE2zceDgeobUJvfWtP514HVXEvopvuj
- Litecoin (LTC) - LTCvkusSZoDCxMzKkFXkkkiRi83MzfBXYU
- Monero (XMR) - 41pKAT2XGafTQqasEYSw2XNJCwfsuLWPsRCkdxeinfRU2rvPQ6XGsxqRnBKUYPhrhvSoGF721Qb9Bimf7eS4vuPTPVoJdbY
- Ravencoin (RVN) - RUWVDYqTby2PaNhrXpjoBevwyi6rQe7axC
- Ripple (XRP) - rJwtbzoac9cYncjaAceKrexrQyEBcCFw9d

# Script's Usage
## autoNuke.js
To execute this script, in terminal run the command `autoNuke.js`.

This script will iterate through every server you have access too and check if it is able to be "NUKE"d, if so, it will go through all the required steps to NUKE it.

## batchTargetAll.js
To execute this script, in terminal run the command `batchTargetAll.js server`.
- server - This is where you would input the name of the server you want to target.

This script must be used alongside the script 'batch.js' which is provided in the folder "Required Scripts" within the repository, make sure when running this script you created the 'batch.js' file in the server's dir beforehand.

This script will batch target the user inputted server with all servers at once by first executing 2 weaken commands, then 2 grow commands, and then finally hack the server, repeat.

## batchWalk.js
To execute this script, in Terminal run the command `batchWalk.js`.

This script must be used alongside the script 'batch.js' which is provided in the folder "Required Scripts" within the repository, make sure when running this script you created the 'batch.js' file in the server's dir beforehand.

This script will target every server that you have root access too one by one, targeting each server with all servers at once with the batch.js script, this script will weaken the server twice, then grow it twice, and then hack it. After it has completed that the script will then move onto the next server and forwards.

## killAll.js
To execute this script, in terminal run the command `killAll.js`.

This script kills all scripts running on all servers without the need to restart the game.

## wghAllTime.js
To execute this script, in Terminal run the command `wghAllTime.js weaken/grow/hack time`.
- weaken/grow/hack - You enter either weaken, grow or hack to execute the desired command on the target server.
- time - This is the amount of time you want to weaken/grow the server for in ms (milliseconds).

This script must be used alongside the scripts 'weaken.js', 'grow.js', and 'hack.js' which are provided within the repository, make sure when running this script you created both 'weaken.js', 'grow.js', and 'hack.js' files in the server's dir beforehand.

This script will target every server that you have root access too one by one, targeting each server with all servers at once executing the user inputted command weaken, grow, or hack for the inputted amount of time in milliseconds, then move on to the next server.

## wghTarget.js
To execute this script, in Terminal run the command `wghTarget.js weaken/grow/hack targetServer`.
- weaken/grow/hack - You enter either weaken, grow or hack to execute the desired command on the target server.
- targetServer - This is the name of the server you want to target to grow or weaken.

This script must be used alongside the scripts 'weaken.js', 'grow.js', and 'hack.js' which are provided within the repository, make sure when running this script you created both 'weaken.js', 'grow.js', and 'hack.js' files in the server's dir beforehand.

This script will target the inputted server with the desired command, for example if you inputted `wghTarget.js grow n00dles`, the script will execute on every server you have root access too and start growing the server n00dles using every server available.

## wghWalk.js
To execute this script, in Terminal run the command `wghWalk.js weaken/grow/hack`.
- weaken/grow/hack - You enter either weaken, grow or hack to execute the desired command on the servers.

This script must be used alongside the scripts 'weaken.js', 'grow.js', and 'hack.js' which are provided within the repository, make sure when running this script you created both 'weaken.js', 'grow.js', and 'hack.js' files in the server's dir beforehand.

This script will target every server that you have root access too one by one, targeting each server with all servers at once by first executing 2 weaken commands, then 2 grow commands, and then finally hack the server, repeat.
