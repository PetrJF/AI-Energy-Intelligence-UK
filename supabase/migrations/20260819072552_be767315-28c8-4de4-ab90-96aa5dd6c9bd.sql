ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'unreviewed',
  ADD COLUMN IF NOT EXISTS change_note text;

ALTER TABLE public.blog_posts DROP CONSTRAINT IF EXISTS blog_posts_review_status_check;
ALTER TABLE public.blog_posts
  ADD CONSTRAINT blog_posts_review_status_check
  CHECK (review_status IN ('unreviewed','in_review','reviewed'));

UPDATE public.blog_posts SET author_name = 'Peter Flynn' WHERE author_name IS NULL;
UPDATE public.blog_posts SET review_status = 'unreviewed' WHERE review_status IS NULL;