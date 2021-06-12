/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";

interface IProps {
  height?: string;
  width?: string;
}
const Spacer = ({ height, width }: IProps) => {
  return <div css={styles.body({ height, width })}></div>;
};

const styles = {
  body: ({
    height = "20px",
    width = "100%",
  }: {
    height?: string;
    width?: string;
  }) => ({
    height,
    width,
  }),
};

export default Spacer;
