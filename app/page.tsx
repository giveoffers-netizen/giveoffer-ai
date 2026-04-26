export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>GiveOffer AI</h1>
      <p>AI product search app is live.</p>

      <form>
        <input
          placeholder="Search product..."
          style={{ padding: 12, width: 300, marginRight: 10 }}
        />
        <button style={{ padding: 12 }}>Search</button>
      </form>
    </main>
  );
}
