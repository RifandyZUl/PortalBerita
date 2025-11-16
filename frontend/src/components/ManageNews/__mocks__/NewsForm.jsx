// Mock NewsForm untuk testing
// File ini akan otomatis digunakan oleh Vitest ketika NewsForm di-mock

const NewsForm = ({ selectedArticle, setSelectedArticle, setArticles, onSuccess }) => {
  // Mock component yang tidak error - tidak akan fetch categories/authors
  return (
    <div data-testid="news-form">
      <div>News Form</div>
      {selectedArticle && <div data-testid="selected-article">{selectedArticle.title}</div>}
    </div>
  );
};

export default NewsForm;

