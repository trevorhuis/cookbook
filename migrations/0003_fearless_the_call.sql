-- Custom SQL migration file, put you code below! --
CREATE VIRTUAL TABLE menu_search USING fts5(title, description, slug);
