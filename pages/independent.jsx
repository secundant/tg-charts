import React from 'react';
import input from '../models/input.json';
import { Page } from '../components/layout/Page';
import Head from 'next-server/head';
import { Application } from '../views';

function renderChart(target) {
  if (!target) return;
  new Application(target).render([input[4]]);
}

const IndependentPage = React.memo(() => {
  return (
    <Page>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>
      <div ref={renderChart}/>
    </Page>
  );
});

export default IndependentPage;
