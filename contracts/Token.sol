// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Token is IERC20, IERC20Metadata {
    address _contratoToken;

    string private _name;
    string private _symbol;
    uint8 private constant _decimals = 0;

    uint256 private _totalSupply;

    mapping(address => uint256) _balances;
    mapping(address => mapping(address => uint256)) _allowed;

    

    using SafeMath for uint256;

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        _totalSupply += 1000;
        _balances[msg.sender] += 1000;
        _contratoToken = address(this);
    }

    function addressContrat() public view returns(address){
        return _contratoToken;
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function decimals() public pure override returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account_)
        public
        view
        override
        returns (uint256)
    {
        return _balances[account_];
    }

    function transfer(address recipient_, uint256 amount_)
        public
        override
        returns (bool)
    {
        require(
            recipient_ != address(0),
            'NO se puede realizar una transferencia a la direccion 0(cero)..'
        );
        require(
            amount_ <= _balances[msg.sender],
            'La cantidad que deseas enviar en superior al saldo disponible..'
        );
        _balances[msg.sender] = _balances[msg.sender].sub(amount_);
        _balances[recipient_] = _balances[recipient_].add(amount_);
        emit Transfer(msg.sender, recipient_, amount_);
        return true;
    }


    // --------------------------- Funciones NO implementadas --------------------------- \\
    function allowance(address owner_, address spender_)
        public
        view
        virtual
        override
        returns (uint256)
    {}

    function approve(address spender_, uint256 amount_)
        public
        virtual
        override
        returns (bool)
    {}

    function transferFrom(
        address sender_,
        address recipient_,
        uint256 amount_
    ) public virtual override returns (bool) {}



    // --------------------------- Funciones propias de la DApp --------------------------- \\

    function transferLoteria(
        address from_,
        address recipient_,
        uint256 amount_
    ) public returns (bool) {
        require(
            recipient_ != address(0),
            'NO se puede realizar una transferencia a la direccion 0(cero)..'
        );
        require(
            amount_ <= _balances[from_],
            'La cantidad que deseas enviar en superior al saldo disponible..'
        );
        _balances[from_] = _balances[from_].sub(amount_);
        _balances[recipient_] = _balances[recipient_].add(amount_);
        emit Transfer(from_, recipient_, amount_);
        return true;
    }

    function crearTokens(uint256 amount_) public {
        _mint(msg.sender, amount_);
    }

    function _mint(address account_, uint256 amount_) internal {
        require(
            account_ != address(0),
            'ERC20: Minteo a direccion 0(cero) NO permitido..'
        );
        _totalSupply += amount_;
        _balances[account_] += amount_;
        emit Transfer(address(0), account_, amount_);
    }
}