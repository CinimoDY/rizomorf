---
title: feed
description: Stream of updates, thoughts and experiments
layout: base.njk
permalink: /blog/index.html
---

# feed

<section>

## entries
{% for post in collections.blog %}
- {{ post.data.date | formatDate }} - [{{ post.data.title }}]({{ baseUrl }}/blog/{{ post.fileSlug }}.html)
{% endfor %}

</section> 