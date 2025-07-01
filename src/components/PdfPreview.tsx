import React, { useEffect, useState } from 'react';
import { colors } from '../styles/colors';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

interface PdfPreviewProps {
  name: string;
  url: string;
  index: number;
  showThumbnail: boolean;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({ name, url, index, showThumbnail }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      if (!showThumbnail) {
        setPreviewUrl(null);
        return;
      }

      try {
        setLoading(true);
        const previewName = name.replace('.pdf', '.png');
        const previewRef = ref(storage, `rundschauPreview/${previewName}`);
        const url = await getDownloadURL(previewRef);
        setPreviewUrl(url);
        setError(null);
      } catch (err) {
        console.error('Fehler beim Laden des Vorschaubildes:', err);
        setError('Vorschaubild nicht verfügbar');
        setPreviewUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [name, showThumbnail]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="pdf-link"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="pdf-item">
        {showThumbnail && (
          <div className="preview-container">
            {loading ? (
              <div className="loading-placeholder">
                <span className="loading-icon">⌛</span>
              </div>
            ) : error ? (
              <div className="error-placeholder">
                <span className="error-icon">⚠️</span>
              </div>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt={`Vorschau ${name}`}
                className="preview-image"
              />
            ) : (
              <span className="pdf-icon">📄</span>
            )}
          </div>
        )}
        <div className="pdf-info">
          <span className="pdf-name">MTV-Rundschau {name.slice(0, -4)}</span>
        </div>
      </div>

      <style>{`
        .pdf-link {
          text-decoration: none;
          color: inherit;
          display: block;
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
        }

        .pdf-item {
          display: flex;
          flex-direction: column;
          background: #f8f9fa;
          border-radius: 16px;
          transition: all 0.3s ease;
          border: 1px solid #eee;
          overflow: hidden;
          height: 100%;
        }

        .pdf-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          background: #fff;
          border-color: ${colors.red}20;
        }

        .preview-container {
          width: 100%;
          aspect-ratio: 3/4;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          overflow: hidden;
          position: relative;
        }

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .pdf-item:hover .preview-image {
          transform: scale(1.05);
        }

        .loading-placeholder,
        .error-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          color: #666;
        }

        .loading-icon,
        .error-icon {
          font-size: 2rem;
        }

        .pdf-icon {
          font-size: 3rem;
          color: ${colors.red}40;
        }

        .pdf-info {
          padding: 1rem;
          background: #fff;
          border-top: 1px solid #eee;
        }

        .pdf-name {
          display: block;
          font-size: 1rem;
          color: #333;
          font-weight: 500;
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pdf-date {
          display: block;
          font-size: 0.9rem;
          color: #666;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </a>
  );
};

export default PdfPreview;