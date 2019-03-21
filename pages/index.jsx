import * as React from 'react';
import { useCallback, useState } from 'react';
import { Button, ButtonsGroup, Heading, Page, Title } from '~/components';
import 'sanitize.css';
import '../views/style/global.scss';
import style from './index.scss';
import Head from 'next-server/head';
import dynamic from 'next-server/dynamic';
import { compact } from 'lodash';
import { useShallowState } from '../hooks/useShallowState';
import Link from 'next/link';

const height = 300;
const itemsCount = 51;
const dataSets = [['joined', '#31ad3c'], ['left', '#ff5c44']].map(([key, color]) => ({
  key,
  color,
  data: Array.from({ length: itemsCount + 1 }).map((_, index) => ({
    x: index === 0 ? 0 : (index / itemsCount) * 100,
    y: 5 + Math.ceil(Math.random() * 90)
  }))
}));

const InteractiveChart = dynamic(() => import('../components/lazy/InteractiveChart'), {
  loading: () => <div className={style.PlaceholderBlock}/>,
  ssr: false
});
const PreviewChart = dynamic(() => import('../components/lazy/PreviewChart'), {
  loading: () => <div className={style.PlaceholderBlock}/>,
  ssr: false
});

export default function IndexPage() {
  const [checked, setChecked] = useState(true);
  const [checked2, setChecked2] = useState(false);
  const toggleChecked = useCallback(() => setChecked(!checked), [checked]);
  const toggleChecked2 = useCallback(() => setChecked2(!checked2), [checked2]);
  const [{ offset, visible }, setState] = useShallowState({
    offset: 30,
    visible: 20
  });
  const resultDataSets = compact([checked && dataSets[0], checked2 && dataSets[1]]);

  return (
    <Page>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>
      <Heading>
        <Title>
          <Link href="/independent">Followers</Link>
        </Title>
      </Heading>
      <div className={style.Graph}>
        <InteractiveChart height={height} dataSets={resultDataSets} offset={offset} visible={visible}/>
      </div>
      <div className={style.Preview}>
        <PreviewChart height={80} dataSets={resultDataSets} offset={offset} visible={visible} onChange={setState}/>
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
  );
}
