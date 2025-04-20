class Recipe < ApplicationRecord
  has_one_attached :featured_image
  has_rich_text :content
  validates :name, presence: true
end
