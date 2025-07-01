import React, { useEffect, useState, useRef } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { colors } from '../styles/colors';
import PdfPreview from '../components/PdfPreview';

const Archive: React.FC = () => {
  const [pdfs, setPdfs] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showThumbnails, setShowThumbnails] = useState(true);
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

  useEffect(() => {
    const fetchPdfs = async () => {
      setLoading(true);
      setError(null);
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
      setLoading(false);
    };
    fetchPdfs();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        fontSize: '1.2rem',
        color: colors.red
      }}>
        Lade PDFs...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        fontSize: '1.2rem',
        color: colors.red
      }}>
        {error}
      </div>
    );
  }

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
          Archiv
        </h1>
        <p style={{
          fontSize: '1.2rem',
          opacity: 0.9,
          maxWidth: 600,
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          Entdecken Sie unsere vergangenen Rundschau-Ausgaben
        </p>
      </div>

      {/* Content Section */}
      <div
        ref={contentRef}
        style={{
          background: colors.white,
          borderRadius: 16,
          padding: '2rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          <h2 style={{
            color: colors.red,
            fontSize: '1.8rem',
            fontWeight: 600,
            margin: 0,
          }}>
            Rundschau Ausgaben
          </h2>
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className="toggle-button"
            style={{
              background: showThumbnails ? colors.red : '#e0e0e0',
              color: showThumbnails ? colors.white : '#666',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>📄</span>
            {showThumbnails ? 'Vorschaubilder ausblenden' : 'Vorschaubilder anzeigen'}
          </button>
        </div>

        <div className="pdf-grid">
          {pdfs.map((pdf, index) => (
            <PdfPreview
              key={pdf.name}
              name={pdf.name}
              url={pdf.url}
              index={index}
              showThumbnail={showThumbnails}
            />
          ))}
        </div>
      </div>

      <style>{`
        .toggle-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .pdf-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        @media (max-width: 1024px) {
          .pdf-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .pdf-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Archive;