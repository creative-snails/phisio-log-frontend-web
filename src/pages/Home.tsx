import ChatWidget from "~/components/chat/ChatWidget";
import HealthRecordsManager from "~/components/HealthRecordsManager";

const Home = () => {
  return (
    <div className="content-wrapper">
      <HealthRecordsManager />
      <ChatWidget />
    </div>
  );
};

export default Home;
