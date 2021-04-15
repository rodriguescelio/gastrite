import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import Item from './components/Item';
import { ITENS } from './config/data';

import './App.css';
import { HGBRASIL_KEY } from './config/keys';

function App() {

  const cryptoInterval = useRef<any>(null);
  const b3Interval = useRef<any>(null);

  const [cryptoData, setCryptoData] = useState<any[]>([]);
  const [b3Data, setB3Data] = useState<any[]>([]);

  useEffect(
    () => {
      cryptoInterval.current = setInterval(loadCrypto, 2 * 60 * 1000);
      b3Interval.current = setInterval(loadB3, 10 * 60 * 1000);

      loadCrypto();
      loadB3();

      return  () => {
        clearInterval(cryptoInterval.current);
        clearInterval(b3Interval.current);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const loadCrypto = async () => {
    const cryptos = ITENS
      .filter(it => it.type === 'crypto')
      .reduce<any[]>((res, item) => res.map(it => it.symbol).indexOf(item.symbol) === -1 ? [...res, item] : res, []);

    const result = await Promise.all(
      cryptos.map(
        it => axios
          .get(`https://www.mercadobitcoin.net/api/${it.symbol}/ticker/`)
          .then(res => ({ symbol: it.symbol, data: { ...res.data.ticker, updated_at: moment().format('YYYY-MM-DD HH:mm:ss') } }))
      )
    );

    setCryptoData(result);
  };

  const loadB3 = async () => {
    const b3s = ITENS
      .filter(it => it.type === 'b3')
      .reduce<any[]>((res, item) => res.map(it => it.symbol).indexOf(item.symbol) === -1 ? [...res, item] : res, []);

    const result = await Promise.all(
      b3s.map(
        it => axios
          .get(`https://api.hgbrasil.com/finance/stock_price?key=${HGBRASIL_KEY}&symbol=${it.symbol}&format=json-cors`)
          .then(res => res.data.results[it.symbol])
      )
    );

    setB3Data(result);
  };

  return (
    <div className="App">
      <ul className="item-list">
        {ITENS.map((it, index) => <Item key={index + 1} item={it} cryptoList={cryptoData} b3List={b3Data} />)}
      </ul>
    </div>
  );
}

export default App;
