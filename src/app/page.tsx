import PositionModal from "./components/home/position-modal";
import Page from "./components/page";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HomeProps {}

const Home = ({}: HomeProps) => {
  return (
    <Page>
      <PositionModal />
    </Page>
  );
};

export default Home;
