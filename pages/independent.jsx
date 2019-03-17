import React from 'react';
import input from '../models/input.json';
import style from './index.scss';
import { Page } from '../components/layout/Page';
import Head from 'next-server/head';
import { Heading, Title } from '../components/Heading';
import Link from 'next/link';
import { RootView } from '../views';

function renderChart(target) {
  if (!target) return;
  const root = new RootView(input[4]);

  root.renderTo(target);
}

const IndependentPage = React.memo(() => {
  return (
    <Page>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>
      <Heading>
        <Title>
          <Link href="/">Followers</Link>
        </Title>
      </Heading>
      <div ref={renderChart}/>
      <div className={style.Graph}/>
      <div className={style.Preview}/>
    </Page>
  );
});

export default IndependentPage;
