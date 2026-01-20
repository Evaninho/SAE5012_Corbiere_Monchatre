// // src/pages/NewsPage.jsx

// import React, { useState, useEffect } from 'react';
// import { X } from 'lucide-react';
// // import { getArticles, incrementViews } from '../services/api';
// import { SearchBar } from '../components/news/SearchBar';
// import { NewsFilters } from '../components/news/NewsFilter';
// import { NewsArticle } from '../components/news/NewsArticle';
// import { CommentSection } from '../components/news/CommentSection';
// // import { NEWS_CATEGORIES, SORT_OPTIONS } from '../utils/constants';

// export function NewsPage2() {
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Filtres
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState(NEWS_CATEGORIES.ALL);
//   const [sortBy, setSortBy] = useState(SORT_OPTIONS.RECENT);
  
//   // Modal détail article
//   const [selectedArticle, setSelectedArticle] = useState(null);

//   const styles = {
//     pageContainer: {
//       minHeight: '68.9vh',
//       backgroundColor: '#f5f5f5',
//       padding: '40px 20px',
//       fontFamily: 'Arial, sans-serif'
//     },
//     container: {
//       maxWidth: '1200px',
//       margin: '0 auto'
//     },
//     header: {
//       marginBottom: '40px'
//     },
//     title: {
//       fontSize: '36px',
//       fontWeight: 'bold',
//       color: '#0085C7',
//       marginBottom: '10px'
//     },
//     subtitle: {
//       fontSize: '16px',
//       color: '#666'
//     },
//     filtersContainer: {
//       backgroundColor: 'white',
//       padding: '25px',
//       borderRadius: '15px',
//       boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//       marginBottom: '30px'
//     },
//     filtersGrid: {
//       display: 'grid',
//       gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '2fr 1fr',
//       gap: '20px',
//       marginBottom: '20px'
//     },
//     articlesGrid: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
//       gap: '25px'
//     },
//     loading: {
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       minHeight: '400px',
//       fontSize: '18px',
//       color: '#666'
//     },
//     error: {
//       backgroundColor: '#fee2e2',
//       border: '2px solid #dc2626',
//       borderRadius: '10px',
//       padding: '20px',
//       textAlign: 'center',
//       color: '#dc2626',
//       fontWeight: '600'
//     },
//     emptyState: {
//       textAlign: 'center',
//       padding: '60px 20px',
//       backgroundColor: 'white',
//       borderRadius: '15px',
//       boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//     },
//     emptyIcon: {
//       fontSize: '64px',
//       marginBottom: '20px'
//     },
//     emptyText: {
//       fontSize: '18px',
//       color: '#666'
//     },
    
//     // Modal styles
//     modalOverlay: {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: 'rgba(0, 0, 0, 0.7)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       zIndex: 1000,
//       padding: '20px',
//       overflowY: 'auto'
//     },
//     modalContent: {
//       backgroundColor: 'white',
//       borderRadius: '15px',
//       maxWidth: '900px',
//       width: '100%',
//       maxHeight: '90vh',
//       overflowY: 'auto',
//       position: 'relative'
//     },
//     modalHeader: {
//       position: 'sticky',
//       top: 0,
//       backgroundColor: 'white',
//       padding: '20px',
//       borderBottom: '1px solid #e5e7eb',
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       zIndex: 1
//     },
//     modalTitle: {
//       fontSize: '24px',
//       fontWeight: 'bold',
//       color: '#333',
//       flex: 1,
//       paddingRight: '20px'
//     },
//     closeButton: {
//       width: '40px',
//       height: '40px',
//       borderRadius: '50%',
//       border: 'none',
//       backgroundColor: '#f3f4f6',
//       cursor: 'pointer',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       transition: 'all 0.2s'
//     },
//     modalBody: {
//       padding: '30px'
//     },
//     articleImage: {
//       width: '100%',
//       maxHeight: '400px',
//       objectFit: 'cover',
//       borderRadius: '10px',
//       marginBottom: '20px'
//     },
//     articleMeta: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '15px',
//       fontSize: '14px',
//       color: '#666',
//       marginBottom: '20px'
//     },
//     articleContent: {
//       fontSize: '16px',
//       lineHeight: '1.8',
//       color: '#333',
//       marginBottom: '30px'
//     }
//   };

//   // Charger les articles
//   useEffect(() => {
//     loadArticles();
//   }, [selectedCategory, sortBy]);

