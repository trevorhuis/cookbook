class Recipe < ApplicationRecord
  has_one_attached :featured_image
  has_rich_text :content
  validates :name, presence: true

  scope :search, ->(query) {
    return all if query.blank?

    joins("LEFT JOIN action_text_rich_texts ON action_text_rich_texts.record_id = recipes.id AND action_text_rich_texts.record_type = 'Recipe' AND action_text_rich_texts.name = 'content'")
      .where("recipes.name LIKE ? OR action_text_rich_texts.body LIKE ?", "%#{query}%", "%#{query}%")
      .distinct
  }
end
