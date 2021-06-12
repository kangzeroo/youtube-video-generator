/** @jsxRuntime classic */
/** @jsx jsx */
import { gql, useQuery } from "@apollo/client";
import { jsx } from "@emotion/react";

const EXCHANGE_RATES = gql`
  query GetExchangeRates {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`;

const Demo = () => {
  const { loading, error, data } = useQuery(EXCHANGE_RATES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.rates.map(({ currency, rate }: { currency: any; rate: any }) => (
    <div key={currency}>
      <p css={styles.currency}>
        {currency}: {rate}
      </p>
    </div>
  ));
};

const styles = {
  currency: {
    backgroundColor: "white",
    color: "black",
    borderRadius: "5px",
    padding: "5px",
  },
};

export default Demo;
