CREATE TRIGGER recipes_fts_insert AFTER INSERT ON recipe
BEGIN
    INSERT INTO recipe_search (title, slug, description) VALUES (new.title, new.slug, new.description);
END;