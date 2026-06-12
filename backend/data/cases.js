export const cyberCases = [
  {
    id: 'raid_001',
    caseNumber: 'RAID 001',
    title: 'THE VAULT BREACH',
    briefing: 'An anonymous whale wallet is draining the SwiftyEx validator node. Trace the exploit path before the node self-destructs.',
    stage: 1,
    timer: 900,
    terminalLogs: [
      '[02:44:11] SECURE: Inbound cluster accepted.',
      '[02:44:12] WARNING: Protocol mismatch detected.',
      '[02:44:15] INFRASTRUCTURE: Routing layer altered.',
      '[02:44:18] FAILSAFE: Security permissions overridden.',
      '[02:44:22] TERMINAL: Yield engine initialized.',
      '[02:44:24] YIELD: Autonomous execution active.',
      '[02:44:28] EMERGENCY: Signature validation failed.',
      '[02:44:30] XNODE: External payload injected.',
      '[02:44:34] VALIDATOR: Relay uplink established.',
      '[02:44:36] ARCHIVE: Secondary mirror synchronized.',
      '[02:44:39] UTILITY: Logic layer attached.',
      '[02:44:41] LOGICAL: Terminal hooks enabled.',
      '[02:44:45] TERMINAL: Session trace activated.',
      '[02:44:49] SECURITY: Session hashes finalized.'
    ],
    clue: 'Look vertically at the system process labels.',
    question: 'Enter the hidden routing signature.',
    correctAnswer: 'SWIFTYEXVAULTS',
    answerKeywords: ['SWIFTYEXVAULTS'],
    hint: 'The first letters form the signature.',
    hiddenClue: 'The hacker embedded the route directly into infrastructure labels.',
    caseType: 'raid'
  },

  {
    id: 'raid_002',
    caseNumber: 'RAID 002',
    title: 'THE HEX MATRIX',
    briefing: 'The routing layer is breached. Decode the payload before the funds hit the mixer.',
    stage: 2,
    timer: 780,
    payload:
      '46 69 6e 64 20 74 68 65 20 6c 65 61 6b 20 61 74 20 77 61 6c 6c 65 74 3a 20 30 78 53 77 69 66 74 79 37 32 48 6f 75 72 73 48 61 63 6b 66 65 73 74 42 6f 74',
    clue: 'Convert the hex payload into ASCII text.',
    question: 'Enter the wallet address.',
    correctAnswer: '0xSwifty72HoursHackfestBot',
    answerKeywords: ['0xSwifty72HoursHackfestBot'],
    hint: 'The destination address is embedded directly inside the payload.',
    hiddenClue: 'The hacker used masking, not encryption.',
    caseType: 'raid'
  },

  {
    id: 'raid_003',
    caseNumber: 'RAID 003',
    title: 'THE ESCAPE VELOCITY',
    briefing: 'The hacker initiated a lockout script. Execute the correct override transaction.',
    stage: 3,
    timer: 600,
    contractCode: `
function emergencyWithdraw() public {
  uint256 hackerBalance = balances[msg.sender];

  require(hackerBalance > 0);

  // FORMULA:
  // (450000 / 2) + (2026 * 15)
}
`,
    clue: 'Calculate the exact Gas Limit required.',
    question: 'Enter the Gas Limit.',
    correctAnswer: '255390',
    answerKeywords: ['255390'],
    hint: 'Half the pool plus the yearly modifier.',
    hiddenClue: 'The current year multiplier matters.',
    caseType: 'raid'
  },

  {
    id: 'raid_004',
    caseNumber: 'RAID 004',
    title: 'THE SHADOW RELAY',
    briefing: 'An encrypted relay node is rerouting transaction signatures through a hidden proxy.',
    stage: 1,
    timer: 840,
    encryptedText: 'U1dJRlRZRVhfUkVMQVk=',
    clue: 'Decode the Base64 relay key.',
    question: 'Enter the relay key.',
    correctAnswer: 'SWIFTYEX_RELAY',
    answerKeywords: ['SWIFTYEX_RELAY'],
    hint: 'The payload uses Base64 encoding.',
    hiddenClue: 'The relay name identifies the compromised route.',
    caseType: 'raid'
  },

  {
    id: 'raid_005',
    caseNumber: 'RAID 005',
    title: 'THE FRACTURED BLOCK',
    briefing: 'A validator inserted a poisoned block into the mempool.',
    stage: 2,
    timer: 720,
    puzzle:
      'Block Hash: 0x9A2F__E7__1B__C4',
    clue: 'Missing hexadecimal values reconstruct the poisoned block.',
    question: 'Enter the missing value sequence.',
    correctAnswer: '3D89',
    answerKeywords: ['3D89'],
    hint: 'Only valid hexadecimal characters fit.',
    hiddenClue: 'The hash must remain balanced.',
    caseType: 'raid'
  },

  {
    id: 'raid_006',
    caseNumber: 'RAID 006',
    title: 'THE ORACLE GLITCH',
    briefing: 'Price feeds are being manipulated by a rogue oracle.',
    stage: 1,
    timer: 840,
    clue: 'The manipulated value repeats every third interval.',
    question: 'Which value is fake? 45, 48, 51, 90, 57',
    correctAnswer: '90',
    answerKeywords: ['90'],
    hint: 'One value breaks the sequence.',
    hiddenClue: 'The feed increments by three.',
    caseType: 'raid'
  },

  {
    id: 'raid_007',
    caseNumber: 'RAID 007',
    title: 'THE MIRROR NODE',
    briefing: 'A cloned validator is replaying old transactions.',
    stage: 2,
    timer: 780,
    clue: 'Identify the replay attack vector.',
    question: 'What attack is occurring?',
    correctAnswer: 'Replay Attack',
    answerKeywords: ['replay'],
    hint: 'Old signed transactions are being rebroadcast.',
    hiddenClue: 'The signatures are valid but outdated.',
    caseType: 'raid'
  },

  {
    id: 'raid_008',
    caseNumber: 'RAID 008',
    title: 'THE DEAD PORT',
    briefing: 'The system firewall silently opened a hidden communication port.',
    stage: 1,
    timer: 840,
    clue: 'Common secure traffic uses 443. The rogue service mirrors SSH.',
    question: 'Which port was opened?',
    correctAnswer: '22',
    answerKeywords: ['22'],
    hint: 'SSH traffic was cloned.',
    hiddenClue: 'The attacker tunneled traffic remotely.',
    caseType: 'raid'
  },

  {
    id: 'raid_009',
    caseNumber: 'RAID 009',
    title: 'THE FALSE VALIDATOR',
    briefing: 'A rogue validator is impersonating consensus confirmations.',
    stage: 2,
    timer: 780,
    clue: 'Consensus packets mismatch at signature layer.',
    question: 'What was forged?',
    correctAnswer: 'Validator Signature',
    answerKeywords: ['signature', 'validator'],
    hint: 'Consensus depends on trust validation.',
    hiddenClue: 'The validator identity was spoofed.',
    caseType: 'raid'
  },
  {
    id: 'raid_010',
    caseNumber: 'RAID 010',
    title: 'THE BLEEDING WALLET',
    briefing: 'Micro-withdrawals are draining the treasury undetected.',
    stage: 3,
    timer: 600,
    clue: '1 token leaves every 3 seconds for 15 minutes.',
    question: 'How many tokens were drained?',
    correctAnswer: '300',
    answerKeywords: ['300'],
    hint: 'Convert minutes into seconds first.',
    hiddenClue: 'The drain script loops continuously.',
    caseType: 'raid'
  },
  {
    id: 'raid_011',
    caseNumber: 'RAID 011',
    title: 'THE PHANTOM PACKET',
    briefing: 'Suspicious packets are flooding the validator cluster from a hidden relay.',
    stage: 1,
    timer: 840,
    packets: ['ACK', 'ACK', 'ACK', 'DROP', 'ACK'],
    clue: 'One packet behaves differently from the others.',
    question: 'Which packet is malicious?',
    correctAnswer: 'DROP',
    answerKeywords: ['DROP'],
    hint: 'Only one interrupts the traffic flow.',
    hiddenClue: 'The rogue packet terminates synchronization.',
    caseType: 'raid'
  },

  {
    id: 'raid_012',
    caseNumber: 'RAID 012',
    title: 'THE BROKEN CIPHER',
    briefing: 'A compromised vault uses a Caesar cipher to mask admin commands.',
    stage: 2,
    timer: 780,
    encryptedText: 'VZLIAB',
    clue: 'Shift each letter backward by 7.',
    question: 'Decode the command.',
    correctAnswer: 'OSEBTU',
    answerKeywords: ['OSEBTU'],
    hint: 'The alphabet rotation is constant.',
    hiddenClue: 'The admin used a simple rotational cipher.',
    caseType: 'raid'
  },

  {
    id: 'raid_013',
    caseNumber: 'RAID 013',
    title: 'THE SHATTERED QR',
    briefing: 'The escape wallet QR code was fragmented across multiple servers.',
    stage: 1,
    timer: 840,
    fragments: ['0xSwi', 'ftyEsc', 'rowNode'],
    clue: 'Combine all fragments in order.',
    question: 'Reconstruct the wallet.',
    correctAnswer: '0xSwiftyEscrowNode',
    answerKeywords: ['0xSwiftyEscrowNode'],
    hint: 'The fragments form one continuous string.',
    hiddenClue: 'Each server stored only part of the wallet.',
    caseType: 'raid'
  },

  {
    id: 'raid_014',
    caseNumber: 'RAID 014',
    title: 'THE SIGNAL ECHO',
    briefing: 'A hidden Morse signal was embedded inside validator pings.',
    stage: 2,
    timer: 780,
    signal: '... --- ...',
    clue: 'Decode the Morse sequence.',
    question: 'What distress signal was sent?',
    correctAnswer: 'SOS',
    answerKeywords: ['SOS'],
    hint: 'This is the most famous emergency signal.',
    hiddenClue: 'The validator was secretly requesting help.',
    caseType: 'raid'
  },

  {
    id: 'raid_015',
    caseNumber: 'RAID 015',
    title: 'THE DRAIN LOOP',
    briefing: 'An exploit loop repeatedly siphons liquidity every cycle.',
    stage: 3,
    timer: 600,
    clue: 'The loop drains 15 tokens every 4 seconds for 2 minutes.',
    question: 'How many tokens were drained?',
    correctAnswer: '450',
    answerKeywords: ['450'],
    hint: 'Calculate the number of cycles first.',
    hiddenClue: 'The exploit repeats exactly every 4 seconds.',
    caseType: 'raid'
  },

  {
    id: 'raid_016',
    caseNumber: 'RAID 016',
    title: 'THE FALSE MULTISIG',
    briefing: 'A fake multisig approval bypassed treasury protection.',
    stage: 2,
    timer: 780,
    clue: 'The treasury requires 3 signatures. Only 2 are authentic.',
    question: 'What type of attack occurred?',
    correctAnswer: 'Signature Forgery',
    answerKeywords: ['forgery', 'signature'],
    hint: 'One signature was fabricated.',
    hiddenClue: 'The third approval was injected artificially.',
    caseType: 'raid'
  },

  {
    id: 'raid_017',
    caseNumber: 'RAID 017',
    title: 'THE TIMELOCK COLLAPSE',
    briefing: 'A hacker bypassed the treasury timelock before execution.',
    stage: 3,
    timer: 600,
    clue: 'The lock required 48 hours, but execution happened after 24.',
    question: 'How many hours were skipped?',
    correctAnswer: '24',
    answerKeywords: ['24'],
    hint: 'Subtract execution time from required lock time.',
    hiddenClue: 'The timelock validation was partially bypassed.',
    caseType: 'raid'
  },

  {
    id: 'raid_018',
    caseNumber: 'RAID 018',
    title: 'THE DNS POISON',
    briefing: 'Users were redirected to a fake validator dashboard.',
    stage: 1,
    timer: 840,
    clue: 'The URL differs by one character.',
    question: 'What attack type is this?',
    correctAnswer: 'DNS Poisoning',
    answerKeywords: ['dns', 'poisoning'],
    hint: 'Traffic redirection altered the destination.',
    hiddenClue: 'The domain visually resembled the original.',
    caseType: 'raid'
  },

  {
    id: 'raid_019',
    caseNumber: 'RAID 019',
    title: 'THE FRACTURED CONSENSUS',
    briefing: 'Consensus validators disagree on the current block hash.',
    stage: 2,
    timer: 780,
    hashes: ['A91F', 'A91F', 'A91F', 'B73C'],
    clue: 'One validator submitted a rogue block.',
    question: 'Which hash is malicious?',
    correctAnswer: 'B73C',
    answerKeywords: ['B73C'],
    hint: 'Three validators agree. One does not.',
    hiddenClue: 'The rogue validator injected a forged block.',
    caseType: 'raid'
  },

  {
    id: 'raid_020',
    caseNumber: 'RAID 020',
    title: 'THE FINAL OVERRIDE',
    briefing: 'The system core is collapsing. One final command can restore the validator network.',
    stage: 3,
    timer: 300,
    commandFragments: ['REST', 'ORE_', 'NODE'],
    clue: 'Assemble the recovery command.',
    question: 'Enter the final override command.',
    correctAnswer: 'RESTORE_NODE',
    answerKeywords: ['RESTORE_NODE'],
    hint: 'Combine the fragments exactly.',
    hiddenClue: 'The validator recovery string was split intentionally.',
    caseType: 'raid'
  }
];
export default cyberCases;