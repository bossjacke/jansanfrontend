import React from 'react';

const CategoryFilter = ({ selectedCategory, setSelectedCategory, products }) => {
  const biogasProducts = products.filter(p => p.type === 'biogas');
  const fertilizerProducts = products.filter(p => p.type === 'fertilizer');

  const btnClass = (value) =>
    'category-filter-button' +
    (selectedCategory === value ? ' category-filter-button--active' : '');

  return (
    <div className="category-filter">
      <div className="category-filter-group" role="group">
        <button
          type="button"
          className={btnClass('all')}
          onClick={() => setSelectedCategory('all')}
        >
          All Products ({products.length})
        </button>
        <button
          type="button"
          className={btnClass('biogas')}
          onClick={() => setSelectedCategory('biogas')}
        >
          🔥 Biogas Units ({biogasProducts.length})
        </button>
        <button
          type="button"
          className={btnClass('fertilizer')}
          onClick={() => setSelectedCategory('fertilizer')}
        >
          🌱 Fertilizers ({fertilizerProducts.length})
        </button>
      </div>
    </div>
  );
};

export default CategoryFilter;