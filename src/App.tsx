import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import React, { useMemo, useState } from 'react';
import './App.css';
import { BetaBanner, Code } from './components';
import styles from './components.module.scss';
import {
  convertIntStringToWeiString,
  generateIntegrationCode,
  isAmountBelowSafeLimits
} from './helpers';
import { ReactComponent as RampLogo } from './ramp-instant-logo.svg';
import { WidgetVariantTypes } from '@ramp-network/ramp-instant-sdk/dist/types/types';

const tokenName = process.env.REACT_APP_TOKEN_NAME;
const currentNetwork = process.env.REACT_APP_NETWORK_NAME;
const appInstance = process.env.REACT_APP_DEMO_APP_INSTANCE;

const App: React.FC = () => {
  const [address, setAddress] = useState('0xe2E0256d6785d49eC7BadCD1D44aDBD3F6B0Ab58');

  const [amount, setAmount] = useState('0.01');

  const [asset, setAsset] = useState<string>('ETH');

  const handleSubmitButtonClick = () => {
    let weiAmount: string;

    try {
      weiAmount = convertIntStringToWeiString(amount);
    } catch (e) {
      alert('Supplied amount is not a valid number');
      return;
    }

    if (!isAmountBelowSafeLimits(weiAmount, asset !== 'ETH')) {
      alert(
        'This demo app only supports transactions up to roughly 2 GBP (0.01 ETH / 2 TEST tokens).'
      );
      return;
    }

    new RampInstantSDK({
      hostAppName: 'Maker DAO',
      hostLogoUrl: 'https://cdn-images-1.medium.com/max/2600/1*nqtMwugX7TtpcS-5c3lRjw.png',
      swapAmount: weiAmount,
      swapAsset: asset,
      url: 'http://localhost:8080',
      userAddress: address,
      variant: appInstance && appInstance === 'DEV' ? 'auto' : WidgetVariantTypes.DESKTOP,
    })
      .on('*', console.log)
      .show();
  };

  const sampleCode = useMemo(
    () =>
      generateIntegrationCode({
        swapAmount: convertIntStringToWeiString(amount || '0'),
        swapAsset: asset,
        userAddress: address
      }),
    [amount, asset, address]
  );

  return (
    <div className="App">
      <BetaBanner />
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <a
            href="https://instant.ramp.network/"
            style={{
              textDecoration: 'none',
              alignSelf: 'flex-start',
              display: 'block',
              width: '100%',
              textAlign: 'left'
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <RampLogo style={{ height: '30px', marginBottom: '20px', width: 'auto' }} />
          </a>

          <h1 className={styles.heading}>Try Ramp Instant</h1>

          <p className={styles.description}>
            Developers - look right. That’s the code to your own onramp. Paste it into your codebase
            and let your users buy crypto with Ramp!
          </p>
          <p className={styles.description}>
            Testers - this is the demo version of the widget. You can buy{' '}
            {currentNetwork === 'mainnet' ? '' : currentNetwork + ' '} Ether with GBP to experience
            the flow and feel the breeze of Open Banking.
          </p>
          <p className={styles.description}>
            This works best on desktop, but feel free to give it a go on mobile.
          </p>

          <label className={styles.label}>
            Buyer's ETH address:
            <input
              className={styles.input}
              value={address}
              onChange={e => setAddress((e.target as HTMLInputElement).value)}
            />
          </label>

          <label className={styles.label}>
            Token / ETH amount:
            <input
              className={styles.input}
              value={amount}
              onChange={e => setAmount((e.target as HTMLInputElement).value)}
            />
          </label>

          <label className={styles.label}>
            Network:
            <select disabled className={styles.input} onChange={() => {}}>
              <option value={currentNetwork}>{currentNetwork}</option>
            </select>
          </label>

          <div className={styles.label}>
            Asset:
            <div className={styles.assetRadioContainer}>
              <label className={styles.label} style={{ display: 'block' }} htmlFor="ethRadio">
                <input
                  type="radio"
                  className={styles.radio}
                  name="asset"
                  value="ETH"
                  onChange={() => setAsset('ETH')}
                  checked={asset === 'ETH'}
                  id="ethRadio"
                />
                {currentNetwork === 'mainnet' ? '' : currentNetwork + ' '}ETH
              </label>
              <label className={styles.label} style={{ display: 'block' }} htmlFor="tokenRadio">
                <input
                  type="radio"
                  className={styles.radio}
                  name="asset"
                  value={tokenName}
                  onChange={() => setAsset(tokenName!)}
                  checked={asset === tokenName}
                  id="tokenRadio"
                />
                {tokenName} token
              </label>
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={handleSubmitButtonClick}>
              Buy with Ramp Instant
            </button>
          </div>

          <footer
            style={{
              marginTop: 'auto',
              width: '100%',
              textAlign: 'left',
              fontSize: '16px',
              lineHeight: '23px'
            }}
          >
            <span style={{ display: 'block' }}>
              Check out the npm package{' '}
              <a href="https://www.npmjs.com/package/@ramp-network/ramp-instant-sdk">here</a>.
            </span>
            <span>
              Join us on Discord <a href="https://discord.gg/zqvFPTB">here</a>.
            </span>
          </footer>
        </div>
        <Code code={sampleCode} />
      </div>
    </div>
  );
};

export default App;
