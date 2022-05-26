//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract BuyMeACoffee {
    //Using an event to emit a new memo or message from the dapp for every new purchase
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //Memo struct for holding data of differnt data type
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }
    
    //owner's address, marked payable to allow the contract send money to it
    address payable owner;

    // An array of struct which shows a list of all the memos received from coffee
    Memo[] memos;

    constructor() {
        // Store the address of the deployer as a payable address.
        // When when we withdraw funds, we'll withdraw from here.
        owner = payable(msg.sender);
    }

    /**
    * @dev fetches all stored memos
    */
    function getMemos () public view returns (Memo[] memory) {
        return memos;
    }

    
    function buyCoffee(string memory _name, string memory _message) public payable {
      require(msg.value > 0, "can't buy coffee for free!");

      // add the memo to storage!
      memos.push(Memo(
          msg.sender,
          block.timestamp,
          _name,
          _message
      ));

      //emit the new memo received to the dapp
      emit NewMemo(
          msg.sender,
          block.timestamp,
          _name,
          _message
      );
    }

    /**
    *@dev send the entire balance to the owner
    */
   function withdrawTips() public {
       require(owner.send(address(this).balance));
   } 
}
