---
title: feed
description: Stream of updates, thoughts and experiments
layout: base.njk
permalink: /blog/index.html
---

<section class="blog-feed">

# Updates & Experiments

<article class="blog-entry">
  <div class="post-date">2025-01-26 04:52</div>
  <h2><a href="{{ baseUrl }}/dos-games/">Play Spacewar in your browser</a></h2>
  <div class="post-description">Classic space combat game reimagined for modern browsers</div>
</article>

{% for post in collections.blog %}
<article class="blog-entry">
  <div class="post-date">{{ post.data.date | formatDate }}</div>
  <h2><a href="{{ baseUrl }}/blog/{{ post.fileSlug }}.html">{{ post.data.title }}</a></h2>
  {% if post.data.description %}
  <div class="post-description">{{ post.data.description }}</div>
  {% endif %}
</article>
{% endfor %}

</section>

<style>
.blog-feed {
  max-width: var(--content-max-width);
  margin: 0 auto;
}

.blog-entry {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--dos-yellow);
}

.blog-entry:last-child {
  border-bottom: none;
}

.post-date {
  color: var(--dos-dim);
  font-size: 0.9em;
  margin-bottom: 0.5rem;
  font-family: 'Perfect DOS VGA 437', monospace;
}

.blog-entry h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2em;
}

.blog-entry h2 a {
  color: var(--dos-yellow);
  text-decoration: none;
}

.blog-entry h2 a:hover {
  text-decoration: underline;
}

.post-description {
  color: var(--dos-dim);
  font-size: 0.95em;
  line-height: 1.5;
}
</style> 