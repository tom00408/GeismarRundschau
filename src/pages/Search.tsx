import React, { useEffect, useState, useRef } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { colors } from '../styles/colors';
import PdfPreview from '../components/PdfPreview';

interface SearchResult {
  name: string;
  url: string;
  matches: number;
  preview: string;
}

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfs, setPdfs] = useState<{ name: string; url: string }[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Header Animation
    if (headerRef.current) {
      headerRef.current.animate([
        { transform: 'translateY(20px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ], {
        duration: 800,
        easing: 'cubic-bezier(.68,-0.55,.27,1.55)',
        fill: 'forwards'
      });
    }

    // Content Animation
    if (contentRef.current) {
      contentRef.current.animate([
        { transform: 'translateY(30px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ], {
        duration: 800,
        delay: 200,
        easing: 'cubic-bezier(.68,-0.55,.27,1.55)',
        fill: 'forwards'
      });
    }
  }, []);

  // PDFs beim ersten Laden abrufen
  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const folderRef = ref(storage, 'rundschau');
        const res = await listAll(folderRef);
        const pdfPromises = res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { name: itemRef.name, url };
        });
        const pdfList = await Promise.all(pdfPromises);
        setPdfs(pdfList);
      } catch (err) {
        setError('Fehler beim Laden der PDFs.');
        console.error('Fehler beim Laden der PDFs:', err);
      }
    };
    fetchPdfs();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Hier würde normalerweise die PDF-Suche implementiert werden
      // Da wir keine direkte PDF-Suche haben, simulieren wir Ergebnisse
      const searchResults = pdfs.map(pdf => ({
        ...pdf,
        matches: Math.floor(Math.random() * 5) + 1, // Simulierte Treffer
        preview: `...${searchTerm}...` // Simulierte Vorschau
      }));

      setResults(searchResults);
    } catch (err) {
      setError('Fehler bei der Suche.');
      console.error('Fehler bei der Suche:', err);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2vw' }}>
      {/* Header Section */}
      <div
        ref={headerRef}
        style={{
          background: `linear-gradient(135deg, ${colors.red} 0%, ${colors.red2} 100%)`,
          borderRadius: 24,
          padding: '3rem 2rem',
          marginBottom: '3rem',
          color: colors.white,
          textAlign: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        }}
      >
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          marginBottom: '1rem',
          letterSpacing: 1,
          textShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          PDF Suche
        </h1>
        <p style={{
          fontSize: '1.2rem',
          opacity: 0.9,
          maxWidth: 600,
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          Durchsuchen Sie alle Rundschau-Ausgaben nach Ihren Suchbegriffen
        </p>
      </div>

      {/* Search Section */}
      <div
        ref={contentRef}
        style={{
          background: colors.white,
          borderRadius: 16,
          padding: '2rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }}
      >
        <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            maxWidth: 800,
            margin: '0 auto',
          }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Geben Sie Ihren Suchbegriff ein..."
              style={{
                flex: 1,
                padding: '1rem 1.5rem',
                fontSize: '1.1rem',
                border: `2px solid ${colors.red}20`,
                borderRadius: 12,
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.red2} 100%)`,
                color: colors.white,
                border: 'none',
                padding: '0 2rem',
                borderRadius: 12,
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Suche...' : 'Suchen'}
            </button>
          </div>
        </form>

        {/* Results Section */}
        {error && (
          <div style={{
            color: colors.red,
            textAlign: 'center',
            padding: '2rem',
            fontSize: '1.1rem',
          }}>
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div>
            <h2 style={{
              color: colors.red,
              marginBottom: '1.5rem',
              fontSize: '1.5rem',
              fontWeight: 600,
            }}>
              Suchergebnisse ({results.length})
            </h2>
            <div style={{
              display: 'grid',
              gap: '1rem',
            }}>
              {results.map((result, index) => (
                <div
                  key={result.name}
                  className="search-result"
                  style={{
                    background: '#f8f9fa',
                    borderRadius: 12,
                    padding: '1.5rem',
                    border: '1px solid #eee',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <PdfPreview
                    name={result.name}
                    url={result.url}
                    index={index}
                    showThumbnail={true}
                  />
                  <div style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #eee',
                    fontSize: '0.9rem',
                    color: '#666',
                  }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>{result.matches}</strong> Treffer
                    </div>
                    <div style={{ fontStyle: 'italic' }}>
                      {result.preview}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && results.length === 0 && searchTerm && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#666',
            fontSize: '1.1rem',
          }}>
            Keine Ergebnisse gefunden
          </div>
        )}
      </div>

      <style>{`
        input:focus {
          border-color: ${colors.red} !important;
          box-shadow: 0 0 0 3px ${colors.red}10;
        }

        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .search-result:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          border-color: ${colors.red}20;
        }
      `}</style>
    </div>
  );
};

export default Search; 