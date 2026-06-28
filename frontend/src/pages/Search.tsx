import { useState } from "react";
import { api } from "../api/axios";
import NavBar from "../components/NavBar";

type Note = {
  id: number;
  chunk_text: string;
  title: string;
  link: string | null;
  tags: String[];
  score: number;
}
const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    const res = await api.post("/search", { query });
    setResults(res.data.results);
    setLoading(false);
  }

  return (
    <>
      <NavBar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Semantic Search</h1>
          <p className="text-slate-500">Search your notes by meaning, not keywords.</p>
        </div >
        <div className="bg-white border rounded-2xl p-5 shadow-sm flex gap-3 mb-8">
          <input type="text"
            className="flex-1 border rounded-xl px-4 py-3"
            placeholder='search your brain'
            value={query}
            onChange={e => setQuery(e.target.value)}
          /> <br />
          <button disabled={loading} className="bg-black text-white px-6 py-3 rounded-xl" onClick={handleSearch}>{loading ? "Searching..." : "Search"}</button>
        </div>
        <div className="space-y-4">
          {results.length === 0 && query === "" && (
            <div className="bg-white rounded-2xl border p-12 text-center">
              <div className="text-5xl mb-4">🔍</div>

              <h2 className="text-xl font-semibold">
                Search your knowledge
              </h2>

            </div>
          )}
          {results.map((result) => (
            <div key={result.id} className="bg-white border rounded-2xl p-5 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">{result.title}</h3>
              <p className="text-slate-600 mb-3">{result.chunk_text}</p>

              <p className="text-sm text-slate-400 mb-3">
                Score: {result.score?.toFixed(3)}
              </p>

              {result.tags?.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-3">
                  {result.tags.map((tag, index) => (
                    <span className="bg-slate-100 px-3 py-1 rounded-full text-sm" key={index}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {result.link && (
                <a href={result.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  Open Link
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

    </>
  )
}

export default Search