//   // Recherche avec délai
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (searchTerm) {
//         loadArticles();
//       }
//     }, 500);

//     return () => clearTimeout(timeoutId);
//   }, [searchTerm]);

//   const loadArticles = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const filters = {
//         category: selectedCategory === NEWS_CATEGORIES.ALL ? '' : selectedCategory,
//         search: searchTerm,
//         sort: sortBy
//       };

//       const data = await getArticles(filters);
//       setArticles(data.data || []);

//     } catch (err) {
//       console.error('Erreur chargement articles:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Ouvrir le détail d'un article
//   const handleArticleClick = async (article) => {
//     setSelectedArticle(article);
//     try {
//       await incrementViews(article.id);
//     } catch (error) {
//       console.error('Erreur incrémentation vues:', error);
//     }
//   };

//   // Fermer le modal
//   const handleCloseModal = () => {
//     setSelectedArticle(null);
//   };

//   // Mise à jour après interaction
//   const handleArticleUpdate = (articleId, updates) => {
//     setArticles(articles.map(article => 
//       article.id === articleId
//         ? {
//             ...article,
//             user_interaction: {
//               ...article.user_interaction,
//               ...updates
//             }
//           }
//         : article
//     ));
//   };

//   if (loading && articles.length === 0) {
//     return (
//       <div style={styles.pageContainer}>
//         <div style={styles.loading}>Chargement des actualités...</div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.pageContainer}>
//       <div style={styles.container}>
//         {/* En-tête */}
//         <div style={styles.header}>
//           <h1 style={styles.title}>Actualités Olympiques</h1>
//           <p style={styles.subtitle}>
//             Restez informé des dernières nouvelles et analyses
//           </p>
//         </div>

//         {/* Filtres */}
//         <div style={styles.filtersContainer}>
//           <div style={styles.filtersGrid}>
//             <SearchBar
//               value={searchTerm}
//               onChange={setSearchTerm}
//             />
//             <div>{/* Espace pour alignement */}</div>
//           </div>

//           <NewsFilters
//             selectedCategory={selectedCategory}
//             onCategoryChange={setSelectedCategory}
//             sortBy={sortBy}
//             onSortChange={setSortBy}
//           />
//         </div>

//         {/* Erreur */}
//         {error && <div style={styles.error}>{error}</div>}

//         {/* Liste des articles */}
//         {articles.length === 0 && !loading ? (
//           <div style={styles.emptyState}>
//             <div style={styles.emptyIcon}>📰</div>
//             <p style={styles.emptyText}>Aucune actualité trouvée</p>
//           </div>
//         ) : (
//           <div style={styles.articlesGrid}>
//             {articles.map(article => (
//               <NewsArticle
//                 key={article.id}
//                 article={article}
//                 onArticleClick={handleArticleClick}
//                 onUpdate={handleArticleUpdate}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Modal Détail Article */}
//       {selectedArticle && (
//         <div
//           style={styles.modalOverlay}
//           onClick={(e) => {
//             if (e.target === e.currentTarget) {
//               handleCloseModal();
//             }
//           }}
//         >
//           <div style={styles.modalContent}>
//             {/* Header du modal */}
//             <div style={styles.modalHeader}>
//               <h2 style={styles.modalTitle}>{selectedArticle.title}</h2>
//               <button
//                 style={styles.closeButton}
//                 onClick={handleCloseModal}
//                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
//                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* Corps du modal */}
//             <div style={styles.modalBody}>
//               {/* Image */}
//               {selectedArticle.image_url && (
//                 <img
//                   src={selectedArticle.image_url}
//                   alt={selectedArticle.title}
//                   style={styles.articleImage}
//                 />
//               )}

//               {/* Métadonnées */}
//               <div style={styles.articleMeta}>
//                 <span style={{
//                   backgroundColor: '#0085C7',
//                   color: 'white',
//                   padding: '4px 12px',
//                   borderRadius: '15px',
//                   fontSize: '12px',
//                   fontWeight: '600'
//                 }}>
//                   {selectedArticle.category}
//                 </span>
//                 <span>{selectedArticle.author?.name || 'Rédaction'}</span>
//                 <span>•</span>
//                 <span>{selectedArticle.views || 0} vues</span>
//               </div>

//               {/* Contenu */}
//               <div
//                 style={styles.articleContent}
//                 dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
//               />

//               {/* Section commentaires */}
//               <CommentSection articleId={selectedArticle.id} />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }