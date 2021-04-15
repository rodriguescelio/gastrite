import moment from 'moment';
import React, { FC } from 'react';

import './style.css';

interface ItemProps {
  item: any;
  cryptoList: any[];
  b3List: any[];
}

const Item: FC<ItemProps> = props => {

  const isCrypto = props.item.type === 'crypto';

  const data = isCrypto ?
    props.cryptoList.find(it => it.symbol === props.item.symbol) :
    props.b3List.find(it => it.symbol === props.item.symbol);

  const getCurrPrice = () => {
    let result = 0;
    if (data) {
      result = isCrypto ? parseFloat(data.data.last) : data.price;
    }
    return result;
  };

  const getBillTotal = () => {
    let result = 0;
    if (data) {
      result = props.item.price * props.item.amount;
    }
    return result;
  };

  const getCurrTotal = () => {
    let result = 0;
    if (data) {
      result = getCurrPrice() * props.item.amount;
    }
    return result;
  };

  const getProfit = () => {
    let result = 0;
    if (data) {
      result = getCurrTotal() - getBillTotal();
    }
    return result;
  };

  const getUpdateTime = () => {
    let result = '00:00 00/00/0000';
    if (data) {
      result = moment(data.updated_at).format('HH:mm DD/MM/YYYY');
    }
    return result;
  };

  const money = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <li className="item">
      <span className="title">{props.item.label}</span>
      <span className="type">{isCrypto ? 'CripoMoeda' : 'Ação'}</span>
      <div className="info">
        <span className="quantidade">
          <label>Quantidade</label>
          <span>{props.item.amount}</span>
        </span>
        <span className="bill-price">
          <label>Valor de compra</label>
          <span>{money(props.item.price)}</span>
        </span>
        <span className="curr-price">
          <label>Valor atual</label>
          <span>{money(getCurrPrice())}</span>
        </span>
        <span className="bill-total">
          <label>Total da compra</label>
          <span>{money(getBillTotal())}</span>
        </span>
        <span className="curr-total">
          <label>Total atual</label>
          <span>{money(getCurrTotal())}</span>
        </span>
        <span className="profit">
          <label>Lucro</label>
          <span>{money(getProfit())}</span>
        </span>
      </div>
      <span className="update-time">Atualizado às {getUpdateTime()}</span>
    </li>
  );
};

export default Item;
