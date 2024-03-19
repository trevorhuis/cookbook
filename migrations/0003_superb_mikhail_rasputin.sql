CREATE TRIGGER recipes_fts_delete AFTER DELETE ON recipe
BEGIN
    INSERT INTO recipe_search (recipe_search, title, slug, description) VALUES ('delete', old.title, old.slug, old.description);
END;
