import React from 'react';
import input from '../models/input.json';
import { Page } from '../components/layout/Page';
import Head from 'next-server/head';
import { createApplication } from '../views';
import { flatten } from 'lodash';

const multiplyTarget = Array.from({ length: 25 });
const multiplyValues = values => multiplyTarget.map(() => values);
const multiply = ({ columns, ...props }) => ({
  ...props,
  columns: columns.map(([name, ...values]) => [
    name,
    ...flatten(multiplyValues(values))
  ])
});

const IndependentPage = React.memo(() => {
  let prevChart = React.useRef(null);
  const renderChart = target => {
    if (!target) return;
    if (prevChart && target === prevChart) {
      prevChart.innerHTML = '';
    }
    prevChart = target;
    const data = [multiply(input[4])];

    createApplication(target, [input[3]]);
  };

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
