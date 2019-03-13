import React from 'react';
import input from '../models/input.json';
import style from './index.scss';
import { Page } from '../components/layout/Page';
import Head from 'next-server/head';
import { Heading, Title } from '../components/Heading';
import { ChartRoot } from '../vanilla/ChartRoot';
import { DataSource } from '../models/DataSource';
import Link from 'next/link';

function renderChart(target) {
  if (!target) return;
  new ChartRoot({
    dataSource: new DataSource(input[0]),
    target
  }).render();
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
