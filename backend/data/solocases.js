export const localCases = [
  {
    id: "CASE-001",
    title: "The Ghost Liquidity Leak",
    difficulty: "CRITICAL",
    briefing: "An automated arbitrage vault on SwiftyCircle is bleeding gas tokens into an unverified address. Trace the leak vector before the liquidity pool collapses completely.",
    stages: [
      { step: 1, type: "ANALYSIS", prompt: "The exploiter executed an unconventional flash loan sequence. What is the standard programmatic term for an attack vector that recursively calls an internal function before balance states update?", expected: "REENTRANCY" },
      { step: 2, type: "CRYPTOGRAPHY", prompt: "Decoded logs show an obfuscated hex string pointing to the drainer's fallback payload: 0x414e4f4d414c59. Convert this ASCII hex signature directly into plain readable text.", expected: "ANOMALY" },
      { step: 3, type: "FORENSICS", prompt: "The trace ends at a proxy contract deployer. What specific structural pattern bypasses traditional proxy upgrade guardrails by clashing identical function selectors?", expected: "SELECTOR CLASH" }
    ]
  },
  {
    id: "CASE-002",
    title: "The Shadow Miner Conspiracy",
    difficulty: "HIGH",
    briefing: "Network telemetry reports a rogue validator manipulation setup injecting transactions out of sequence to systematically extract maximum frontrunning value from users.",
    stages: [
      { step: 1, type: "NETWORK", prompt: "What is the industry abbreviation for the maximum value a miner or validator can extract by manipulating, inserting, or reordering blocks?", expected: "MEV" },
      { step: 2, type: "RECON", prompt: "The rogue validator is using a specific private transaction relay network to shield transactions from the public mempool. Name this prominent block-building framework network.", expected: "FLASHBOTS" }
    ]
  },
  {
    id: "CASE-003",
    title: "Pharaoh's Ransom",
    difficulty: "MEDIUM",
    briefing: "An elite phishing syndicate has locked the multi-sig treasury vault of a major web3 enterprise using a compromised administrator device token.",
    stages: [
      { step: 1, type: "EXPLOIT", prompt: "The admin was compromised via an advanced targeted social engineering attack. What is the specific industry term for highly targeted phishing aimed at high-profile executives?", expected: "SPEAR PHISHING" },
      { step: 2, type: "RECOVERY", prompt: "To recover the keys, you must override the multi-sig access. If a vault requires 3 signatures out of a total pool of 5 designated keepers to execute operations, what is its mathematical threshold ratio written as an exact fraction? (e.g. 3/5)", expected: "3/5" }
    ]
  },
  {
    id: "CASE-004",
    title: "The Zero-Day Sequence",
    difficulty: "CRITICAL",
    briefing: "An unidentified state-sponsored threat group has initialized a countdown kill-switch targeted directly at core Layer-1 network nodes.",
    stages: [
      { step: 1, type: "LOGIC", prompt: "The node software crashes when it receives a specific invalid payload size. What foundational memory hazard class occurs when an application writes data outside its allocated memory boundaries?", expected: "BUFFER OVERFLOW" },
      { step: 2, type: "SYSTEM", prompt: "The vulnerability resides in the network transport layer interface. What protocol acronym handles stateful, reliable connection-oriented packet deliveries across networks?", expected: "TCP" }
    ]
  },
  {
    id: "CASE-005",
    title: "The Double Spend Paradox",
    difficulty: "HIGH",
    briefing: "A fork choice rule anomaly in an experimental sidechain has allowed an attacker to confirm conflicting asset transactions concurrently.",
    stages: [
      { step: 1, type: "CONCURRENCY", prompt: "What consensus attack percentage represents the theoretical threshold required for a single malicious entity to control and rewrite a proof-of-work history chain?", expected: "51" },
      { step: 2, type: "LEDGER", prompt: "The attacker is exploiting a lack of historical context in the UTXO model. What does the acronym UTXO stand for?", expected: "UNSPENT TRANSACTION OUTPUT" }
    ]
  },
  {
    id: "CASE-006",
    title: "The Oracle Malfunction",
    difficulty: "MEDIUM",
    briefing: "DeFi lending platforms are experiencing massive liquidation events due to a manipulated spot-price oracle pipeline reporting artificial spikes.",
    stages: [
      { step: 1, type: "PRICING", prompt: "What category of decentralized oracle relies on a mathematical average of asset pricing data sampled over a specific timeframe to mitigate flash-crash manipulations?", expected: "TWAP" },
      { step: 2, type: "DATA", prompt: "The primary manipulated oracle is a highly popular, decentralized oracle data-feed network utilizing independent node operators. Name this decentralized network.", expected: "CHAINLINK" }
    ]
  },
  {
    id: "CASE-007",
    title: "The Missing Genesis Key",
    difficulty: "MEDIUM",
    briefing: "A legacy cold-storage device has been recovered from an abandoned infrastructure bunker, but the physical key layout sequence is scrambled.",
    stages: [
      { step: 1, type: "HARDWARE", prompt: "What standard industry protocol governs the generation of deterministic seed words used to construct cryptographic key pairs from raw computer entropy?", expected: "BIP39" },
      { step: 2, type: "KEYSPACE", prompt: "How many cryptographic bits of security structural strength are contained inside a standard 24-word recovery backup mnemonic phrase?", expected: "256" }
    ]
  },
  {
    id: "CASE-008",
    title: "The Infinite Mint Poison",
    difficulty: "CRITICAL",
    briefing: "An ERC-20 smart contract token supply shot from 10 million tokens up to 400 billion tokens within three blocks due to an exposed access control flaw.",
    stages: [
      { step: 1, type: "ACCESS", prompt: "The developer accidentally omitted a critical access restriction modifier from the custom mint function. What standard OpenZeppelin extension modifier limits a function exclusively to the contract deployer?", expected: "ONLYOWNER" },
      { step: 2, type: "TOKENOMICS", prompt: "What standard technical interface identifier describes standard fungible tokens on the Ethereum network ecosystem?", expected: "ERC20" }
    ]
  },
  {
    id: "CASE-009",
    title: "The Sybil Swarm Attack",
    difficulty: "HIGH",
    briefing: "A governance vote is being hijacked by a flood of thousands of newly registered, synthetic automated user personas trying to pass a malicious proposal.",
    stages: [
      { step: 1, type: "NETWORK", prompt: "What is the security term for an architectural exploit where an adversary creates a massive quantity of pseudonymous identities to gain dominant network influence?", expected: "SYBIL" },
      { step: 2, type: "MITIGATION", prompt: "What cryptographic proof paradigm allows a user to prove they hold a valid identity or attribute without revealing any sensitive personal data or private keys?", expected: "ZERO KNOWLEDGE" }
    ]
  },
  {
    id: "CASE-010",
    title: "The Honeycomb Trap",
    difficulty: "MEDIUM",
    briefing: "An apparent exploit script is circulating on dark-web forums, but preliminary analysis suggests the script itself is a trap designed to drain the attacker's wallet.",
    stages: [
      { step: 1, type: "FORENSICS", prompt: "What structural security term describes a deceptive asset, system, or contract deployed intentionally to attract, trap, and study active hackers?", expected: "HONEYPOT" }
    ]
  },
  {
    id: "CASE-011",
    title: "The Darknet Mixer Trace",
    difficulty: "HIGH",
    briefing: "A malicious actor has passed 5,000 compromised tokens through a decentralized privacy mixer. Trace the un-blinded output rings.",
    stages: [
      { step: 1, type: "PRIVACY", prompt: "What decentralized privacy protocol tool on Ethereum used zero-knowledge proofs to break transaction history links before its smart contracts were heavily sanctioned?", expected: "TORNADO CASH" }
    ]
  },
  {
    id: "CASE-012",
    title: "The Sandwich Trap",
    difficulty: "MEDIUM",
    briefing: "A retail user swapped 50 ETH and suffered a catastrophic 40% slippage loss because an automated script adjusted pool ratios immediately before and after their block entry.",
    stages: [
      { step: 1, type: "TRADING", prompt: "What specific three-step MEV exploitation technique involves placing an attack transaction directly before and immediately after a target user's pending trade?", expected: "SANDWICH ATTACK" }
    ]
  },
  {
    id: "CASE-013",
    title: "The Rugpull Blueprint",
    difficulty: "MEDIUM",
    briefing: "An anonymous development team suddenly removed all liquidity pool tokens from a newly launched decentralized exchange pair, crashing the token value to absolute zero.",
    stages: [
      { step: 1, type: "DEFI", prompt: "What is the slang security term used when creators abruptly pull the liquidity rug from a token project pool, abandoning investors with untradable tokens?", expected: "RUGPULL" }
    ]
  },
  {
    id: "CASE-014",
    title: "The Poisoned AirDrop",
    difficulty: "HIGH",
    briefing: "Users are reporting that interacting with a newly received free NFT in their web3 dashboard automatically initiates a hidden wallet-drain approval transaction.",
    stages: [
      { step: 1, type: "EXPLOIT", prompt: "What specific token approval function allows a third-party address to spend a user's token balance up to a designated maximum limit?", expected: "APPROVE" }
    ]
  },
  {
    id: "CASE-015",
    title: "The Frontrunner Ghost",
    difficulty: "CRITICAL",
    briefing: "An attacker is monitoring the public transaction pool and submitting an identical transaction with a significantly higher gas price to steal an arbitrage opportunity.",
    stages: [
      { step: 1, type: "GAS", prompt: "What is the structural term for the temporary network storage staging area where unconfirmed pending transactions sit before validation?", expected: "MEMPOOL" }
    ]
  },
  {
    id: "CASE-016",
    title: "The Gas Token Siphon",
    difficulty: "MEDIUM",
    briefing: "A malicious smart contract is burning excessive amounts of user gas by executing complex dummy loops inside an innocent fallback function sequence.",
    stages: [
      { step: 1, type: "ENGINE", prompt: "What is the exact acronym for the deterministic runtime sandbox computing engine that executes all smart contract bytecode on the Ethereum network?", expected: "EVM" }
    ]
  },
  {
    id: "CASE-017",
    title: "The Cross-Chain Bridge Heist",
    difficulty: "CRITICAL",
    briefing: "A major interoperability bridge has halted operations after an attacker forged valid cryptographic signatures to unlock locked tokens on the destination chain.",
    stages: [
      { step: 1, type: "INTEROP", prompt: "What standard cryptographic hashing algorithm family is natively used by Ethereum to compute secure contract and transaction hash states?", expected: "KECCAK256" }
    ]
  },
  {
    id: "CASE-018",
    title: "The Signature Malleability Rift",
    difficulty: "HIGH",
    briefing: "An exchange accounting system accepted a modified cryptographic transaction signature format as a completely unique withdrawal instruction, leading to a double balance debit.",
    stages: [
      { step: 1, type: "CRYPTO", prompt: "What specific elliptic curve signature algorithm standard is utilized by Bitcoin and Ethereum to secure asymmetric key cryptography?", expected: "ECDSA" }
    ]
  },
  {
    id: "CASE-019",
    title: "The Dust Storm Eclipse",
    difficulty: "LOW",
    briefing: "Thousands of microscopic token amounts are being sent to high-volume trader accounts to obfuscate transaction graph analysis and trace engines.",
    stages: [
      { step: 1, type: "FORENSICS", prompt: "What tracking term refers to sending tiny fractions of a token or cryptocurrency to thousands of public addresses to de-anonymize wallet networks?", expected: "DUSTING ATTACK" }
    ]
  },
  {
    id: "CASE-020",
    title: "The Vanity Address Collision",
    difficulty: "HIGH",
    briefing: "A high-net-worth wallet address generated via a popular web tool was drained. Analysis suggests the tool used a weak, predictable seed generator.",
    stages: [
      { step: 1, type: "RANDOMNESS", prompt: "What core programmatic mechanism abbreviation represents systems designed to produce unpredictable numbers for security key generation?", expected: "CSPRNG" }
    ]
  },
  {
    id: "CASE-021",
    title: "The Ice Phishing Sweep",
    difficulty: "HIGH",
    briefing: "An attacker modified a web frontend interface to trick users into signing a full allowance transfer of all assets to a malicious address without executing a direct transfer transaction.",
    stages: [
      { step: 1, type: "PERMISSIONS", prompt: "What advanced token standard extension allow users to bypass gas fees by signing an off-chain structured permission message instead of an on-chain approval?", expected: "ERC2612" }
    ]
  },
  {
    id: "CASE-022",
    title: "The Timelock Bypass",
    difficulty: "CRITICAL",
    briefing: "A DAO governance timelock contract was triggered and drained in the exact same block, violating the mandatory 48-hour security buffer.",
    stages: [
      { step: 1, type: "TEMPORAL", prompt: "What is the exact name of the block-dependent EVM variable state instruction that developers use to fetch the current block creation date and time?", expected: "BLOCK.TIMESTAMP" }
    ]
  },
  {
    id: "CASE-023",
    title: "The Flash Loan Avalanche",
    difficulty: "CRITICAL",
    briefing: "An exploit script borrowed $150 million in stablecoins, destabilized an under-collateralized trading pool, and vanished before the block concluded.",
    stages: [
      { step: 1, type: "FINANCE", prompt: "What specialized web3 uncollateralized lending primitive must be completely borrowed and paid back within the exact same atomic block execution sequence?", expected: "FLASH LOAN" }
    ]
  },
  {
    id: "CASE-024",
    title: "The Storage Collision Bug",
    difficulty: "HIGH",
    briefing: "An upgraded implementation contract started overwriting the original contract admin address with arbitrary token balances because layout configurations clashed.",
    stages: [
      { step: 1, type: "MEMORY", prompt: "Smart contract state variables are allocated into persistent 32-byte storage keys. What is the technical term for these individual memory rows?", expected: "SLOTS" }
    ]
  },
  {
    id: "CASE-025",
    title: "The Reentrancy Revenge",
    difficulty: "HIGH",
    briefing: "A newly deployed staking vault was hit by an exploit pathway identical to the historical 2016 DAO hack due to an unsafe external raw call invocation layout.",
    stages: [
      { step: 1, type: "MUTEX", prompt: "What programmatic design pattern structural guard or modifier prevents a function from being recursively entered during an active execution run?", expected: "REENTRANCYGUARD" }
    ]
  },
  {
    id: "CASE-026",
    title: "The Rogue Multisig Key",
    difficulty: "MEDIUM",
    briefing: "A development multisig has been compromised after two out of three founding partners stored their raw private keys in unencrypted cloud-based backup notes.",
    stages: [
      { step: 1, type: "KEYMGMT", prompt: "What standard industry abbreviation represents hardware units or modules used to securely store and process highly sensitive cryptographic keys?", expected: "HSM" }
    ]
  },
  {
    id: "CASE-027",
    title: "The Block Hash Gamble",
    difficulty: "MEDIUM",
    briefing: "An on-chain casino engine was completely cleared of funds after a player accurately guessed the lucky random number variable 10 times in a row.",
    stages: [
      { step: 1, type: "RANDOMNESS", prompt: "Using block properties like block.hash or block.difficulty for randomness is unsafe because they can be easily predicted or manipulated by who?", expected: "MINERS" }
    ]
  },
  {
    id: "CASE-028",
    title: "The Unchecked Return Value",
    difficulty: "MEDIUM",
    briefing: "A native token transfer call failed quietly due to insufficient gas, but the parent ledger proceeded to mint luxury game items anyway.",
    stages: [
      { step: 1, type: "LOGIC", prompt: "Low-level Solidity address calls do not throw compilation errors on failure; they return a primitive boolean value. What is the keyword name for that boolean state?", expected: "FALSE" }
    ]
  },
  {
    id: "CASE-029",
    title: "The Decentralized ID Spoof",
    difficulty: "HIGH",
    briefing: "An attacker bypassed a protocol's sybil-resistance gate checks by exploiting an index parsing error inside an on-chain decentralized identity credential validator.",
    stages: [
      { step: 1, type: "IDENTITY", prompt: "What standard industry acronym stands for decentralized identifiers used to build sovereign digital credential systems?", expected: "DID" }
    ]
  },
  {
    id: "CASE-030",
    title: "The Integer Overflow Sentinel",
    difficulty: "LOW",
    briefing: "An older smart contract built before Solidity version 0.8.0 allowed a user wallet balance to loop around to maximum capacity when subtracting 1 token from 0.",
    stages: [
      { step: 1, type: "MATH", prompt: "What error condition occurs when a mathematical subtraction drops an unsigned integer value below its minimum valid zero threshold limits?", expected: "UNDERFLOW" }
    ]
  }
];