pragma solidity 0.8.18;


contract RockPaperScissors {
    address public player1;
    address public player2;
    


    uint256 public betAmount;
    
    bytes32 public player1ChoiceHash;
    bytes32 public player2ChoiceHash;
    
    
    bool public player1Revealed;
    bool public player2Revealed;
    
    
    address public winner;
    
    
    bool public isDraw;
    bool public gameComplete;
    
    
    
    uint256 public revealDeadline;

    constructor() {
        player1 = address(0);
        player2 = address(0);
        
        
        betAmount = 0;
        
        
        player1ChoiceHash = bytes32(0);
        
        
        player2ChoiceHash = bytes32(0);
        player1Revealed = false;
        
        
        player2Revealed = false;
        
        
        winner = address(0);
        
        
        isDraw = false;
        
        
        gameComplete = false;
        revealDeadline = 0;
    }

    modifier onlyPlayers() {
        require(msg.sender == player1 || msg.sender == player2, "Only players can call this function");
        _;
    }

    modifier bothPlayersRevealed() {
        require(player1Revealed && player2Revealed, "Both players must reveal their choices");
        _;
    }

    modifier gameNotComplete() {
        require(!gameComplete, "The game is already complete");
        _;
    }

    function register() external payable gameNotComplete {
        require(player1 == address(0) || player2 == address(0), "Both player slots are filled");
        require(msg.value >= 0.0001 ether, "Bet amount must be at least 0.0001 ether");

        if (player1 == address(0)) {
            player1 = msg.sender;
        } else {
            player2 = msg.sender;
        }

        betAmount += msg.value;
    }

    function play(bytes32 choiceHash) external onlyPlayers gameNotComplete {
        if (msg.sender == player1) {
            require(player1ChoiceHash == bytes32(0), "Player 1 choice already submitted");
            player1ChoiceHash = choiceHash;
        } else {
            require(player2ChoiceHash == bytes32(0), "Player 2 choice already submitted");
            player2ChoiceHash = choiceHash;
        }
    }

    function reveal(string memory clearMove) external onlyPlayers gameNotComplete {
        require(block.timestamp <= revealDeadline, "Reveal period has ended");
        bytes32 choiceHash = keccak256(abi.encodePacked(clearMove));
        if (msg.sender == player1) {
            require(player1ChoiceHash == choiceHash, "Invalid choice for Player 1");
            player1Revealed = true;
        } else {
            require(player2ChoiceHash == choiceHash, "Invalid choice for Player 2");
            player2Revealed = true;
        }
    }

    function getOutcome() external bothPlayersRevealed gameNotComplete {
        if (keccak256(abi.encodePacked(player1ChoiceHash)) == keccak256(abi.encodePacked(player2ChoiceHash))) {
            isDraw = true;
            payable(player1).transfer(betAmount / 2);
            payable(player2).transfer(betAmount / 2);
        } else if (
            (keccak256(abi.encodePacked(player1ChoiceHash)) == keccak256(abi.encodePacked("rock")) && keccak256(abi.encodePacked(player2ChoiceHash)) == keccak256(abi.encodePacked("scissors"))) ||
            (keccak256(abi.encodePacked(player1ChoiceHash)) == keccak256(abi.encodePacked("paper")) && keccak256(abi.encodePacked(player2ChoiceHash)) == keccak256(abi.encodePacked("rock"))) ||
            (keccak256(abi.encodePacked(player1ChoiceHash)) == keccak256(abi.encodePacked("scissors")) && keccak256(abi.encodePacked(player2ChoiceHash)) == keccak256(abi.encodePacked("paper")))
        ) {
            winner = player1;
            payable(player1).transfer(betAmount);
        } else {
            winner = player2;
            payable(player2).transfer(betAmount);
        }

        gameComplete = true;
    }

    function setRevealDeadline(uint256 durationInSeconds) external onlyPlayers {
        require(!player1Revealed || !player2Revealed, "Both players have already revealed their choices");
        revealDeadline = block.timestamp + durationInSeconds;
    }
}