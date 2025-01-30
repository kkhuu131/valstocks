import RankingsTable from "@/components/rankings-table";

export default function Rankings() {

  return (
    <main className="pt-20 pb-20">
      <section className="flex flex-col items-center justify-center py-2 w-full max-w-screen-lg mx-auto px-4">
        <h1 className="text-4xl font-bold m-5">Rankings</h1>
        <p className="text-2xl text-muted-foreground">Top 100 Users</p>
        <div className="w-full m-5">
            <RankingsTable/>
        </div>
      </section>
    </main>
  );
}