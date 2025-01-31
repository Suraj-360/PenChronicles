import React, { useState } from "react";
import "../Styles/FilterPopup.css";
import { RxCross1 } from "react-icons/rx";

const FilterPopup = ({ onClose, applyFilters }) => {
  const categories = [
    "Technology", "Health", "Education", "Lifestyle", "Sports",
    "Finance", "Entertainment", "Travel", "Food", "Business",
    "Politics", "Environment", "Fashion", "Science", "Art",
  ];

  const [selectedSort, setSelectedSort] = useState("latest");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Apply filters
  const handleApply = () => {
    applyFilters({
      sortBy: selectedSort,
      categories: selectedCategories,
      startDate,
      endDate,
    });
    onClose();
  };

  // Reset filters
  const handleReset = () => {
    setSelectedSort("latest");
    setSelectedCategories([]);
    setStartDate("");
    setEndDate("");
    applyFilters({ sortBy: "latest", categories: [], startDate: "", endDate: "" });
    onClose();
  };

  return (
    <div className="filter-popup-wrapper">
      <div className="filter-popup">
        <div className="filter-popup-header">
          <h2>Filter Posts</h2>
          <RxCross1 className="close-btn" onClick={onClose} />
        </div>

        <div className="filter-popup-content">
          {/* Sorting Options */}
          <div className="filter-section">
            <h3>Sort By</h3>
            <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)}>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="most-popular">Most Popular</option>
              <option value="highest-rated">Highest Rated</option>
            </select>
          </div>

          {/* Categories */}
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="checkbox-group">
              {categories.map((category) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    value={category.toLowerCase()}
                    checked={selectedCategories.includes(category.toLowerCase())}
                    onChange={() => handleCategoryChange(category.toLowerCase())}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="filter-section">
            <h3>Date Range</h3>
            <div className="date-inputs">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <span>to</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          {/* Apply and Reset Buttons */}
          <div className="filter-popup-footer">
            <button className="apply-btn" onClick={handleApply}>Apply Filters</button>
            <button className="reset-btn" onClick={handleReset}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;
