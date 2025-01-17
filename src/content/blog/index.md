---
title: Blog
description: Stream of updates, thoughts and experiments
layout: base.njk
permalink: /blog/index.html
---

# stream/feed/timeline

<section>

## latest entries
{% for post in collections.blog %}
- {{ post.data.date | formatDate }} - [{{ post.data.title }}]({{ baseUrl }}/blog/{{ post.fileSlug }}.html){% if post.data.tags %} [{{ post.data.tags }}]{% endif %}
{% endfor %}

</section> 