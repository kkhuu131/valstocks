import Image from "next/image";
import Link from "next/link";

export default function Home() {

  return (
    <main className="pt-20 pb-20">
      <section className="flex flex-col items-center py-2 w-full max-w-screen-lg mx-auto px-12">
        <h1 className="text-4xl font-bold m-5">About ValStocks</h1>
        <p className="text-xl text-muted-foreground mt-5">ValStocks is a stock trading simulator for the popular FPS game, VALORANT. There is no real 
            money involved and is simply for fun. Each stock is based on a pro team&apos;s performance in the Champions League. The value of stocks also take into account general sentiment using Reddit, and supply and demand.
            You can buy and sell stocks to earn money or to root for your favorite teams, and compete against other players. Currently, you have to be logged in using Discord OAuth to trade stocks.</p>
            <p className="text-xl text-muted-foreground mt-5">This is originally made for a fun side project so I could learn more about full-stack development. The project has been restarted multiple times and been worked on and off for a while so I probably won&apos;t work on it for too much longer. However, feel free to leave any comments or suggestions.</p>
            <p className="text-xl text-muted-foreground mt-5">
              The original repo can be found <Link href="https://github.com/kkhuu131/valstocks" target="_blank" className="text-blue-500 underline">here.</Link>
            </p>
            <p className="text-xl text-muted-foreground mt-5">Please don&apos;t take anything too seriously, and have fun!</p>
            <img src="/fns.jpg" alt="fns" className="w-1/2 mt-5"/>
      </section>
    </main>
  );
}