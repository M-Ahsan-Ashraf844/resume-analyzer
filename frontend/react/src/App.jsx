import { useState } from "react";

function ResumeAnalyzer() {
  const [resume, setResume] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const analyzeResume = async () => {
    if (!resume || !jobDesc.trim()) {
      setError("Please provide both resume and job description");
      return;
    }
    setLoading(true);
    setError("");
    setData(null);
    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("job_description", jobDesc);
      const res = await fetch("http://127.0.0.1:8000/api/analyzer/", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Something went wrong");
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      setFileName(file.name);
    }
  };

  const scoreColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  const scoreRing = (score) => {
    if (score >= 80) return "from-emerald-400 to-teal-500";
    if (score >= 60) return "from-amber-400 to-orange-500";
    return "from-rose-400 to-pink-500";
  };

  return (
    <div
      className="min-h-screen bg-gray-950 text-white"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        backgroundImage:
          "radial-gradient(ellipse at 20% 20%, rgba(139,92,246,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.1) 0%, transparent 50%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,300&family=Syne:wght@700;800&display=swap');

        .glass {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .glass-hover:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.15);
          transition: all 0.2s ease;
        }
        .gradient-border {
          position: relative;
          border-radius: 16px;
        }
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          padding: 1px;
          background: linear-gradient(135deg, rgba(139,92,246,0.6), rgba(59,130,246,0.4), rgba(236,72,153,0.3));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .score-ring {
          background: conic-gradient(var(--score-color) var(--score-pct), rgba(255,255,255,0.05) 0);
          border-radius: 50%;
        }
        .tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          line-height: 1;
        }
        .shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 100%;
          animation: shimmer 1.8s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pulse-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #a78bfa;
          animation: pulse 1.4s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        textarea:focus, input:focus {
          outline: none;
        }
      `}</style>

      {/* Header */}
      <header className="text-center pt-16 pb-8 px-4">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full glass text-xs font-medium tracking-widest uppercase text-violet-300">
          <span className="pulse-dot"></span>
          AI-Powered · Gemini 2.5 Flash
        </div>
        <h1
          className="text-5xl md:text-6xl font-extrabold tracking-tight mb-3"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
            Resume
          </span>{" "}
          <span className="text-gray-300">Analyzer</span>
        </h1>
        <p className="text-gray-400 text-lg font-light justify-center ">
          Match your resume to any job description with AI precision
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-20 space-y-5">
        {/* Upload Card */}
        <div className="gradient-border glass p-6 rounded-2xl">
          <label className="block mb-3 text-sm font-semibold text-gray-300 tracking-wide uppercase">
            📄 Resume File
          </label>
          <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/10 p-8 cursor-pointer transition-all duration-200 hover:border-violet-500/50 hover:bg-violet-500/5">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-2xl">
              {fileName ? "✅" : "📁"}
            </div>
            <div className="text-center">
              {fileName ? (
                <>
                  <p className="font-medium text-violet-300">{fileName}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to change file
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium text-gray-300">
                    Drop your resume here
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF or TXT · Click to browse
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Job Description Card */}
        <div className="gradient-border glass p-6 rounded-2xl">
          <label className="block mb-3 text-sm font-semibold text-gray-300 tracking-wide uppercase">
            💼 Job Description
          </label>
          <textarea
            rows="7"
            placeholder="Paste the full job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className="w-full bg-white/5 rounded-xl p-4 text-gray-200 placeholder-gray-600 text-sm resize-none border border-white/5 focus:border-violet-500/50 focus:bg-violet-500/5 transition-all duration-200"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm fade-in">
            <span className="text-lg">⚠️</span>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={analyzeResume}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-base tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: loading
              ? "rgba(139,92,246,0.3)"
              : "linear-gradient(135deg, #7c3aed, #2563eb, #db2777)",
            boxShadow: loading ? "none" : "0 0 40px rgba(124,58,237,0.4)",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="shimmer inline-block w-24 h-4 rounded-full"></span>
              Analyzing your resume...
            </span>
          ) : (
            "✨ Analyze Match"
          )}
        </button>

        {/* Results */}
        {data && (
          <div className="space-y-5 fade-in">
            {/* Score */}
            <div className="gradient-border glass rounded-2xl p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
                Match Score
              </p>
              <div
                className={`text-8xl font-extrabold ${scoreColor(data.score)}`}
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {data.score ?? "N/A"}
                {data.score && (
                  <span className="text-4xl text-gray-500">%</span>
                )}
              </div>
              <div className="mt-4 w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${scoreRing(data.score)} transition-all duration-1000`}
                  style={{ width: `${data.score}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {data.score >= 80
                  ? "Excellent match 🎯"
                  : data.score >= 60
                    ? "Good match 👍"
                    : "Needs improvement 📝"}
              </p>
            </div>

            {/* Strengths */}
            {data.strengths?.length > 0 && (
              <Section
                icon="💪"
                title="Strengths"
                items={data.strengths}
                tagClass="bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                dotColor="bg-emerald-400"
              />
            )}

            {/* Weaknesses */}
            {data.weaknesses?.length > 0 && (
              <Section
                icon="🔍"
                title="Weaknesses"
                items={data.weaknesses}
                tagClass="bg-rose-500/15 text-rose-300 border border-rose-500/20"
                dotColor="bg-rose-400"
              />
            )}

            {/* Missing Skills */}
            {data.missing_skills?.length > 0 && (
              <Section
                icon="🧩"
                title="Missing Skills"
                items={data.missing_skills}
                tagClass="bg-amber-500/15 text-amber-300 border border-amber-500/20"
                dotColor="bg-amber-400"
              />
            )}

            {/* Suggestions */}
            {data.suggestions?.length > 0 && (
              <Section
                icon="💡"
                title="Suggestions"
                items={data.suggestions}
                tagClass="bg-blue-500/15 text-blue-300 border border-blue-500/20"
                dotColor="bg-blue-400"
              />
            )}

            {/* ATS Tips */}
            {data.ats_tips?.length > 0 && (
              <Section
                icon="🤖"
                title="ATS Tips"
                items={data.ats_tips}
                tagClass="bg-violet-500/15 text-violet-300 border border-violet-500/20"
                dotColor="bg-violet-400"
              />
            )}

            {/* Raw */}
            {data.raw && (
              <div className="gradient-border glass rounded-2xl p-6">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
                  🗂 Raw Response
                </h3>
                <pre className="text-xs text-gray-400 bg-black/30 p-4 rounded-xl overflow-x-auto leading-relaxed">
                  {data.raw}
                </pre>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function Section({ icon, title, items, tagClass, dotColor }) {
  return (
    <div className="gradient-border glass rounded-2xl p-6">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed">
            <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`}></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResumeAnalyzer;
