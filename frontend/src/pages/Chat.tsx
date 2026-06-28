import { useState } from "react"
import { api } from "../api/axios";
import NavBar from "../components/NavBar";

type Source = {
    chunk_text: string;
    title: string;
    link: string | null;
    tags: string[];
    score: number;
};

const Chat = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [sources, setSources] = useState<Source[]>([]);
    const [loading,setLoading]=useState(false);

    async function askQuestion() {
        setLoading(true);
        const res = await api.post("/chat", { question });
        setAnswer(res.data.answer);
        setSources(res.data.sources);
        setQuestion("");
        setLoading(false);
    }
    return (
        <>
            <NavBar />
            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Chat With Your Brain</h1>
                    <p className="text-slate-500">Ask questions based on your saved notes.</p>
                </div>
                <div className="bg-white border rounded-2xl p-5 shadow-sm flex gap-3 mb-8">
                    <input type="text"
                        className="flex-1 border rounded-xl px-4 py-3"
                        placeholder='ask something from your notes'
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                    /> <br />
                    <button disabled={loading} className="bg-black text-white px-6 py-3 rounded-xl" onClick={askQuestion}>{loading ? "Thinking..." : "Ask"}</button>
                </div>
                {answer && (
                    <div className="bg-white border rounded-2xl p-6 shadow-sm mb-8">
                        <h2 className="text-xl font-semibold mb-3">Answer</h2>
                        <p className="text-slate-700 leading-relaxed">{answer}</p>
                    </div>
                )}

                {sources.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Sources</h2>

                        <div className="space-y-4">
                            {sources.map((source, index) => (
                                <div key={index} className="bg-white border rounded-2xl p-5 shadow-sm">
                                    <h3 className="font-semibold mb-2">{source.title}</h3>
                                    <p className="text-slate-600 mb-2">{source.chunk_text}</p>
                                    <p className="text-sm text-slate-400">
                                        Score: {source.score?.toFixed(3)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>


        </>
    )
}

export default Chat