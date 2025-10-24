import { useStore } from "../store/useStore";
import Header from "../components/home/header";
import LanguageSelector from "../components/home/languageselector";
import MenuCards from "../components/home/menucards";
import RecentActivity from "../components/home/recentactivity";

export default function Home() {

  const { language, setLanguage, lastActivity } = useStore();


  if (lastActivity) return (
  <div className="min-h-screen bg-background flex flex-col text-foreground font-display">
    <Header />
    <div className="mx-auto grow flex flex-col max-w-7xl py-12 px-8">
      <section>
          <h1 className="text-4xl font-bold tracking-tight text-balance">Welcome back!</h1>
          <p className="mt-4 text-lg text-muted-foreground">Select Your Programming Language</p>
          <LanguageSelector newUser={false} language={language} setLanguage={setLanguage} />
      </section>
      <div className="flex flex-col grow justify-center mt-12 space-y-16">
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Main Menu</h2>
          <MenuCards />
        </section>
        <section>
          <RecentActivity lastActivity={lastActivity!} />
        </section>
      </div>
    </div>
  </div>
  );
  else return (
    <div className="min-h-screen bg-background flex flex-col text-foreground font-display">
      <Header />
      <div className="mx-auto grow flex flex-col items-center justify-center max-w-7xl py-16 px-8">
        <section className="text-center">
          <h1 className="text-6xl font-bold tracking-tight text-balance mb-8">
            Welcome to SuvriddhiOS!
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Choose your programming language to get started
          </p>
          <LanguageSelector newUser={true} language={language} setLanguage={setLanguage} />
        </section>

        <section className="mt-32">
          <MenuCards />
        </section>
      </div>
    </div>
  );
}
