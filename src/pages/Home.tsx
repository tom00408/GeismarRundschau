import React, { useEffect, useRef, useState } from 'react';
import { colors } from '../styles/colors';
import keiler from '../assets/keiler.png';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

interface LatestIssue {
	name: string;
	url: string;
	previewUrl: string | null;
}

const Home: React.FC = () => {
	const heroRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const [latestIssue, setLatestIssue] = useState<LatestIssue | null>(null);

	useEffect(() => {
		// Hero Animation
		if (heroRef.current) {
			heroRef.current.animate(
				[
					{ transform: 'translateY(20px)', opacity: 0 },
					{ transform: 'translateY(0)', opacity: 1 },
				],
				{
					duration: 800,
					easing: 'cubic-bezier(.68,-0.55,.27,1.55)',
					fill: 'forwards',
				}
			);
		}

		// Content Animation
		if (contentRef.current) {
			contentRef.current.animate(
				[
					{ transform: 'translateY(30px)', opacity: 0 },
					{ transform: 'translateY(0)', opacity: 1 },
				],
				{
					duration: 800,
					delay: 200,
					easing: 'cubic-bezier(.68,-0.55,.27,1.55)',
					fill: 'forwards',
				}
			);
		}
	}, []);

	useEffect(() => {
		const fetchLatestIssue = async () => {
			try {
				const folderRef = ref(storage, 'rundschau');
				const res = await listAll(folderRef);
				const pdfPromises = res.items.map(async (itemRef) => {
					const url = await getDownloadURL(itemRef);
					return { name: itemRef.name, url };
				});
				const pdfList = await Promise.all(pdfPromises);

				// Sortiere nach Namen (da diese das Datum enthalten)
				const sortedPdfs = pdfList.sort((a, b) =>
					b.name.localeCompare(a.name)
				);
				const latest = sortedPdfs[0];

				// Hole das Vorschaubild
				try {
					const previewName = latest.name.replace('.pdf', '.png');
					const previewRef = ref(
						storage,
						`rundschauPreview/${previewName}`
					);
					const previewUrl = await getDownloadURL(previewRef);
					setLatestIssue({ ...latest, previewUrl });
				} catch (err) {
					console.error('Fehler beim Laden des Vorschaubildes:', err);
					setLatestIssue({ ...latest, previewUrl: null });
				}
			} catch (err) {
				console.error('Fehler beim Laden der PDFs:', err);
			}
		};

		fetchLatestIssue();
	}, []);

	return (
		<div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2vw' }}>
			{/* Hero Section */}
			<div
				ref={heroRef}
				style={{
					background: `linear-gradient(135deg, ${colors.red} 0%, ${colors.red2} 100%)`,
					borderRadius: 24,
					padding: '4rem 2rem',
					marginBottom: '3rem',
					color: colors.white,
					textAlign: 'center',
					boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
				}}>
				<img
					src={keiler}
					alt="MTV Geismar Keiler"
					style={{
						width: 120,
						height: 120,
						objectFit: 'contain',
						marginBottom: '1.5rem',
						filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
					}}
				/>
				<h1
					style={{
						fontSize: '2.5rem',
						fontWeight: 700,
						marginBottom: '1rem',
						letterSpacing: 1,
						textShadow: '0 2px 8px rgba(0,0,0,0.15)',
					}}>
					Willkommen beim MTV Geismar
				</h1>
				<p
					style={{
						fontSize: '1.2rem',
						opacity: 0.9,
						maxWidth: 600,
						margin: '0 auto',
						lineHeight: 1.6,
					}}>
					Mein Verein in Göttingen
				</p>
			</div>

			{/* Latest Issue Section */}
			{latestIssue && (
				<div
					ref={contentRef}
					style={{
						background: colors.white,
						borderRadius: 24,
						padding: '2rem',
						marginBottom: '3rem',
						boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
					}}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: '2rem',
						}}>
						<a
							href={latestIssue.url}
							target="_blank"
							rel="noopener noreferrer"
							style={{
								background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.red2} 100%)`,
								color: colors.white,
								padding: '1rem 2rem',
								borderRadius: 12,
								textDecoration: 'none',
								fontSize: '1.2rem',
								fontWeight: 600,
								boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
								transition: 'all 0.3s ease',
							}}>
							Aktuelle Ausgabe öffnen
						</a>
						<div
							style={{
								width: '100%',
								maxWidth: 600,
								aspectRatio: '3/4',
								borderRadius: 16,
								overflow: 'hidden',
								boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
								transition: 'transform 0.3s ease',
								cursor: 'pointer',
							}}>
							{latestIssue.previewUrl ? (
								<img
									src={latestIssue.previewUrl}
									alt={`Vorschau ${latestIssue.name}`}
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
									}}
								/>
							) : (
								<div
									style={{
										width: '100%',
										height: '100%',
										background: '#f8f9fa',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: '3rem',
										color: `${colors.red}40`,
									}}>
									📄
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Content Section */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
					gap: '2rem',
					marginBottom: '3rem',
				}}>
				{/* News Card */}
				<div className="content-card">
					<h2
						style={{
							color: colors.red,
							marginBottom: '1rem',
							fontSize: '1.5rem',
						}}>
						Hier könnte noch ein Info Text stehen
					</h2>
					<p style={{ color: '#666', lineHeight: 1.6 }}>
						Wir können das aber auch weglassen müsst ihr nur sagen
					</p>
				</div>

				{/* Events Card */}
				<div className="content-card">
					<h2
						style={{
							color: colors.red,
							marginBottom: '1rem',
							fontSize: '1.5rem',
						}}>
						Noch ein Feld für Text
					</h2>
					<p style={{ color: '#666', lineHeight: 1.6 }}>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Modi aspernatur repudiandae magni quae ipsam
						perspiciatis harum similique ratione nulla temporibus
						sunt eos natus exercitationem ipsa id error esse, alias
						velit!
					</p>
				</div>

				{/* Training Card */}
				<div className="content-card">
					<h2
						style={{
							color: colors.red,
							marginBottom: '1rem',
							fontSize: '1.5rem',
						}}>
						Und noch ein Feld für Text
					</h2>
					<p style={{ color: '#666', lineHeight: 1.6 }}>
						Lorem ipsum dolor sit amet consectetur, adipisicing
						elit. Tempore hic ad repudiandae, laboriosam delectus
						repellat saepe doloremque omnis minus dignissimos.
						Libero quos culpa consequuntur iure reiciendis ullam
						minus dicta provident.
					</p>
				</div>
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					gap: '4rem',
					flexWrap: 'wrap',
				}}>
				<div
					style={{
						textAlign: 'center',
						padding: '3rem 0',
					}}>
					<a
						href="https://www.mtvgeismar.de/der-verein/mitgliedschaft/"
						target="_blank"
						rel="noopener noreferrer"
						className="cta-button">
						Unser Fan-Shop
					</a>
				</div>

				<div
					style={{
						textAlign: 'center',
						padding: '3rem 0',
					}}>
					<a
						href="https://www.mtvgeismar.de/der-verein/mitgliedschaft/"
						target="_blank"
						rel="noopener noreferrer"
						className="cta-button">
						Mitglied werden
					</a>
				</div>
			</div>

			<style>{`
        .content-card {
          background: ${colors.white};
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          transition: transform 0.3s, box-shadow 0.3s;
          cursor: pointer;
        }
        
        .content-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        .cta-button {
          background: linear-gradient(90deg, ${colors.red} 0%, ${colors.red2} 100%);
          color: ${colors.white};
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        a:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        @media (max-width: 640px) {
          .cta-button {
            width: 100%;
            display: block;
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
            padding: 1.2rem 0;
          }
          div[style*='flex-direction: row'] > div {
            width: 100%;
            padding: 1.2rem 0 !important;
          }
          div[style*='flex-direction: row'] {
            flex-direction: column !important;
            gap: 0.5rem !important;
            align-items: stretch !important;
          }
        }
      `}</style>
		</div>
	);
};

export default Home;
