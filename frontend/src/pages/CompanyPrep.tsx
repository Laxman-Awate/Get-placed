import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Bookmark, CheckCircle, Map, RefreshCw } from 'lucide-react';
import { useCompanyDirectory } from '../hooks/useCompanies';
import { useCompanyPreparation } from '../hooks/useCompanyPreparation';

const colorByType: Record<string, string> = {
  Product: 'from-blue-600 to-cyan-500',
  Service: 'from-indigo-700 to-blue-600',
  Consulting: 'from-green-700 to-teal-600',
};

export default function CompanyPrep() {
  const navigate = useNavigate();
  const { data: companies, loading, error, setBookmark } = useCompanyDirectory();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);
  const active = companies.find((company: any) => company.id === activeId) || companies[0];
  const prep = useCompanyPreparation(active?.id);

  useEffect(() => {
    if (!activeId && companies.length > 0) {
      setActiveId(companies[0].id);
    }
  }, [activeId, companies]);

  const toggleBookmark = async () => {
    if (!active) return;
    setBookmarkError(null);
    try {
      await setBookmark(active.id, !active.bookmarked);
    } catch {
      setBookmarkError('Could not save. Please try again.');
    }
  };

  return (
    <div className="min-h-full bg-[#080810] p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold font-[Plus_Jakarta_Sans] text-white mb-1">Company Preparation</h1>
        <p className="text-sm text-[#64748b]">Detailed prep roadmap, process and resources for published companies.</p>
      </div>

      {(loading || error || companies.length === 0) && (
        <div className="card-dark rounded-xl p-8 text-center text-sm text-[#64748b]">
          {loading ? 'Loading companies...' : error ? 'Could not load companies from the backend.' : 'No companies are published yet.'}
        </div>
      )}

      {companies.length > 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-[#94a3b8] mb-3">Companies</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {companies.map((company: any) => {
                const color = colorByType[company.type] || 'from-purple-700 to-violet-600';
                return (
                  <button
                    key={company.id}
                    onClick={() => setActiveId(company.id)}
                    className={`flex-shrink-0 w-52 card-dark card-lift rounded-xl p-4 text-left transition-all border ${
                      active?.id === company.id ? 'border-teal-500/40 bg-teal-500/5' : 'border-[#1e1e30] hover:border-[#2e2e45]'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-sm font-bold text-white`}>
                        {company.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{company.name}</div>
                        <div className="text-[10px] text-[#64748b]">{company.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#64748b]">{company.modules} modules</span>
                      <span className="text-teal-400 font-medium">{company.difficulty}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {active && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="col-span-2 space-y-4">
                <div className="card-dark rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">{active.name}</h3>
                      <p className="text-xs text-[#64748b]">{active.description}</p>
                    </div>
                    <button
                      onClick={toggleBookmark}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        active.bookmarked
                          ? 'text-teal-400 border-teal-500/30 bg-teal-500/10'
                          : 'text-[#64748b] border-[#1e1e30] hover:text-white'
                      }`}
                    >
                      <Bookmark size={12} />
                      {active.bookmarked ? 'Saved' : 'Save'}
                    </button>
                  </div>
                  {bookmarkError && (
                    <div className="text-xs text-red-400 mt-2">{bookmarkError}</div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {(active.areas || []).map((area: string) => (
                      <span key={area} className="text-[10px] px-2 py-1 rounded bg-[#0f0f1a] text-[#94a3b8] border border-[#1e1e30]">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card-dark rounded-xl p-5">
                  <h3 className="text-sm font-bold text-white mb-3">Preparation Modules</h3>
                  {prep.loading ? (
                    <div className="flex items-center gap-2 text-xs text-[#64748b]"><RefreshCw size={12} />Loading roadmap...</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {(prep.data?.modules || []).map((module: any) => (
                        <button
                          key={module.id}
                          onClick={() => navigate('/dashboard/learn')}
                          className="bg-[#0f0f1a] rounded-lg p-3 text-left hover:bg-[#17172a] transition-colors"
                        >
                          <div className="text-xs font-semibold text-white mb-1">{module.title}</div>
                          <div className="text-[10px] text-[#64748b] leading-relaxed">{module.description}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="card-dark rounded-xl p-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorByType[active.type] || 'from-purple-700 to-violet-600'} flex items-center justify-center text-sm font-bold text-white mb-3`}>
                    {active.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-sm font-bold text-white mb-0.5">{active.name}</div>
                  <div className="text-xs text-[#64748b] mb-3">{active.type} · {active.difficulty}</div>
                  <button
                    onClick={() => navigate('/dashboard/mock-test')}
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-white py-2 rounded-lg transition-all"
                  >
                    Practice Mock Tests <ArrowRight size={11} />
                  </button>
                </div>

                <div className="card-dark rounded-xl p-5">
                  <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2"><Map size={12} className="text-teal-400" /> Preparation Roadmap</h3>
                  <div className="space-y-2">
                    {(prep.data?.roadmap || []).map((step: string, index: number) => (
                      <div key={step} className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${index === 0 ? 'border-teal-500 bg-teal-500/20' : 'border-[#2e2e45]'}`}>
                          {index === 0 ? <CheckCircle size={9} className="text-teal-400" /> : <span className="text-[9px] text-[#475569]">{index + 1}</span>}
                        </div>
                        <span className={`text-xs ${index === 0 ? 'text-teal-400' : 'text-[#64748b]'}`}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
