import * as React from 'react';
import { useCallback, useState } from 'react';
import { Button, ButtonsGroup, Heading, Page, Title } from '~/components';
import 'sanitize.css';
import '../style/global.scss';
import style from './index.scss';
import Head from 'next-server/head';

export default function IndexPage() {
  const [checked, setChecked] = useState(true);
  const [checked2, setChecked2] = useState(false);
  const toggleChecked = useCallback(() => setChecked(!checked), [checked]);
  const toggleChecked2 = useCallback(() => setChecked2(!checked2), [checked2]);

  return (
    <Page>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>
      <Heading>
        <Title>Followers</Title>
      </Heading>
      <div className={style.Graph}>
        <div className={style.PlaceholderBlock}/>
      </div>
      <div className={style.Preview}>
        <div className={style.PlaceholderBlock}/>
      </div>
      <ButtonsGroup className={style.ButtonsGroup}>
        <Button onClick={toggleChecked} checked={checked} statusColor="#31ad3c">
          Joined
        </Button>
        <Button onClick={toggleChecked2} checked={checked2} statusColor="#ff5c44">
          Left
        </Button>
      </ButtonsGroup>
    </Page>
  )
}
