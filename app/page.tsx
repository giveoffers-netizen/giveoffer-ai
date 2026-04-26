import SearchForm from "@/components/SearchForm";

export default function Home() {
  return (
    <main className="container">
      <section className="hero">
        <div className="logo">GiveOffer AI</div>
        <h1 className="title">Ask once. Get the best offer.</h1>
        <p className="subtitle">Search any product and let AI compare prices, ratings, shipping, and value across the web.</p>
        <SearchForm />
      </section>
    </main>
  );
}
