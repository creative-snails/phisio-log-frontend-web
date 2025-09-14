import ChatWidget from "~/components/chat/ChatWidget";
import HealthRecordsManager from "~/components/HealthRecordsManager";
import HeroSection from "~/components/HeroSection";

const Home = () => {
  return (
    <div className="content-wrapper">
      <HeroSection />
      <HealthRecordsManager />
      <ChatWidget />
    </div>
  );
};

export default Home;
